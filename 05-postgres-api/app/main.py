from datetime import datetime, timezone
from decimal import Decimal

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.responses import HTMLResponse
from sqlalchemy import func, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.database import Base, engine, get_db
from app.models import Customer, Order, OrderLine, Product
from app.schemas import (
    CustomerCreate,
    CustomerRead,
    HealthResponse,
    InventorySummary,
    OrderCreate,
    OrderRead,
    OrderStatusUpdate,
    ProductCreate,
    ProductRead,
    ReadinessResponse,
)
from app.seed import seed_initial_data


SERVICE_NAME = "inventory-core"
SERVICE_VERSION = "1.0.0"

app = FastAPI(
    title="Inventory Core API",
    version=SERVICE_VERSION,
    summary="Servicio transaccional para clientes, productos y pedidos.",
    description=(
        "Inventory Core demuestra como levantar un backend con FastAPI y PostgreSQL "
        "como pieza central de un sistema comercial modular."
    ),
)


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        seed_initial_data(db)


@app.get("/", response_class=HTMLResponse, tags=["system"])
def root() -> HTMLResponse:
    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inventory Core</title>
        <style>
            :root {{
                --bg: #f5efe6;
                --panel: rgba(255, 251, 245, 0.95);
                --text: #17212b;
                --muted: #5e6976;
                --line: rgba(23, 33, 43, 0.12);
                --accent: #1d6f52;
                --accent-soft: rgba(29, 111, 82, 0.12);
                --shadow: 0 18px 40px rgba(34, 31, 25, 0.12);
            }}
            * {{ box-sizing: border-box; }}
            body {{
                margin: 0;
                font-family: "Trebuchet MS", "Segoe UI", sans-serif;
                color: var(--text);
                background:
                    radial-gradient(circle at top left, rgba(29, 111, 82, 0.18), transparent 28%),
                    radial-gradient(circle at top right, rgba(217, 106, 59, 0.12), transparent 24%),
                    linear-gradient(180deg, #fbf7f0 0%, #efe4d6 100%);
            }}
            main {{
                max-width: 1200px;
                margin: 0 auto;
                padding: 28px 18px 40px;
            }}
            .hero, .card {{
                background: var(--panel);
                border: 1px solid var(--line);
                border-radius: 24px;
                box-shadow: var(--shadow);
            }}
            .hero {{ padding: 28px; margin-bottom: 20px; }}
            .eyebrow {{
                display: inline-flex;
                padding: 7px 12px;
                border-radius: 999px;
                background: var(--accent-soft);
                color: var(--accent);
                font-size: 0.82rem;
                font-weight: 700;
                letter-spacing: 0.06em;
                text-transform: uppercase;
            }}
            h1 {{
                margin: 14px 0 10px;
                font-size: clamp(2rem, 5vw, 3.5rem);
                line-height: 0.96;
                max-width: 11ch;
            }}
            p, .muted, li {{ color: var(--muted); }}
            .actions, .metrics, .layout, .list {{
                display: grid;
                gap: 16px;
            }}
            .actions {{
                display: flex;
                flex-wrap: wrap;
                margin-top: 18px;
            }}
            .metrics {{
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                margin-top: 22px;
            }}
            .metric, .card {{ padding: 18px; }}
            .metric-value {{ font-size: 1.8rem; font-weight: 700; margin-top: 8px; }}
            .layout {{ grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr); }}
            .tag {{
                display: inline-flex;
                align-items: center;
                padding: 6px 10px;
                border-radius: 999px;
                border: 1px solid var(--line);
                background: rgba(255,255,255,.8);
                font-size: 0.84rem;
                margin-right: 8px;
                margin-bottom: 8px;
            }}
            .item {{
                padding: 14px;
                border-radius: 18px;
                border: 1px solid var(--line);
                background: rgba(255,255,255,.72);
            }}
            .btn {{
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 12px 16px;
                border-radius: 999px;
                border: 1px solid transparent;
                background: var(--accent);
                color: white;
                text-decoration: none;
                font-weight: 600;
            }}
            .btn.secondary {{
                background: rgba(255,255,255,.75);
                color: var(--text);
                border-color: var(--line);
            }}
            code {{ font-family: Consolas, Monaco, monospace; }}
            @media (max-width: 900px) {{
                .layout {{ grid-template-columns: 1fr; }}
            }}
        </style>
    </head>
    <body>
        <main>
            <section class="hero">
                <span class="eyebrow">Core Service</span>
                <h1>Inventory Core</h1>
                <p>
                    Este entorno existe para resolver el nucleo transaccional de un sistema comercial: clientes,
                    productos, pedidos y control basico de inventario con consistencia relacional.
                </p>
                <div class="actions">
                    <a class="btn" href="/docs">Abrir API y Swagger</a>
                    <a class="btn secondary" href="http://localhost:9090">Volver al menu principal</a>
                </div>
                <div class="metrics">
                    <div class="card metric"><div class="muted">Clientes</div><div id="customers" class="metric-value">-</div></div>
                    <div class="card metric"><div class="muted">Productos</div><div id="products" class="metric-value">-</div></div>
                    <div class="card metric"><div class="muted">Pedidos</div><div id="orders" class="metric-value">-</div></div>
                    <div class="card metric"><div class="muted">Revenue confirmado</div><div id="revenue" class="metric-value">-</div></div>
                </div>
            </section>

            <section class="layout">
                <section class="card">
                    <h2>Objetivo del entorno</h2>
                    <p>
                        Inventory Core es la base de trabajo para portales, gateways y servicios auxiliares. Su objetivo
                        es que este repositorio tenga un backend serio que luego pueda ser consumido por otras piezas,
                        como el Operations Portal del laboratorio 09.
                    </p>
                    <div>
                        <span class="tag">FastAPI</span>
                        <span class="tag">PostgreSQL 15</span>
                        <span class="tag">Clientes</span>
                        <span class="tag">Productos</span>
                        <span class="tag">Pedidos</span>
                    </div>
                    <div class="list" style="margin-top:16px;">
                        <div class="item">
                            <strong>Que resuelve</strong>
                            <div class="muted">Consistencia relacional, stock, pedidos y resumen operativo para otros sistemas.</div>
                        </div>
                        <div class="item">
                            <strong>Como se usa</strong>
                            <div class="muted">Puedes operarlo desde Swagger o consumirlo desde otro entorno del repositorio.</div>
                        </div>
                        <div class="item">
                            <strong>Por que existe</strong>
                            <div class="muted">Demuestra cuando Docker encapsula un backend de negocio real y no solo un ejemplo tecnico.</div>
                        </div>
                    </div>
                </section>

                <aside class="list">
                    <section class="card">
                        <h2>Entradas del sistema</h2>
                        <div class="list">
                            <div class="item"><strong>Portada</strong><div class="muted"><code>GET /</code></div></div>
                            <div class="item"><strong>Swagger</strong><div class="muted"><code>GET /docs</code></div></div>
                            <div class="item"><strong>Health</strong><div class="muted"><code>GET /health</code></div></div>
                            <div class="item"><strong>Summary</strong><div class="muted"><code>GET /summary</code></div></div>
                        </div>
                    </section>

                    <section class="card">
                        <h2>Integracion sugerida</h2>
                        <p>
                            Usa este entorno como backend principal y conecta paneles como el laboratorio 09 para mostrar
                            la operacion con una interfaz mas cercana al usuario final.
                        </p>
                    </section>
                </aside>
            </section>
        </main>

        <script>
            async function loadSummary() {{
                const response = await fetch("/summary");
                const data = await response.json();
                document.getElementById("customers").textContent = data.customers;
                document.getElementById("products").textContent = data.products;
                document.getElementById("orders").textContent = data.orders;
                document.getElementById("revenue").textContent = new Intl.NumberFormat("es-CL", {{
                    style: "currency",
                    currency: "USD"
                }}).format(Number(data.revenue || 0));
            }}

            loadSummary().catch(() => {{
                document.getElementById("revenue").textContent = "No disponible";
            }});
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html)


