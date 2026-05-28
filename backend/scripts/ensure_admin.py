"""
Crea o actualiza el administrador principal en MongoDB.

Uso:
  python scripts/ensure_admin.py
"""

from __future__ import annotations

import asyncio
import os
import sys

from dotenv import load_dotenv

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

load_dotenv(os.path.join(ROOT, ".env"))

from app.database import close_db, connect_db, get_database
from app.utils.admin_users import normalize_usuario, utcnow
from app.utils.passwords import hash_password

MONGODB_DB = os.getenv("MONGODB_DB", "servicio_social")

DEFAULT_USUARIO = os.getenv("ADMIN_USUARIO", "Admindachidadakera")
DEFAULT_PASSWORD = os.getenv("ADMIN_PASSWORD", "dachidadakera2026*")
DEFAULT_NOMBRE = os.getenv("ADMIN_NOMBRE", "Administrador institucional")


async def ensure_admin() -> None:
    await connect_db()
    db = get_database()

    usuario = normalize_usuario(DEFAULT_USUARIO)
    now = utcnow()
    doc = {
        "usuario": usuario,
        "nombre": DEFAULT_NOMBRE,
        "rol": "admin",
        "activo": True,
        "password_hash": hash_password(DEFAULT_PASSWORD),
        "actualizado_en": now,
    }

    result = await db["admin_users"].update_one(
        {"usuario": usuario},
        {
            "$set": doc,
            "$setOnInsert": {"creado_en": now},
        },
        upsert=True,
    )

    if result.upserted_id:
        print(f"Administrador creado: {DEFAULT_USUARIO}")
    else:
        print(f"Administrador actualizado: {DEFAULT_USUARIO}")

    await close_db()


def main() -> None:
    asyncio.run(ensure_admin())


if __name__ == "__main__":
    main()
