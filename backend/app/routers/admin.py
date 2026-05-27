from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from pymongo import ReturnDocument

from app.database import get_database
from app.schemas.admin import (
    AdminLogin,
    AdminMetricas,
    AdminSesionRespuesta,
    AdminUserCreate,
    AdminUserReplace,
    AdminUserUpdate,
)
from app.utils.mongo import doc_with_id, docs_with_id, parse_oid

router = APIRouter(prefix="/admin", tags=["administrador"])

COL_ADMIN_USERS = "admin_users"


def db_dep():
    return get_database()


@router.post("/login", response_model=AdminSesionRespuesta)
async def admin_login(body: AdminLogin, db=Depends(db_dep)):
    """Autenticación de desarrollo: valida credenciales contra la colección o acepta cualquier par si no hay usuarios."""
    col = db[COL_ADMIN_USERS]
    user = await col.find_one({"email": body.email})
    if user is None:
        count = await col.count_documents({})
        if count == 0:
            return AdminSesionRespuesta(
                mensaje="Sin usuarios en BD: usa POST /admin/usuarios primero o crea uno.",
                token_placeholder="dev-no-token",
                expira=datetime.now(timezone.utc) + timedelta(hours=1),
            )
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    # En producción: verificar hash de contraseña (bcrypt, etc.)
    if body.password != "admin123":
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    return AdminSesionRespuesta(
        mensaje="Sesión iniciada (modo desarrollo)",
        token_placeholder="dev-token-reemplazar-con-jwt",
        expira=datetime.now(timezone.utc) + timedelta(hours=8),
    )


@router.get("/metricas", response_model=AdminMetricas)
async def admin_metricas(db=Depends(db_dep)):
    """Totales agregados para panel administrativo."""
    usuarios = await db[COL_ADMIN_USERS].count_documents({})
    productos = await db["productos"].count_documents({})
    posts = await db["blog_posts"].count_documents({})
    galeria = await db["galeria_items"].count_documents({})
    return AdminMetricas(
        usuarios_total=usuarios,
        productos_total=productos,
        posts_total=posts,
        items_galeria_total=galeria,
    )


@router.get("/usuarios")
async def listar_usuarios_admin(db=Depends(db_dep)):
    cursor = db[COL_ADMIN_USERS].find().sort("email", 1)
    docs = await cursor.to_list(500)
    return docs_with_id(docs)


@router.post("/usuarios", status_code=201)
async def crear_usuario_admin(body: AdminUserCreate, db=Depends(db_dep)):
    doc = body.model_dump()
    doc["password_hash"] = "cambiar-por-bcrypt"
    doc["activo"] = True
    doc["creado_en"] = datetime.now(timezone.utc)
    r = await db[COL_ADMIN_USERS].insert_one(doc)
    created = await db[COL_ADMIN_USERS].find_one({"_id": r.inserted_id})
    return doc_with_id(created)


@router.get("/usuarios/{usuario_id}")
async def obtener_usuario_admin(usuario_id: str, db=Depends(db_dep)):
    doc = await db[COL_ADMIN_USERS].find_one({"_id": parse_oid(usuario_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return doc_with_id(doc)


@router.put("/usuarios/{usuario_id}")
async def reemplazar_usuario_admin(
    usuario_id: str, body: AdminUserReplace, db=Depends(db_dep)
):
    oid = parse_oid(usuario_id)
    old = await db[COL_ADMIN_USERS].find_one({"_id": oid})
    if not old:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    now = datetime.now(timezone.utc)
    new_doc: dict = {
        "_id": oid,
        "email": body.email,
        "nombre": body.nombre,
        "rol": body.rol,
        "activo": body.activo,
        "creado_en": old.get("creado_en", now),
        "actualizado_en": now,
        "password_hash": old.get("password_hash", "cambiar-por-bcrypt"),
    }
    if body.password:
        new_doc["password_hash"] = "cambiar-por-bcrypt"
    await db[COL_ADMIN_USERS].replace_one({"_id": oid}, new_doc)
    out = await db[COL_ADMIN_USERS].find_one({"_id": oid})
    return doc_with_id(out)


@router.patch("/usuarios/{usuario_id}")
async def actualizar_usuario_admin(
    usuario_id: str, body: AdminUserUpdate, db=Depends(db_dep)
):
    oid = parse_oid(usuario_id)
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    if not data:
        doc = await db[COL_ADMIN_USERS].find_one({"_id": oid})
        if not doc:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return doc_with_id(doc)
    data["actualizado_en"] = datetime.now(timezone.utc)
    doc = await db[COL_ADMIN_USERS].find_one_and_update(
        {"_id": oid},
        {"$set": data},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return doc_with_id(doc)


@router.delete("/usuarios/{usuario_id}", status_code=204)
async def eliminar_usuario_admin(usuario_id: str, db=Depends(db_dep)):
    r = await db[COL_ADMIN_USERS].delete_one({"_id": parse_oid(usuario_id)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
