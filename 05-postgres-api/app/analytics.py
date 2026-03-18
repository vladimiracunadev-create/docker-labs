from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models import Customer, Order, OrderLine, Product


LOW_STOCK_THRESHOLD = 5
DEFAULT_RESTOCK_TARGET = 8


def to_decimal(value: Decimal | float | int | None) -> Decimal:
    if isinstance(value, Decimal):
        return value.quantize(Decimal("0.01"))
    return Decimal(str(value or 0)).quantize(Decimal("0.01"))


def build_inventory_summary(db: Session) -> dict:
    revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .filter(Order.status == "confirmed")
        .scalar()
    )
    return {
        "customers": db.query(Customer).count(),
        "products": db.query(Product).count(),
        "orders": db.query(Order).count(),
        "active_products": db.query(Product).filter(Product.status == "active").count(),
        "low_stock_products": db.query(Product).filter(Product.stock <= LOW_STOCK_THRESHOLD).count(),
        "revenue": to_decimal(revenue),
    }


def build_inventory_insights(db: Session) -> dict:
    stock_value = db.query(func.coalesce(func.sum(Product.price * Product.stock), 0)).scalar()

    confirmed_revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .filter(Order.status == "confirmed")
        .scalar()
    )
    cancelled_revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .filter(Order.status == "cancelled")
        .scalar()
    )

    orders_by_status_rows = (
        db.query(
            Order.status,
            func.count(Order.id).label("orders"),
            func.coalesce(func.sum(Order.total_amount), 0).label("revenue"),
        )
        .group_by(Order.status)
        .order_by(Order.status.asc())
        .all()
    )

    top_product_rows = (
        db.query(
            Product.id.label("product_id"),
            Product.sku,
            Product.name,
            func.coalesce(func.sum(OrderLine.quantity), 0).label("units_sold"),
            func.coalesce(func.sum(OrderLine.line_total), 0).label("confirmed_revenue"),
        )
        .join(OrderLine, OrderLine.product_id == Product.id)
        .join(Order, Order.id == OrderLine.order_id)
        .filter(Order.status == "confirmed")
        .group_by(Product.id, Product.sku, Product.name)
        .order_by(
            func.coalesce(func.sum(OrderLine.line_total), 0).desc(),
            func.coalesce(func.sum(OrderLine.quantity), 0).desc(),
        )
        .limit(5)
        .all()
    )

    top_customer_rows = (
        db.query(
            Customer.id.label("customer_id"),
            Customer.name,
            func.count(Order.id).label("orders"),
            func.coalesce(func.sum(Order.total_amount), 0).label("confirmed_revenue"),
            func.max(Order.created_at).label("last_order_at"),
        )
        .join(Order, Order.customer_id == Customer.id)
        .filter(Order.status == "confirmed")
        .group_by(Customer.id, Customer.name)
        .order_by(
            func.coalesce(func.sum(Order.total_amount), 0).desc(),
            func.count(Order.id).desc(),
        )
        .limit(5)
        .all()
    )

    recent_orders = (
        db.query(Order)
        .options(joinedload(Order.customer), joinedload(Order.lines))
        .order_by(Order.created_at.desc())
        .limit(6)
        .all()
    )

    sold_units_rows = (
        db.query(
            OrderLine.product_id,
            func.coalesce(func.sum(OrderLine.quantity), 0).label("units_sold"),
        )
        .join(Order, Order.id == OrderLine.order_id)
        .filter(Order.status == "confirmed")
        .group_by(OrderLine.product_id)
        .all()
    )
    sold_units_by_product = {
        int(row.product_id): int(row.units_sold or 0) for row in sold_units_rows
    }

    restock_recommendations = []
    products = db.query(Product).order_by(Product.stock.asc(), Product.name.asc()).all()
    for product in products:
        units_sold = sold_units_by_product.get(product.id, 0)
        should_restock = product.stock <= LOW_STOCK_THRESHOLD or (
            units_sold > 0 and product.stock < units_sold * 2
        )
        if not should_restock:
            continue

        target_stock = max(DEFAULT_RESTOCK_TARGET, units_sold * 3)
        recommended_units = max(target_stock - product.stock, LOW_STOCK_THRESHOLD + 1 - product.stock, 0)
        urgency = "high" if product.stock <= 2 or (units_sold > 0 and product.stock <= units_sold) else "medium"

        restock_recommendations.append(
            {
                "product_id": product.id,
                "sku": product.sku,
                "name": product.name,
                "stock": product.stock,
                "units_sold": units_sold,
                "recommended_restock_units": int(recommended_units),
                "urgency": urgency,
            }
        )

    restock_recommendations.sort(
        key=lambda item: (
            0 if item["urgency"] == "high" else 1,
            -item["recommended_restock_units"],
            item["sku"],
        )
    )

    return {
        "generated_at": datetime.now(timezone.utc),
        "stock_value": to_decimal(stock_value),
        "revenue_confirmed": to_decimal(confirmed_revenue),
        "revenue_cancelled": to_decimal(cancelled_revenue),
        "orders_by_status": [
            {
                "status": row.status,
                "orders": int(row.orders or 0),
                "revenue": to_decimal(row.revenue),
            }
            for row in orders_by_status_rows
        ],
        "top_products": [
            {
                "product_id": int(row.product_id),
                "sku": row.sku,
                "name": row.name,
                "units_sold": int(row.units_sold or 0),
                "confirmed_revenue": to_decimal(row.confirmed_revenue),
            }
            for row in top_product_rows
        ],
        "top_customers": [
            {
                "customer_id": int(row.customer_id),
                "name": row.name,
                "orders": int(row.orders or 0),
                "confirmed_revenue": to_decimal(row.confirmed_revenue),
                "last_order_at": row.last_order_at,
            }
            for row in top_customer_rows
        ],
        "recent_orders": [
            {
                "id": order.id,
                "customer_id": order.customer_id,
                "customer_name": order.customer.name if order.customer else f"Customer {order.customer_id}",
                "status": order.status,
                "item_count": sum(line.quantity for line in order.lines),
                "total_amount": to_decimal(order.total_amount),
                "created_at": order.created_at,
            }
            for order in recent_orders
        ],
        "restock_recommendations": restock_recommendations[:5],
    }


