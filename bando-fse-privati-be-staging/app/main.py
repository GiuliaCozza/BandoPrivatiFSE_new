from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.routes import router as data_router
from app.api.auth_logs import router as auth_logs_router
from app.core.config import settings
from app.core.logging import configure_logging
from app.db.session import get_session

configure_logging(settings.app_name, settings.log_level)

app = FastAPI(title=settings.app_name)

origins = settings.cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # mettere ["*"] se si vuole accettare la chiamata da qualsiasi origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_router)
app.include_router(auth_logs_router)

@app.get("/healthz", tags=["ops"])
async def healthz():
    return {"status": "ok"}

@app.get("/readyz", tags=["ops"])
async def readyz(session: AsyncSession = Depends(get_session)):
    await session.execute(text("SELECT 1"))
    return {"db": "ok"}
