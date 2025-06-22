from fastapi import APIRouter
from services.pedido_service import get_pedidos, add_pedido, get_produtos_pedido
from pydantic import BaseModel

router = APIRouter()

class Request_addPedido(BaseModel):
    cliente: str
    telefone: str
    endereco: str

@router.get("/get_pedidos")
def list_pedidos():
    return get_pedidos()

@router.get("/get_produtos_pedido")
def list_produtos_pedido():
    return get_produtos_pedido()

@router.post("/add_pedido")
def post_pedido(pedido: Request_addPedido):
    return add_pedido(pedido)