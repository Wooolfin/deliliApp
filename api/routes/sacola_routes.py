from fastapi import APIRouter, Form, Path
from services.sacola_service import get_sacolas, add_sacola
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ItemSacola(BaseModel):
    pedido_id: Optional[int]
    produto_id: int
    quantidade: int
    id_classificacao_preco: Optional[int] = None
    id_produto_preco: Optional[int] = None
    id_tamanho: Optional[int] = None

@router.get("/get_sacolas")
def list_sacolas():
    return get_sacolas()

@router.post("/add_sacola")
def inserir_sacola(itens: List[ItemSacola]):
    itens_dict = [item.dict() for item in itens]
    return add_sacola(itens_dict)