import argparse
import asyncio
from datetime import datetime, timezone
from pathlib import Path
import sys

# Ensure `backend/` is on sys.path when run directly as `python scripts/seed_demo_data.py`
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.security import get_password_hash
from app.db.mongodb import close_mongo_connection, connect_to_mongo, get_database

DEMO_MARKER_ADDRESS = "Demo Delivery Hub, Bengaluru"

DEMO_USERS = [
    {
        "name": "SmartCart Admin",
        "email": "admin@smartcart.demo",
        "password_plain": "AdminDemo123!",
        "role": "admin",
    },
    {
        "name": "Demo Seller Store",
        "email": "seller@smartcart.demo",
        "password_plain": "SellerDemo123!",
        "role": "seller",
    },
    {
        "name": "Demo Customer",
        "email": "customer@smartcart.demo",
        "password_plain": "CustomerDemo123!",
        "role": "customer",
    },
]

DEMO_PRODUCTS = [
    {
        "title": "AeroSound Wireless ANC Headphones",
        "description": "Over-ear active noise cancelling headphones with 35-hour battery life and USB-C fast charging.",
        "price": 149.99,
        "category": "Electronics",
        "stock": 25,
        "imageUrl": "https://via.placeholder.com/400x300?text=ANC+Headphones",
    },
    {
        "title": "ErgoFlow Mechanical Keyboard 75%",
        "description": "Compact hot-swappable mechanical keyboard with tactile switches and dual-mode wireless support.",
        "price": 119.00,
        "category": "Electronics",
        "stock": 18,
        "imageUrl": "https://via.placeholder.com/400x300?text=Mechanical+Keyboard",
    },
    {
        "title": "BrewCraft Insulated Pour-Over Carafe",
        "description": "Double-wall borosilicate and stainless steel coffee carafe that keeps brews hot for hours.",
        "price": 44.50,
        "category": "Home & Kitchen",
        "stock": 40,
        "imageUrl": "https://via.placeholder.com/400x300?text=Pour-Over+Carafe",
    },
    {
        "title": "UrbanTrek Commuter Backpack 24L",
        "description": "Water-resistant everyday backpack with padded 16-inch laptop sleeve and hidden luggage strap.",
        "price": 79.00,
        "category": "Accessories",
        "stock": 30,
        "imageUrl": "https://via.placeholder.com/400x300?text=Commuter+Backpack",
    },
]


async def reset_demo_data(db) -> None:
    demo_emails = [u["email"].lower() for u in DEMO_USERS]
    demo_users = await db["users"].find({"email": {"$in": demo_emails}}).to_list(length=20)
    demo_user_ids = [str(u["_id"]) for u in demo_users]

    if demo_user_ids:
        await db["users"].delete_many({"_id": {"$in": [u["_id"] for u in demo_users]}})
        await db["carts"].delete_many({"user_id": {"$in": demo_user_ids}})
        await db["orders"].delete_many({"user_id": {"$in": demo_user_ids}})
        await db["reviews"].delete_many({"user_id": {"$in": demo_user_ids}})
        await db["products"].delete_many({"seller_id": {"$in": demo_user_ids}})

    await db["orders"].delete_many({"shipping_address": DEMO_MARKER_ADDRESS})


async def seed_demo_data(reset: bool = False) -> None:
    await connect_to_mongo()
    db = get_database()
    now = datetime.now(timezone.utc)

    if reset:
        await reset_demo_data(db)

    # 1. Seed / fetch demo users
    user_map: dict[str, dict] = {}
    for u in DEMO_USERS:
        email = u["email"].lower()
        existing = await db["users"].find_one({"email": email})
        if existing:
            user_map[u["role"]] = existing
        else:
            doc = {
                "name": u["name"],
                "email": email,
                "password": get_password_hash(u["password_plain"]),
                "role": u["role"],
                "createdAt": now,
            }
            res = await db["users"].insert_one(doc)
            doc["_id"] = res.inserted_id
            user_map[u["role"]] = doc

    seller_id = str(user_map["seller"]["_id"])
    customer_id = str(user_map["customer"]["_id"])
    customer_name = user_map["customer"]["name"]

    # 2. Seed / fetch demo products
    seeded_products: list[dict] = []
    for p in DEMO_PRODUCTS:
        existing_prod = await db["products"].find_one(
            {"title": p["title"], "seller_id": seller_id}
        )
        if existing_prod:
            seeded_products.append(existing_prod)
        else:
            doc = {
                **p,
                "seller_id": seller_id,
                "rating": 0.0,
                "numReviews": 0,
                "createdAt": now,
            }
            res = await db["products"].insert_one(doc)
            doc["_id"] = res.inserted_id
            seeded_products.append(doc)

    # 3. Seed sample review & recalculate rating on first product
    first_prod = seeded_products[0]
    first_prod_id = str(first_prod["_id"])
    existing_review = await db["reviews"].find_one(
        {"product_id": first_prod_id, "user_id": customer_id}
    )
    if not existing_review:
        await db["reviews"].insert_one(
            {
                "product_id": first_prod_id,
                "user_id": customer_id,
                "user_name": customer_name,
                "rating": 5,
                "comment": "Crisp sound and comfortable fit for daily study sessions.",
                "createdAt": now,
            }
        )

    reviews_for_first = await db["reviews"].find({"product_id": first_prod_id}).to_list(length=500)
    if reviews_for_first:
        avg_rating = round(
            sum(float(r.get("rating", 0)) for r in reviews_for_first) / len(reviews_for_first),
            1,
        )
        await db["products"].update_one(
            {"_id": first_prod["_id"]},
            {"$set": {"rating": avg_rating, "numReviews": len(reviews_for_first)}},
        )

    # 4. Seed sample order for demo customer
    existing_order = await db["orders"].find_one(
        {"user_id": customer_id, "shipping_address": DEMO_MARKER_ADDRESS}
    )
    if not existing_order and len(seeded_products) >= 2:
        second_prod = seeded_products[1]
        order_items = [
            {
                "product_id": str(second_prod["_id"]),
                "title": second_prod["title"],
                "price": float(second_prod["price"]),
                "quantity": 1,
            }
        ]
        total = round(sum(item["price"] * item["quantity"] for item in order_items), 2)
        await db["orders"].insert_one(
            {
                "user_id": customer_id,
                "items": order_items,
                "total_amount": total,
                "shipping_address": DEMO_MARKER_ADDRESS,
                "payment_method": "UPI",
                "status": "Confirmed",
                "createdAt": now,
            }
        )

    print("Seed completed successfully!")
    for u in DEMO_USERS:
        print(f"  [{u['role']}] {u['email']} / {u['password_plain']}")

    await close_mongo_connection()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed SmartCart AI demo data.")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Remove existing demo records before re-seeding.",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(seed_demo_data(reset=args.reset))