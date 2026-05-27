from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "servicio_social"
    # Reintentos al arrancar (Atlas / red lenta / TLS intermitente)
    mongodb_connect_retries: int = Field(default=8, ge=1, le=30)
    mongodb_connect_retry_delay_sec: float = Field(default=1.5, ge=0.2, le=30.0)
    # Tiempo máx. por intento de selección de servidor (ms); más bajo = fallos más rápidos entre reintentos
    mongodb_server_selection_timeout_ms: int = Field(default=10_000, ge=2_000, le=60_000)
    api_prefix: str = "/api/v1"
    # URL pública del API (sin barra final). Si no se define, se usa el host de la petición.
    public_base_url: str | None = None
    # Atlas / TLS: en Windows suele evitar SSL handshake failed si se usa certifi
    mongodb_tls_ca_file: str | None = None
    # Solo aplica si no entras en el modo automático (Windows o Python 3.13+ con Atlas desactivan OCSP salvo opt-in).
    # true = desactivar verificación OCSP en ese caso (p. ej. Linux con Python anterior a 3.13 y problemas TLS).
    mongodb_tls_disable_ocsp: bool | None = Field(default=None)
    # Con Atlas: si true, no aplicar el desactivado automático de OCSP (Windows / Python 3.13+).
    mongodb_tls_enable_ocsp: bool = False
    # Último recurso en dev (equivale a tlsInsecure); no uses en producción
    mongodb_tls_insecure: bool = False
    # Windows + Atlas (p. ej. Python 3.13): TLSV1_ALERT_INTERNAL_ERROR aunque OCSP esté desactivado.
    # Usa un ssl.SSLContext dedicado (TLS 1.2 + sin verificar). Desactivar: MONGODB_TLS_RELAX_WINDOWS_ATLAS=false
    # También aplica en Python ≥ 3.13 fuera de Windows (mismo problema OpenSSL/Atlas).
    mongodb_tls_relax_windows_atlas: bool = True


settings = Settings()