@app.get("/health", response_model=HealthResponse, tags=["system"])
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=SERVICE_NAME,
        version=SERVICE_VERSION,
    )


@app.get("/ready", response_model=ReadinessResponse, tags=["system"])
def readiness(db: Session = Depends(get_db)) -> ReadinessResponse:
    db.execute(text("SELECT 1"))
    return ReadinessResponse(
        status="ready",
        database="reachable",
        checked_at=datetime.now(timezone.utc),
    )


@app.get("/summary", response_model=InventorySummary, tags=["dashboard"])
def summary(db: Session = Depends(get_db)) -> InventorySummary:
    revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .filter(Order.status == "confirmed")
        .scalar()
    )
    return InventorySummary(
        customers=db.query(Customer).count(),
        products=db.query(Product).count(),
        orders=db.query(Order).count(),
        active_products=db.query(Product).filter(Product.status == "active").count(),
        low_stock_products=db.query(Product).filter(Product.stock <= 5).count(),
        revenue=Decimal(str(revenue)),
    )


@app.post("/customers", response_model=CustomerRead, status_code=status.HTTP_201_CREATED, tags=["customers"])
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)) -> Customer:
    customer = Customer(name=payload.name, email=payload.email.lower())
    db.add(customer)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A customer with that email already exists.",
        ) from exc
    db.refresh(customer)
    return customer


