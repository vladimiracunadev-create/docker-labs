from sqlalchemy.orm import Session

from app.models import Customer, Order, OrderLine, Product


def seed_initial_data(db: Session) -> None:
    if (
        db.query(Customer).count() > 0
        or db.query(Product).count() > 0
        or db.query(Order).count() > 0
    ):
        return

    customers = [
        Customer(name="Acme Retail", email="ops@acme-retail.example.com"),
        Customer(name="Northwind Partners", email="sales@northwind.example.com"),
        Customer(name="Bluebird Health", email="supply@bluebird.example.com"),
    ]

    products = [
        Product(
            sku="LAP-14-PRO",
            name="Laptop Pro 14",
            description="Workstation para equipos comerciales y operativos.",
            price=1499.90,
            stock=7,
        ),
        Product(
            sku="DOCK-USB-C",
            name="Dock USB-C",
            description="Docking station para puestos hibridos.",
            price=189.50,
            stock=22,
        ),
        Product(
            sku="MON-27-4K",
            name="Monitor 27 4K",
            description="Monitor de alta resolucion para equipos de diseno y analitica.",
            price=449.00,
            stock=4,
        ),
        Product(
            sku="KEY-MECH-01",
            name="Teclado mecanico",
            description="Periferico premium para equipos que trabajan con alto volumen de texto.",
            price=129.00,
            stock=3,
        ),
        Product(
            sku="CAM-4K-TEAM",
            name="Camara 4K Team",
            description="Camara para salas de reuniones hibridas y sesiones de soporte remoto.",
            price=249.00,
            stock=10,
        ),
    ]

    confirmed_order_a = Order(
        customer=customers[0],
        status="confirmed",
        total_amount=1878.90,
        lines=[
            OrderLine(product=products[0], quantity=1, unit_price=1499.90, line_total=1499.90),
            OrderLine(product=products[1], quantity=2, unit_price=189.50, line_total=379.00),
        ],
    )
    confirmed_order_b = Order(
        customer=customers[1],
        status="confirmed",
        total_amount=1027.00,
        lines=[
            OrderLine(product=products[2], quantity=2, unit_price=449.00, line_total=898.00),
            OrderLine(product=products[3], quantity=1, unit_price=129.00, line_total=129.00),
        ],
    )
    draft_order = Order(
        customer=customers[2],
        status="draft",
        total_amount=498.00,
        lines=[
            OrderLine(product=products[4], quantity=2, unit_price=249.00, line_total=498.00),
        ],
    )
    cancelled_order = Order(
        customer=customers[0],
        status="cancelled",
        total_amount=189.50,
        lines=[
            OrderLine(product=products[1], quantity=1, unit_price=189.50, line_total=189.50),
        ],
    )

    db.add_all(
        customers
        + products
        + [confirmed_order_a, confirmed_order_b, draft_order, cancelled_order]
    )
    db.commit()
