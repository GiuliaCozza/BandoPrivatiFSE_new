from pydantic import BaseModel
import os

class Settings(BaseModel):
    app_name: str = os.getenv("APP_NAME", "backend-api")
    log_level: str = os.getenv("APP_LOG_LEVEL", "INFO")

    db_host: str = os.getenv("DB_HOST", "rrtgn-sis-pg01-s01.rtpc.sct.toscana.it")
    db_port: int = int(os.getenv("DB_PORT", "5432"))
    db_name: str = os.getenv("DB_NAME", "bando-fse-privati-db")
    db_user: str = os.getenv("DB_USER", "bando-fse-privati-db_rw")
    db_password: str = os.getenv("DB_PASSWORD", "5SQp1k5cX4T2")
    db_pool_min_size: int = int(os.getenv("DB_POOL_MIN_SIZE", "1"))
    db_pool_max_size: int = int(os.getenv("DB_POOL_MAX_SIZE", "10"))

    cors_origins: list[str] = [
        o.strip()
        for o in os.getenv(
            "CORS_ORIGINS",
            ",".join(
                [
                    "https://gestionefseprivati-test.sanita.toscana.it",
                    "https://gestionefseprivati-test.sanita.toscana.it/bando-fse-privati-fe/",
                    "https://gestionefseprivati-test.sanita.toscana.it/bando-fse-privati-fe/callback",
                    "https://gestionefseprivati.sanita.toscana.it",
                    "https://gestionefseprivati.sanita.toscana.it/bando-fse-privati-fe/",
                    "http://localhost:8080",
                    "http://127.0.0.1:8080",
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "http://localhost:3000",
                    "http://127.0.0.1:3000",
                    "http://localhost:8000",
                    "http://127.0.0.1:8000",
                ]
            ),
        ).split(",")
        if o.strip()
    ]

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

settings = Settings()
