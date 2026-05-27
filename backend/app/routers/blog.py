from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import ReturnDocument

from app.database import get_database
from app.schemas.blog import PostCreate, PostReplace, PostUpdate
from app.utils.mongo import doc_with_id, docs_with_id, parse_oid

router = APIRouter(prefix="/blog", tags=["blog"])

COL_POSTS = "blog_posts"


def db_dep():
    return get_database()


@router.get("/posts")
async def listar_posts(
    publicados: bool | None = Query(default=None),
    etiqueta: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=30, ge=1, le=500),
    db=Depends(db_dep),
):
    filtro: dict = {}
    if publicados is True:
        filtro["publicado"] = True
    elif publicados is False:
        filtro["publicado"] = False
    if etiqueta:
        filtro["etiquetas"] = etiqueta
    cursor = (
        db[COL_POSTS].find(filtro).sort("creado_en", -1).skip(skip).limit(limit)
    )
    docs = await cursor.to_list(limit)
    return docs_with_id(docs)


@router.get("/posts/slug/{slug}")
async def obtener_post_por_slug(slug: str, db=Depends(db_dep)):
    doc = await db[COL_POSTS].find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return doc_with_id(doc)


@router.get("/posts/{post_id}")
async def obtener_post(post_id: str, db=Depends(db_dep)):
    doc = await db[COL_POSTS].find_one({"_id": parse_oid(post_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return doc_with_id(doc)


@router.put("/posts/{post_id}")
async def reemplazar_post(post_id: str, body: PostReplace, db=Depends(db_dep)):
    oid = parse_oid(post_id)
    old = await db[COL_POSTS].find_one({"_id": oid})
    if not old:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    otro = await db[COL_POSTS].find_one({"slug": body.slug, "_id": {"$ne": oid}})
    if otro:
        raise HTTPException(status_code=409, detail="El slug ya existe")
    now = datetime.now(timezone.utc)
    new_doc = body.model_dump()
    new_doc["_id"] = oid
    new_doc["creado_en"] = old.get("creado_en", now)
    new_doc["actualizado_en"] = now
    await db[COL_POSTS].replace_one({"_id": oid}, new_doc)
    return doc_with_id(await db[COL_POSTS].find_one({"_id": oid}))


@router.post("/posts", status_code=201)
async def crear_post(body: PostCreate, db=Depends(db_dep)):
    existente = await db[COL_POSTS].find_one({"slug": body.slug})
    if existente:
        raise HTTPException(status_code=409, detail="El slug ya existe")
    doc = body.model_dump()
    now = datetime.now(timezone.utc)
    doc["creado_en"] = now
    doc["actualizado_en"] = now
    r = await db[COL_POSTS].insert_one(doc)
    created = await db[COL_POSTS].find_one({"_id": r.inserted_id})
    return doc_with_id(created)


@router.patch("/posts/{post_id}")
async def actualizar_post(post_id: str, body: PostUpdate, db=Depends(db_dep)):
    oid = parse_oid(post_id)
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    if "slug" in data:
        otro = await db[COL_POSTS].find_one(
            {"slug": data["slug"], "_id": {"$ne": oid}}
        )
        if otro:
            raise HTTPException(status_code=409, detail="El slug ya existe")
    if not data:
        doc = await db[COL_POSTS].find_one({"_id": oid})
        if not doc:
            raise HTTPException(status_code=404, detail="Entrada no encontrada")
        return doc_with_id(doc)
    data["actualizado_en"] = datetime.now(timezone.utc)
    doc = await db[COL_POSTS].find_one_and_update(
        {"_id": oid},
        {"$set": data},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return doc_with_id(doc)


@router.delete("/posts/{post_id}", status_code=204)
async def eliminar_post(post_id: str, db=Depends(db_dep)):
    r = await db[COL_POSTS].delete_one({"_id": parse_oid(post_id)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
