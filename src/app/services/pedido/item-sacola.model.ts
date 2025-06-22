import { ClassificacaoPreco } from '../pedido/pedido.model';

export interface ItemSacola {
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  id_classificacao_preco?: number;
  id_produto_preco?: number | null;
  nome_produto: string;
  descricao?: string | null;
  id_classificacao: number;
  nome_classificacao: string;
  usa_tamanho: number;
  preco: number;
  selectedTamanho?: ClassificacaoPreco;
  id_tamanho?: number;
}

export interface ItemSacolaRequest {
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  id_classificacao_preco?: number;
  id_produto_preco?: number | null;
  id_tamanho?: number;
}