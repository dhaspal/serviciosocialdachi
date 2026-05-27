from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import ReturnDocument

from app.database import get_database
from app.schemas.tienda import (
    CategoriaCreate,
    CategoriaReplace,
    CategoriaUpdate,
    ProductoCreate,
    ProductoReplace,
    ProductoUpdate,
)
from app.utils.mongo import doc_with_id, docs_with_id, parse_oid

router = APIRouter(prefix="/tienda", tags=["tienda"])

COL_PRODUCTOS = "productos"
COL_CATEGORIAS = "tienda_categorias"


def db_dep():
    return get_database()


@router.get("/categorias")
async def listar_categorias(
    solo_activas: bool = Query(default=False),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db=Depends(db_dep),
):
    filtro: dict = {}
    if solo_activas:
        filtro["activo"] = True
    cursor = (
        db[COL_CATEGORIAS]
        .find(filtro)
        .sort([("orden", 1), ("nombre", 1)])
        .skip(skip)
        .limit(limit)
    )
    docs = await cursor.to_list(limit)
    return docs_with_id(docs)


@router.get("/categorias/{categoria_id}")
async def obtener_categoria(categoria_id: str, db=Depends(db_dep)):
    doc = await db[COL_CATEGORIAS].find_one({"_id": parse_oid(categoria_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return doc_with_id(doc)


@router.post("/categorias", status_code=201)
async def crear_categoria(body: CategoriaCreate, db=Depends(db_dep)):
    dup = await db[COL_CATEGORIAS].find_one({"nombre": body.nombre})
    if dup:
        raise HTTPException(status_code=409, detail="Ya existe una categoría con ese nombre")
    doc = body.model_dump()
    now = datetime.now(timezone.utc)
    doc["creado_en"] = now
    doc["actualizado_en"] = now
    r = await db[COL_CATEGORIAS].insert_one(doc)
    created = await db[COL_CATEGORIAS].find_one({"_id": r.inserted_id})
    return doc_with_id(created)


@router.put("/categorias/{categoria_id}")
async def reemplazar_categoria(
    categoria_id: str, body: CategoriaReplace, db=Depends(db_dep)
):
    oid = parse_oid(categoria_id)
    old = await db[COL_CATEGORIAS].find_one({"_id": oid})
    if not old:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    dup = await db[COL_CATEGORIAS].find_one(
        {"nombre": body.nombre, "_id": {"$ne": oid}}
    )
    if dup:
        raise HTTPException(status_code=409, detail="Ya existe una categoría con ese nombre")
    now = datetime.now(timezone.utc)
    new_doc = body.model_dump()
    new_doc["_id"] = oid
    new_doc["creado_en"] = old.get("creado_en", now)
    new_doc["actualizado_en"] = now
    await db[COL_CATEGORIAS].replace_one({"_id": oid}, new_doc)
    return doc_with_id(await db[COL_CATEGORIAS].find_one({"_id": oid}))


@router.patch("/categorias/{categoria_id}")
async def actualizar_categoria(
    categoria_id: str, body: CategoriaUpdate, db=Depends(db_dep)
):
    oid = parse_oid(categoria_id)
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    if "nombre" in data:
        dup = await db[COL_CATEGORIAS].find_one(
            {"nombre": data["nombre"], "_id": {"$ne": oid}}
        )
        if dup:
            raise HTTPException(
                status_code=409, detail="Ya existe una categoría con ese nombre"
            )
    if not data:
        doc = await db[COL_CATEGORIAS].find_one({"_id": oid})
        if not doc:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        return doc_with_id(doc)
    data["actualizado_en"] = datetime.now(timezone.utc)
    doc = await db[COL_CATEGORIAS].find_one_and_update(
        {"_id": oid},
        {"$set": data},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return doc_with_id(doc)


@router.delete("/categorias/{categoria_id}", status_code=204)
async def eliminar_categoria(categoria_id: str, db=Depends(db_dep)):
    r = await db[COL_CATEGORIAS].delete_one({"_id": parse_oid(categoria_id)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")


@router.get("/productos")
async def listar_productos(
    categoria: str | None = None,
    solo_activos: bool = Query(default=True),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=500),
    db=Depends(db_dep),
):
    filtro: dict = {}
    if categoria:
        filtro["categoria"] = categoria
    if solo_activos:
        filtro["activo"] = True
    cursor = (
        db[COL_PRODUCTOS].find(filtro).sort("nombre", 1).skip(skip).limit(limit)
    )
    docs = await cursor.to_list(limit)
    return docs_with_id(docs)


@router.get("/productos/categorias/usadas")
async def categorias_usadas_en_productos(db=Depends(db_dep)):
    """Valores distintos del campo categoria en productos (puede no coincidir con el catálogo)."""
    cats = await db[COL_PRODUCTOS].distinct("categoria")
    return sorted(c for c in cats if c)


@router.get("/productos/{producto_id}")
async def obtener_producto(producto_id: str, db=Depends(db_dep)):
    doc = await db[COL_PRODUCTOS].find_one({"_id": parse_oid(producto_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return doc_with_id(doc)


@router.post("/productos", status_code=201)
async def crear_producto(body: ProductoCreate, db=Depends(db_dep)):
    doc = body.model_dump()
    doc["creado_en"] = datetime.now(timezone.utc)
    doc["actualizado_en"] = doc["creado_en"]
    r = await db[COL_PRODUCTOS].insert_one(doc)
    created = await db[COL_PRODUCTOS].find_one({"_id": r.inserted_id})
    return doc_with_id(created)


@router.put("/productos/{producto_id}")
async def reemplazar_producto(
    producto_id: str, body: ProductoReplace, db=Depends(db_dep)
):
    oid = parse_oid(producto_id)
    old = await db[COL_PRODUCTOS].find_one({"_id": oid})
    if not old:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    now = datetime.now(timezone.utc)
    new_doc = body.model_dump()
    new_doc["_id"] = oid
    new_doc["creado_en"] = old.get("creado_en", now)
    new_doc["actualizado_en"] = now
    await db[COL_PRODUCTOS].replace_one({"_id": oid}, new_doc)
    return doc_with_id(await db[COL_PRODUCTOS].find_one({"_id": oid}))


@router.patch("/productos/{producto_id}")
async def actualizar_producto(
    producto_id: str, body: ProductoUpdate, db=Depends(db_dep)
):
    oid = parse_oid(producto_id)
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    if not data:
        doc = await db[COL_PRODUCTOS].find_one({"_id": oid})
        if not doc:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return doc_with_id(doc)
    data["actualizado_en"] = datetime.now(timezone.utc)
    doc = await db[COL_PRODUCTOS].find_one_and_update(
        {"_id": oid},
        {"$set": data},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return doc_with_id(doc)


@router.delete("/productos/{producto_id}", status_code=204)
async def eliminar_producto(producto_id: str, db=Depends(db_dep)):
    r = await db[COL_PRODUCTOS].delete_one({"_id": parse_oid(producto_id)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
