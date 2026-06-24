from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, model_validator


class AccessLogCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    auth_time: datetime
    fiscal_number: str | None = None
    preferred_username: str | None = None
    auth_type: str
    auth_level: str
    sid: str

    @model_validator(mode="before")
    @classmethod
    def ensure_fiscal_number(cls, values: dict) -> dict:
        fiscal_number = values.get("fiscal_number")
        preferred_username = values.get("preferred_username")
        if not fiscal_number and preferred_username:
            values["fiscal_number"] = preferred_username
        if not values.get("fiscal_number") and not values.get("preferred_username"):
            raise ValueError("fiscal_number or preferred_username is required")
        return values


class AccessLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    auth_time: datetime
    fiscal_number: str | None
    preferred_username: str | None
    auth_type: str
    auth_level: str
    sid: str
    created_at: datetime
