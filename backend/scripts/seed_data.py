"""
Rellena MongoDB con datos de ejemplo para desarrollo.

Uso:
  python scripts/seed_data.py           # solo si las colecciones están vacías
  python scripts/seed_data.py --force   # borra documentos en colecciones sembradas y vuelve a insertar
"""

from __future__ import annotations

import argparse
import asyncio
import os
import sys
from datetime import datetime, timezone

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

load_dotenv(os.path.join(ROOT, ".env"))

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "servicio_social")

COLLECTIONS_SEED = (
    "admin_users",
    "tienda_categorias",
    "productos",
    "blog_posts",
    "galeria_albumes",
    "galeria_items",
)


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


async def seed(force: bool) -> None:
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB]
    await db.command("ping")

    total = 0
    for name in COLLECTIONS_SEED:
        total += await db[name].count_documents({})
    if total > 0 and not force:
        print(
            "Ya hay datos en las colecciones sembradas. "
            "Ejecuta con --force para vaciarlas y volver a insertar."
        )
        client.close()
        return

    if force:
        for name in COLLECTIONS_SEED:
            await db[name].delete_many({})
        print("Colecciones sembradas vaciadas.")

    now = utcnow()

    await db["tienda_categorias"].insert_many(
        [
            {
                "nombre": "general",
                "descripcion": "Productos generales",
                "orden": 0,
                "activo": True,
                "creado_en": now,
                "actualizado_en": now,
            },
            {
                "nombre": "ropa",
                "descripcion": "Textil y accesorios",
                "orden": 1,
                "activo": True,
                "creado_en": now,
                "actualizado_en": now,
            },
            {
                "nombre": "material_escolar",
                "descripcion": "Útiles y papelería",
                "orden": 2,
                "activo": True,
                "creado_en": now,
                "actualizado_en": now,
            },
        ]
    )

    await db["productos"].insert_many(
        [
            {
                "nombre": "Playera voluntariado",
                "descripcion": "Playera de algodón con logo del proyecto.",
                "precio": 150.0,
                "sku": "PLY-001",
                "categoria": "ropa",
                "stock": 40,
                "activo": True,
                "creado_en": now,
                "actualizado_en": now,
            },
            {
                "nombre": "Libreta ecológica",
                "descripcion": "Libreta reciclada tamaño carta.",
                "precio": 85.5,
                "sku": "LIB-002",
                "categoria": "material_escolar",
                "stock": 120,
                "activo": True,
                "creado_en": now,
                "actualizado_en": now,
            },
            {
                "nombre": "Kit donación básico",
                "descripcion": "Bolsa con artículos de higiene.",
                "precio": 200.0,
                "sku": "KIT-003",
                "categoria": "general",
                "stock": 25,
                "activo": True,
                "creado_en": now,
                "actualizado_en": now,
            },
        ]
    )

    await db["blog_posts"].insert_many(
        [
            {
                "titulo": "Bienvenida al servicio social",
                "slug": "bienvenida-servicio-social",
                "resumen": "Objetivos del proyecto y cómo participar.",
                "contenido": "## Participación\n\nPuedes registrarte en las actividades publicadas en el tablero.",
                "publicado": True,
                "etiquetas": ["general", "anuncio"],
                "creado_en": now,
                "actualizado_en": now,
            },
            {
                "titulo": "Jornada de recolección",
                "slug": "jornada-recoleccion-mayo",
                "resumen": "Fecha y punto de encuentro.",
                "contenido": "Llevágora material no perecedero el **sábado 10:00**.",
                "publicado": True,
                "etiquetas": ["evento", "voluntariado"],
                "creado_en": now,
                "actualizado_en": now,
            },
            {
                "titulo": "Borrador interno",
                "slug": "borrador-interno",
                "resumen": "No visible en producción hasta publicar.",
                "contenido": "Texto pendiente de revisión.",
                "publicado": False,
                "etiquetas": ["borrador"],
                "creado_en": now,
                "actualizado_en": now,
            },
        ]
    )

    await db["galeria_albumes"].insert_many(
        [
            {
                "nombre": "principal",
                "descripcion": "Imágenes destacadas",
                "orden": 0,
                "creado_en": now,
                "actualizado_en": now,
            },
            {
                "nombre": "eventos",
                "descripcion": "Actividades y jornadas",
                "orden": 1,
                "creado_en": now,
                "actualizado_en": now,
            },
        ]
    )

    await db["galeria_items"].insert_many(
        [
            {
                "titulo": "Equipo en comunidad",
                "descripcion": "Voluntarios en jornada comunitaria.",
                "url_imagen": "https://picsum.photos/id/64/800/600",
                "album": "principal",
                "orden": 0,
                "creado_en": now,
                "actualizado_en": now,
            },
            {
                "titulo": "Entrega de víveres",
                "descripcion": "Donaciones organizadas.",
                "url_imagen": "https://picsum.photos/id/180/800/600",
                "album": "eventos",
                "orden": 0,
                "creado_en": now,
                "actualizado_en": now,
            },
            {
                "titulo": "Taller infantil",
                "descripcion": "Actividades con niños y niñas.",
                "url_imagen": "https://picsum.photos/id/433/800/600",
                "album": "eventos",
                "orden": 1,
                "creado_en": now,
                "actualizado_en": now,
            },
        ]
    )

    print("Datos de ejemplo insertados correctamente.")
    print(f"  Base de datos: {MONGODB_DB}")
    print("  Cree un administrador con POST /api/v1/admin/usuarios (email, nombre, password).")

    client.close()


def main() -> None:
    p = argparse.ArgumentParser(description="Sembrar datos de desarrollo en MongoDB.")
    p.add_argument(
        "--force",
        action="store_true",
        help="Vacía las colecciones sembradas y vuelve a insertar.",
    )
    args = p.parse_args()
    asyncio.run(seed(args.force))


if __name__ == "__main__":
    main()
