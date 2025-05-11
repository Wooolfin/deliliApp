from fastapi import APIRouter, Form, Path
from services.sacola_service import get_sacolas, add_sacola
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ItemSacola(BaseModel):
    pedido_id: int
    produto_id: int
    quantidade: int

@router.get("/get_sacolas")
def list_sacolas():
    return get_sacolas()

@router.post("/add_sacola")
def inserir_sacola(itens: List[ItemSacola]):
    itens_dict = [item.dict() for item in itens]
    return add_sacola(itens_dict)