import logging
import sys
from settings import settings

logger = logging.getLogger(__name__)

if settings().DEBUG:
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)
stream_handler = logging.StreamHandler(sys.stdout)
log_formatter = logging.Formatter("%(asctime)s %(levelname)s: %(message)s")
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)