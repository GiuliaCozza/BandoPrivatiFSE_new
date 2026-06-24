import logging
import sys

from pythonjsonlogger import jsonlogger


class ServiceFilter(logging.Filter):
    def __init__(self, service: str) -> None:
        super().__init__()
        self.service = service

    def filter(self, record: logging.LogRecord) -> bool:
        record.service = self.service
        return True


def configure_logging(service: str, log_level: str) -> None:
    root_logger = logging.getLogger()
    if root_logger.handlers:
        return

    handler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(levelname)s %(service)s %(message)s",
        rename_fields={
            "asctime": "timestamp",
            "levelname": "level",
            "message": "message",
        },
    )
    handler.setFormatter(formatter)
    handler.addFilter(ServiceFilter(service))

    root_logger.setLevel(log_level)
    root_logger.addHandler(handler)
