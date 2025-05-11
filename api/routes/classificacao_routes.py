from fastapi import APIRouter, Path
from services.classificacao_service import  get_classificacao, get_tamanho
from pydantic import BaseModel

router = APIRouter()

class classif_request(BaseModel):
    nome_classificacao: str

class tamanho_request(BaseModel):
    descricao_tamanho: str

@router.get("/get_classificacao")
def list_classificacao():
    return get_classificacao()

@router.get("/get_tamanho/{id_classificacao}")
def list_tamanhos_por_classificacao(id_classificacao: int = Path(..., description="ID da classificação")):
    return get_tamanho(id_classificacao)