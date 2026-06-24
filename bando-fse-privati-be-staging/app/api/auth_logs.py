from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.db.models import AccessLog
from app.schemas.auth_logs import AccessLogCreate, AccessLogOut


router = APIRouter(prefix="/auth-logs", tags=["auth-logs"])


@router.post("", response_model=AccessLogOut, status_code=201)
async def create_access_log(
    body: AccessLogCreate,
    session: AsyncSession = Depends(get_session),
):
    access_log = AccessLog(
        auth_time=body.auth_time,
        fiscal_number=body.fiscal_number,
        preferred_username=body.preferred_username,
        auth_type=body.auth_type,
        auth_level=body.auth_level,
        sid=body.sid,
    )
    session.add(access_log)
    await session.commit()
    await session.refresh(access_log)
    return access_log
