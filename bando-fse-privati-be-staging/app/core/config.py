from __future__ import annotations

import os
from pathlib import Path
from pydantic import BaseModel, Field

CONFIGMAP_PATH_ENV = "CONFIGMAP_PATH"
DEFAULT_CONFIGMAP_PATHS = (
    Path("cfg/staging/configmap.yaml"),
    Path("configmap.yaml"),
    Path("/etc/config/configmap.yaml"),
)


def _parse_scalar(value: str) -> str:
    value = value.strip()
    if not value:
        return ""
    if (value[0], value[-1]) in (("'", "'"), ('"', '"')):
        return value[1:-1]
    return value


def _load_configmap_file() -> dict[str, str]:
    """Load key/value pairs from a Kubernetes ConfigMap YAML, when mounted as a file."""
    configured_path = os.getenv(CONFIGMAP_PATH_ENV)
    paths = (Path(configured_path),) if configured_path else DEFAULT_CONFIGMAP_PATHS

    for path in paths:
        if not path.is_file():
            continue

        values: dict[str, str] = {}
        in_data_section = False

        for raw_line in path.read_text(encoding="utf-8").splitlines():
            line = raw_line.rstrip()
            stripped = line.strip()

            if not stripped or stripped.startswith("#"):
                continue

            if not raw_line.startswith((" ", "\t")) and stripped.endswith(":"):
                in_data_section = stripped[:-1] == "data"
                continue

            if not in_data_section or ":" not in stripped:
                continue

            key, value = stripped.split(":", 1)
            values[key.strip()] = _parse_scalar(value)

        return values

    return {}


_CONFIGMAP_VALUES = _load_configmap_file()


def _get_config_value(name: str, default: str | None = None) -> str:
    value = os.getenv(name, _CONFIGMAP_VALUES.get(name, default))
    if value is None or value == "":
        raise ValueError(f"Missing required configuration value: {name}")
    return value


def _get_int_config_value(name: str, default: str | None = None) -> int:
    return int(_get_config_value(name, default))


def _get_list_config_value(name: str, default: str | None = None) -> list[str]:
    return [item.strip() for item in _get_config_value(name, default).split(",") if item.strip()]


class Settings(BaseModel):
    app_name: str = Field(default_factory=lambda: _get_config_value("APP_NAME", "backend-api"))
    log_level: str = Field(default_factory=lambda: _get_config_value("APP_LOG_LEVEL", "INFO"))

    db_host: str = Field(default_factory=lambda: _get_config_value("DB_HOST"))
    db_port: int = Field(default_factory=lambda: _get_int_config_value("DB_PORT", "5432"))
    db_name: str = Field(default_factory=lambda: _get_config_value("DB_NAME"))
    db_user: str = Field(default_factory=lambda: _get_config_value("DB_USER"))
    db_password: str = Field(default_factory=lambda: _get_config_value("DB_PASSWORD"))
    db_pool_min_size: int = Field(default_factory=lambda: _get_int_config_value("DB_POOL_MIN_SIZE", "1"))
    db_pool_max_size: int = Field(default_factory=lambda: _get_int_config_value("DB_POOL_MAX_SIZE", "10"))
    db_search_path: str = Field(default_factory=lambda: _get_config_value("DB_SEARCH_PATH", '"bando-fse-privati-schema",public'))

    cors_origins: list[str] = Field(default_factory=lambda: _get_list_config_value("CORS_ORIGINS"))

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


settings = Settings()
