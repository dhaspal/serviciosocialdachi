from typing import Any

from bson import ObjectId
from fastapi import HTTPException


def parse_oid(value: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=400, detail="Identificador inválido")
    return ObjectId(value)


def doc_with_id(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    if doc is None:
        return None
    out = dict(doc)
    if "_id" in out:
        out["id"] = str(out.pop("_id"))
    return out


def docs_with_id(docs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [doc_with_id(d) or {} for d in docs]
