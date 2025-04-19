from fastapi import APIRouter, Form, Path
from services.pratos_service import get_pratos, add_prato, delete_prato, update_prato
from pydantic import BaseModel

router = APIRouter()

class PratoRequest(BaseModel):
    nome: str
    descricao: str
    valor: float

@router.get("/get_pratos")
def list_pratos():
    return get_pratos()

@router.post("/add_prato")
def create_prato(prato: PratoRequest):
    return add_prato(prato.nome, prato.descricao, prato.valor)


@router.put("/update_prato/{id}")
def edit_prato(id: int, prato: PratoRequest):
    return update_prato(id, prato.nome, prato.descricao, prato.valor)

@router.delete("/delete_prato/{id}")
def remove_prato(id: int = Path(...)):
    return delete_prato(id)