def render_prometheus_metrics(summary: dict, insights: dict) -> str:
    lines = [
        "# HELP inventory_customers_total Total customers in the inventory core.",
        "# TYPE inventory_customers_total gauge",
        f"inventory_customers_total {summary['customers']}",
        "# HELP inventory_products_total Total products in the inventory core.",
        "# TYPE inventory_products_total gauge",
        f"inventory_products_total {summary['products']}",
        "# HELP inventory_orders_total Orders grouped by status.",
        "# TYPE inventory_orders_total gauge",
    ]

    for row in insights["orders_by_status"]:
        lines.append(f'inventory_orders_total{{status="{row["status"]}"}} {row["orders"]}')

    lines.extend(
        [
            "# HELP inventory_revenue_total Revenue grouped by order status.",
            "# TYPE inventory_revenue_total gauge",
            f'inventory_revenue_total{{status="confirmed"}} {insights["revenue_confirmed"]}',
            f'inventory_revenue_total{{status="cancelled"}} {insights["revenue_cancelled"]}',
            "# HELP inventory_stock_value_usd Estimated stock value in USD.",
            "# TYPE inventory_stock_value_usd gauge",
            f'inventory_stock_value_usd {insights["stock_value"]}',
            "# HELP inventory_low_stock_products_total Products below the low-stock threshold.",
            "# TYPE inventory_low_stock_products_total gauge",
            f'inventory_low_stock_products_total {summary["low_stock_products"]}',
            "# HELP inventory_restock_recommendations_total Products that need replenishment attention.",
            "# TYPE inventory_restock_recommendations_total gauge",
            f'inventory_restock_recommendations_total {len(insights["restock_recommendations"])}',
        ]
    )

    return "\n".join(lines) + "\n"
