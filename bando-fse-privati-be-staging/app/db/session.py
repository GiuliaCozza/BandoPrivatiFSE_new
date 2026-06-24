import os

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings


class Base(DeclarativeBase):
    pass


db_search_path = os.getenv("DB_SEARCH_PATH", '"bando-fse-privati-schema",public')

engine = create_async_engine(
    settings.database_url,
    pool_size=settings.db_pool_max_size,
    max_overflow=0,
    pool_pre_ping=True,
    connect_args={
        "server_settings": {
            "search_path": db_search_path,
        }
    },
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