@app.get("/customers", response_model=list[CustomerRead], tags=["customers"])
def list_customers(db: Session = Depends(get_db)) -> list[Customer]:
    return db.query(Customer).order_by(Customer.created_at.desc()).all()


@app.post("/products", response_model=ProductRead, status_code=status.HTTP_201_CREATED, tags=["products"])
def create_product(payload: ProductCreate, db: Session = Depends(get_db)) -> Product:
    product = Product(
        sku=payload.sku.upper(),
        name=payload.name,
        description=payload.description,
        price=payload.price,
        stock=payload.stock,
    )
    db.add(product)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A product with that SKU already exists.",
        ) from exc
    db.refresh(product)
    return product


@app.get("/products", response_model=list[ProductRead], tags=["products"])
def list_products(
    low_stock_only: bool = Query(default=False),
    db: Session = Depends(get_db),
) -> list[Product]:
    query = db.query(Product).order_by(Product.created_at.desc())
    if low_stock_only:
        query = query.filter(Product.stock <= 5)
    return query.all()


@app.post("/orders", response_model=OrderRead, status_code=status.HTTP_201_CREATED, tags=["orders"])
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> Order:
    customer = db.get(Customer, payload.customer_id)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")

    order = Order(customer_id=payload.customer_id, status="confirmed", total_amount=0)
    db.add(order)

    total_amount = Decimal("0")
    product_ids = [item.product_id for item in payload.items]
    products = (
        db.query(Product)
        .filter(Product.id.in_(product_ids))
        .with_for_update()
        .all()
    )
    products_by_id = {product.id: product for product in products}

    try:
        for item in payload.items:
            product = products_by_id.get(item.product_id)
            if product is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product {item.product_id} not found.",
                )
            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Insufficient stock for product {product.sku}.",
                )

            product.stock -= item.quantity
            line_total = Decimal(str(product.price)) * item.quantity
            total_amount += line_total
            db.add(
                OrderLine(
                    order=order,
                    product_id=product.id,
                    quantity=item.quantity,
                    unit_price=product.price,
                    line_total=line_total,
                )
            )

        order.total_amount = total_amount
        db.commit()
        db.refresh(order)
    except HTTPException:
        db.rollback()
        raise
    return (
        db.query(Order)
        .options(joinedload(Order.lines))
        .filter(Order.id == order.id)
        .one()
    )


@app.get("/orders", response_model=list[OrderRead], tags=["orders"])
def list_orders(db: Session = Depends(get_db)) -> list[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.lines))
        .order_by(Order.created_at.desc())
        .all()
    )


@app.patch("/orders/{order_id}", response_model=OrderRead, tags=["orders"])
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
) -> Order:
    order = (
        db.query(Order)
        .options(joinedload(Order.lines))
        .filter(Order.id == order_id)
        .first()
    )
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    if order.status != "cancelled" and payload.status == "cancelled":
        for line in order.lines:
            product = db.get(Product, line.product_id)
            if product is not None:
                product.stock += line.quantity

    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order
