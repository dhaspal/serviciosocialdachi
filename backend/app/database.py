import asyncio
import logging
import sys
from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None


def _atlas_or_tls_uri(uri: str) -> bool:
    u = uri.lower()
    return (
        u.startswith("mongodb+srv://")
        or "tls=true" in u
        or "ssl=true" in u
        or ".mongodb.net" in u
    )


def _mongo_client_kwargs() -> dict[str, Any]:
    """Opciones TLS para Atlas (mongodb+srv) en Windows / Python reciente."""
    kw: dict[str, Any] = {}
    uri = settings.mongodb_uri
    atlas_or_tls = _atlas_or_tls_uri(uri)
    atlas_cloud = uri.startswith("mongodb+srv://") or ".mongodb.net" in uri.lower()

    # PyMongo 4.17 no acepta tlsContext en MongoClient; usamos las banderas TLS soportadas.
    # Con Py 3.13 + Atlas en Windows, tlsAllowInvalidCertificates solo a veces no basta.
    use_atlas_tls_relaxed = (
        atlas_cloud
        and (sys.platform == "win32" or sys.version_info >= (3, 13))
        and not settings.mongodb_tls_enable_ocsp
        and not settings.mongodb_tls_ca_file
        and (settings.mongodb_tls_insecure or settings.mongodb_tls_relax_windows_atlas)
    )
    if use_atlas_tls_relaxed:
        # tlsInsecure cubre verificación laxa de certificados; no mezclar con tlsAllow* ni tlsDisableOCSP (InvalidURI).
        kw["tlsInsecure"] = True
        logger.info(
            "MongoDB Atlas: TLS relajado (tlsInsecure). "
            "Desactivar: MONGODB_TLS_RELAX_WINDOWS_ATLAS=false; CA propia: MONGODB_TLS_CA_FILE=...; local: mongodb://localhost:27017"
        )
        return kw

    if settings.mongodb_tls_insecure:
        kw["tlsAllowInvalidCertificates"] = True
        return kw

    if atlas_or_tls:
        if settings.mongodb_tls_ca_file:
            kw["tlsCAFile"] = settings.mongodb_tls_ca_file
        else:
            import certifi

            kw["tlsCAFile"] = certifi.where()

        # OCSP + OpenSSL 3 / Python 3.13 con Atlas: handshake TLSV1_ALERT_INTERNAL_ERROR frecuente.
        disable_ocsp_default = (
            sys.platform == "win32" or sys.version_info >= (3, 13)
        ) and not settings.mongodb_tls_enable_ocsp

        if disable_ocsp_default:
            kw["tlsDisableOCSPEndpointCheck"] = True
        else:
            ocsp = settings.mongodb_tls_disable_ocsp
            if ocsp is True:
                kw["tlsDisableOCSPEndpointCheck"] = True

    return kw


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        extra = _mongo_client_kwargs()
        extra["serverSelectionTimeoutMS"] = settings.mongodb_server_selection_timeout_ms
        _client = AsyncIOMotorClient(settings.mongodb_uri, **extra)
    return _client


def get_database() -> AsyncIOMotorDatabase:
    return get_client()[settings.mongodb_db]


async def connect_db() -> None:
    """Ping a MongoDB con reintentos para que el API no falle al primer fallo de red/TLS."""
    global _client
    last_exc: Exception | None = None
    attempts = settings.mongodb_connect_retries
    delay = settings.mongodb_connect_retry_delay_sec
    for attempt in range(1, attempts + 1):
        try:
            get_client()
            await get_database().command("ping")
            if attempt > 1:
                logger.info("MongoDB: conexión correcta tras %s intentos.", attempt)
            return
        except Exception as exc:
            last_exc = exc
            if _client is not None:
                _client.close()
                _client = None
            if attempt < attempts:
                logger.warning(
                    "MongoDB ping falló (intento %s/%s): %s — reintentando en %ss",
                    attempt,
                    attempts,
                    exc,
                    delay,
                )
                await asyncio.sleep(delay)
    logger.error(
        "No se pudo conectar a MongoDB tras %s intentos. "
        "Revisa MONGODB_URI, red y Atlas; en desarrollo prueba MONGODB_TLS_INSECURE=true o Mongo local.",
        attempts,
    )
    assert last_exc is not None
    raise last_exc


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
