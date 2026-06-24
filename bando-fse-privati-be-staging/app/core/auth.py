from fastapi import Header, HTTPException, status, Depends

VALID_LEVELS = ("reader", "editor", "admin")

def get_access_level(x_access_level: str | None = Header(default=None, alias="X-Access-Level")) -> str:
    if not x_access_level:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing X-Access-Level header")
    level = x_access_level.strip().lower()
    if level not in VALID_LEVELS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid access level")
    return level

def require_levels(*allowed: str):
    allowed_set = set(a.lower() for a in allowed)
    def _checker(level: str = Depends(get_access_level)) -> None:
        if level not in allowed_set:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return _checker
