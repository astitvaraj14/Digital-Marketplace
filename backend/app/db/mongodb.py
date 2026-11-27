import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger("smartcart.db")


class Database:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


db_instance = Database()


async def connect_to_mongo() -> None:
    logger.info("Connecting to MongoDB Atlas/Instance...")
    db_instance.client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        maxPoolSize=100,
        minPoolSize=10,
    )
    db_instance.db = db_instance.client[settings.DATABASE_NAME]

    await db_instance.db["users"].create_index("email", unique=True)
    await db_instance.db["products"].create_index("category")
    await db_instance.db["products"].create_index("seller_id")
    await db_instance.db["orders"].create_index("user_id")
    await db_instance.db["carts"].create_index("user_id", unique=True)
    logger.info("Connected to MongoDB database: %s", settings.DATABASE_NAME)


async def close_mongo_connection() -> None:
    logger.info("Closing MongoDB connection...")
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed.")


def get_database() -> AsyncIOMotorDatabase:
    return db_instance.db