from fastapi import APIRouter, Path
from services.classificacao_service import  get_classificacao, get_tamanho, update_preco_tamanho, get_produtos, update_preco_produto
from pydantic import BaseModel
from typing import List


router = APIRouter()

class classif_request(BaseModel):
    nome_classificacao: str

class tamanho_request(BaseModel):
    descricao_tamanho: str

class PrecoTamanho(BaseModel):
    id_tamanho: int
    preco: float

class UpdatePrecoTamanhoRequest(BaseModel):
    id_classificacao: int
    precos_tamanhos: List[PrecoTamanho]

class PrecoProduto(BaseModel):
    id_produto: int
    preco: float

class UpdatePrecoProdutoRequest(BaseModel):
    id_classificacao: int
    precos_produtos: List[PrecoProduto]

@router.get("/get_classificacao")
def list_classificacao():
    return get_classificacao()

@router.get("/get_tamanho/{id_classificacao}")
def list_tamanhos_por_classificacao(id_classificacao: int = Path(..., description="ID da classificação")):
    return get_tamanho(id_classificacao)

@router.get("/get_produtos/{id_classificacao}")
def listar_produtos(id_classificacao: int = Path(..., description="ID da classificação")):
    return get_produtos(id_classificacao)

@router.put("/update_preco_tamanho")
def atualizar_precos_tamanhos(payload: UpdatePrecoTamanhoRequest):
    response = update_preco_tamanho(
        payload.id_classificacao,
        [item.dict() for item in payload.precos_tamanhos]
    )
    return response

@router.put("/update_preco_produto")
def atualizar_precos_produtos(payload: UpdatePrecoProdutoRequest):
    response = update_preco_produto(
        payload.id_classificacao,
        [item.dict() for item in payload.precos_produtos]
    )
    return response

