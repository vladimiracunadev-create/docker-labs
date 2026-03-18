import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


TEST_DB_PATH = Path("test_inventory_core.sqlite")
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH.as_posix()}"

from app.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.seed import seed_initial_data  # noqa: E402


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        seed_initial_data(db)
    yield
    Base.metadata.drop_all(bind=engine)
    if TEST_DB_PATH.exists():
        TEST_DB_PATH.unlink()


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def get_product_by_sku(client: TestClient, sku: str) -> dict:
    response = client.get("/products")
    response.raise_for_status()
    products = response.json()
    return next(product for product in products if product["sku"] == sku)


def test_summary_and_insights_expose_business_context(client: TestClient):
    summary_response = client.get("/summary")
    assert summary_response.status_code == 200
    assert "X-Process-Time-Ms" in summary_response.headers

    summary = summary_response.json()
    assert summary == {
        "customers": 3,
        "products": 5,
        "orders": 4,
        "active_products": 5,
        "low_stock_products": 2,
        "revenue": "2905.90",
    }

    insights_response = client.get("/insights")
    assert insights_response.status_code == 200
    insights = insights_response.json()

    assert {item["status"]: item["orders"] for item in insights["orders_by_status"]} == {
        "cancelled": 1,
        "confirmed": 2,
        "draft": 1,
    }
    assert insights["top_customers"][0]["name"] == "Acme Retail"
    assert insights["restock_recommendations"][0]["sku"] in {"KEY-MECH-01", "MON-27-4K"}

    metrics_response = client.get("/metrics")
    assert metrics_response.status_code == 200
    assert "inventory_restock_recommendations_total" in metrics_response.text
    assert 'inventory_orders_total{status="confirmed"} 2' in metrics_response.text


def test_draft_confirm_cancel_flow_preserves_stock_integrity(client: TestClient):
    camera = get_product_by_sku(client, "CAM-4K-TEAM")
    assert camera["stock"] == 10

    draft_response = client.post(
        "/orders",
        json={
            "customer_id": 1,
            "status": "draft",
            "items": [{"product_id": camera["id"], "quantity": 2}],
        },
    )
    assert draft_response.status_code == 201
    draft_order = draft_response.json()
    assert draft_order["status"] == "draft"

    camera_after_draft = get_product_by_sku(client, "CAM-4K-TEAM")
    assert camera_after_draft["stock"] == 10

    confirm_response = client.patch(
        f"/orders/{draft_order['id']}",
        json={"status": "confirmed"},
    )
    assert confirm_response.status_code == 200
    assert confirm_response.json()["status"] == "confirmed"

    camera_after_confirm = get_product_by_sku(client, "CAM-4K-TEAM")
    assert camera_after_confirm["stock"] == 8

    cancel_response = client.patch(
        f"/orders/{draft_order['id']}",
        json={"status": "cancelled"},
    )
    assert cancel_response.status_code == 200
    assert cancel_response.json()["status"] == "cancelled"

    camera_after_cancel = get_product_by_sku(client, "CAM-4K-TEAM")
    assert camera_after_cancel["stock"] == 10

    illegal_transition = client.patch(
        f"/orders/{draft_order['id']}",
        json={"status": "confirmed"},
    )
    assert illegal_transition.status_code == 409


def test_filters_keep_contracts_predictable(client: TestClient):
    draft_orders = client.get("/orders", params={"status": "draft", "limit": 5})
    assert draft_orders.status_code == 200
    assert len(draft_orders.json()) == 1
    assert draft_orders.json()[0]["status"] == "draft"

    low_stock_products = client.get("/products", params={"low_stock_only": "true", "limit": 10})
    assert low_stock_products.status_code == 200
    assert {product["sku"] for product in low_stock_products.json()} == {"MON-27-4K", "KEY-MECH-01"}

    active_customers = client.get("/customers", params={"status": "active", "limit": 10})
    assert active_customers.status_code == 200
    assert len(active_customers.json()) == 3
