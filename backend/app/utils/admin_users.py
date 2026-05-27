"""Normaliza el identificador de inicio de sesión (usuario)."""
from datetime import datetime, timezone


def normalize_usuario(raw: str) -> str:
    return raw.strip().lower()


def utcnow() -> datetime:
    return datetime.now(timezone.utc)
