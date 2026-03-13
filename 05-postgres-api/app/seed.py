from sqlalchemy.orm import Session

from app.models import Customer, Product


def seed_initial_data(db: Session) -> None:
    if db.query(Customer).count() > 0 or db.query(Product).count() > 0:
        return

    customers = [
        Customer(name="Acme Retail", email="ops@acme-retail.example.com"),
        Customer(name="Northwind Partners", email="sales@northwind.example.com"),
    ]

    products = [
        Product(
            sku="LAP-14-PRO",
            name="Laptop Pro 14",
            description="Workstation para equipos comerciales y operativos.",
            price=1499.90,
            stock=12,
        ),
        Product(
            sku="DOCK-USB-C",
            name="Dock USB-C",
            description="Docking station para puestos hibridos.",
            price=189.50,
            stock=28,
        ),
        Product(
            sku="MON-27-4K",
            name="Monitor 27 4K",
            description="Monitor de alta resolucion para equipos de diseno y analitica.",
            price=449.00,
            stock=6,
        ),
    ]

    db.add_all(customers + products)
    db.commit()
