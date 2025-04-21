from fastapi import APIRouter
from services.pedido_service import get_pedidos, add_pedido
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class Request_addPedido(BaseModel):
    cliente: str
    telefone: str
    endereco: str

@router.get("/get_pedidos")
def list_pedidos():
    return get_pedidos()

@router.post("/add_pedido")
def post_pedido(cliente: Request_addPedido):
    return add_pedido(cliente)