import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, Query, Request, UploadFile
from pymongo import ReturnDocument

from app.config import settings
from app.database import get_database
from app.paths import GALERIA_UPLOAD_DIR
from app.schemas.galeria import (
    AlbumCreate,
    AlbumReplace,
    AlbumUpdate,
    GaleriaImagenSubidaRespuesta,
    GaleriaItemCreate,
    GaleriaItemReplace,
    GaleriaItemUpdate,
)
from app.utils.mongo import doc_with_id, docs_with_id, parse_oid

router = APIRouter(prefix="/galeria", tags=["galeria"])

COL_GALERIA = "galeria_items"
COL_ALBUMES = "galeria_albumes"

ALLOWED_IMAGE_TYPES: dict[str, str] = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_IMAGEN_BYTES = 5 * 1024 * 1024


def db_dep():
    return get_database()


@router.get("/albumes")
async def listar_albumes(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db=Depends(db_dep),
):
    cursor = (
        db[COL_ALBUMES].find().sort([("orden", 1), ("nombre", 1)]).skip(skip).limit(limit)
    )
    docs = await cursor.to_list(limit)
    return docs_with_id(docs)


@router.get("/albumes/{album_id}")
async def obtener_album(album_id: str, db=Depends(db_dep)):
    doc = await db[COL_ALBUMES].find_one({"_id": parse_oid(album_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Álbum no encontrado")
    return doc_with_id(doc)


@router.post("/albumes", status_code=201)
async def crear_album(body: AlbumCreate, db=Depends(db_dep)):
    dup = await db[COL_ALBUMES].find_one({"nombre": body.nombre})
    if dup:
        raise HTTPException(status_code=409, detail="Ya existe un álbum con ese nombre")
    doc = body.model_dump()
    now = datetime.now(timezone.utc)
    doc["creado_en"] = now
    doc["actualizado_en"] = now
    r = await db[COL_ALBUMES].insert_one(doc)
    created = await db[COL_ALBUMES].find_one({"_id": r.inserted_id})
    return doc_with_id(created)


@router.put("/albumes/{album_id}")
async def reemplazar_album(album_id: str, body: AlbumReplace, db=Depends(db_dep)):
    oid = parse_oid(album_id)
    old = await db[COL_ALBUMES].find_one({"_id": oid})
    if not old:
        raise HTTPException(status_code=404, detail="Álbum no encontrado")
    dup = await db[COL_ALBUMES].find_one({"nombre": body.nombre, "_id": {"$ne": oid}})
    if dup:
        raise HTTPException(status_code=409, detail="Ya existe un álbum con ese nombre")
    now = datetime.now(timezone.utc)
    new_doc = body.model_dump()
    new_doc["_id"] = oid
    new_doc["creado_en"] = old.get("creado_en", now)
    new_doc["actualizado_en"] = now
    await db[COL_ALBUMES].replace_one({"_id": oid}, new_doc)
    return doc_with_id(await db[COL_ALBUMES].find_one({"_id": oid}))


@router.patch("/albumes/{album_id}")
async def actualizar_album(album_id: str, body: AlbumUpdate, db=Depends(db_dep)):
    oid = parse_oid(album_id)
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    if "nombre" in data:
        dup = await db[COL_ALBUMES].find_one(
            {"nombre": data["nombre"], "_id": {"$ne": oid}}
        )
        if dup:
            raise HTTPException(status_code=409, detail="Ya existe un álbum con ese nombre")
    if not data:
        doc = await db[COL_ALBUMES].find_one({"_id": oid})
        if not doc:
            raise HTTPException(status_code=404, detail="Álbum no encontrado")
        return doc_with_id(doc)
    data["actualizado_en"] = datetime.now(timezone.utc)
    doc = await db[COL_ALBUMES].find_one_and_update(
        {"_id": oid},
        {"$set": data},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Álbum no encontrado")
    return doc_with_id(doc)


@router.delete("/albumes/{album_id}", status_code=204)
async def eliminar_album(album_id: str, db=Depends(db_dep)):
    r = await db[COL_ALBUMES].delete_one({"_id": parse_oid(album_id)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Álbum no encontrado")


@router.get("/items")
async def listar_items(
    album: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=60, ge=1, le=2000),
    db=Depends(db_dep),
):
    filtro: dict = {}
    if album:
        filtro["album"] = album
    cursor = (
        db[COL_GALERIA]
        .find(filtro)
        .sort([("album", 1), ("orden", 1)])
        .skip(skip)
        .limit(limit)
    )
    docs = await cursor.to_list(limit)
    return docs_with_id(docs)


@router.get("/items/albumes/nombres")
async def nombres_albumes_en_items(db=Depends(db_dep)):
    """Valores distintos del campo album en ítems (puede no coincidir con el catálogo de álbumes)."""
    names = await db[COL_GALERIA].distinct("album")
    return sorted(n for n in names if n)


@router.post(
    "/items/subir-imagen",
    response_model=GaleriaImagenSubidaRespuesta,
    status_code=201,
)
async def subir_imagen_galeria(
    request: Request,
    imagen: UploadFile = File(..., description="JPEG, PNG, WebP o GIF (máx. 5 MB)"),
):
    """Guarda la imagen en disco y devuelve una URL usable en `url_imagen` al crear el ítem."""
    ct = (imagen.content_type or "").split(";")[0].strip().lower()
    ext = ALLOWED_IMAGE_TYPES.get(ct)
    if not ext:
        raise HTTPException(
            status_code=400,
            detail="Tipo no permitido. Envía image/jpeg, image/png, image/webp o image/gif.",
        )
    body = await imagen.read(MAX_IMAGEN_BYTES + 1)
    if len(body) > MAX_IMAGEN_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Archivo demasiado grande (máximo 5 MB).",
        )
    nombre = f"{uuid.uuid4().hex}{ext}"
    GALERIA_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    path = GALERIA_UPLOAD_DIR / nombre
    path.write_bytes(body)
    ruta_publica = f"/uploads/galeria/{nombre}"
    if settings.public_base_url:
        base = settings.public_base_url.rstrip("/")
    else:
        base = str(request.base_url).rstrip("/")
    url_absoluta = f"{base}{ruta_publica}"
    return GaleriaImagenSubidaRespuesta(
        url=url_absoluta,
        ruta_publica=ruta_publica,
        nombre_archivo=nombre,
    )


@router.get("/items/{item_id}")
async def obtener_item(item_id: str, db=Depends(db_dep)):
    doc = await db[COL_GALERIA].find_one({"_id": parse_oid(item_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Elemento no encontrado")
    return doc_with_id(doc)


@router.post("/items", status_code=201)
async def crear_item(body: GaleriaItemCreate, db=Depends(db_dep)):
    doc = body.model_dump(mode="json")
    doc["creado_en"] = datetime.now(timezone.utc)
    doc["actualizado_en"] = doc["creado_en"]
    r = await db[COL_GALERIA].insert_one(doc)
    created = await db[COL_GALERIA].find_one({"_id": r.inserted_id})
    return doc_with_id(created)


@router.put("/items/{item_id}")
async def reemplazar_item(item_id: str, body: GaleriaItemReplace, db=Depends(db_dep)):
    oid = parse_oid(item_id)
    old = await db[COL_GALERIA].find_one({"_id": oid})
    if not old:
        raise HTTPException(status_code=404, detail="Elemento no encontrado")
    now = datetime.now(timezone.utc)
    new_doc = body.model_dump(mode="json")
    new_doc["_id"] = oid
    new_doc["creado_en"] = old.get("creado_en", now)
    new_doc["actualizado_en"] = now
    await db[COL_GALERIA].replace_one({"_id": oid}, new_doc)
    return doc_with_id(await db[COL_GALERIA].find_one({"_id": oid}))


@router.patch("/items/{item_id}")
async def actualizar_item(item_id: str, body: GaleriaItemUpdate, db=Depends(db_dep)):
    oid = parse_oid(item_id)
    data = {k: v for k, v in body.model_dump(mode="json", exclude_none=True).items()}
    if not data:
        doc = await db[COL_GALERIA].find_one({"_id": oid})
        if not doc:
            raise HTTPException(status_code=404, detail="Elemento no encontrado")
        return doc_with_id(doc)
    data["actualizado_en"] = datetime.now(timezone.utc)
    doc = await db[COL_GALERIA].find_one_and_update(
        {"_id": oid},
        {"$set": data},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Elemento no encontrado")
    return doc_with_id(doc)


@router.delete("/items/{item_id}", status_code=204)
async def eliminar_item(item_id: str, db=Depends(db_dep)):
    r = await db[COL_GALERIA].delete_one({"_id": parse_oid(item_id)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Elemento no encontrado")
