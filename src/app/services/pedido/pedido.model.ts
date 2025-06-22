export interface Pedido {
  cliente: string;
  telefone: string;
  endereco: string;
}

export interface Produto {
  id_produto_preco: number;
  id_produto: number;
  nome_produto: string;
  descricao?: string | null;
  id_classificacao: number;
  nome_classificacao: string;
  preco_unico?: number | null;
  usa_tamanho: number;
  classificacao_preco?: ClassificacaoPreco[];
  preco?: number;
  tamanhos?: Tamanho[];
  selectedTamanho?: Tamanho;
}

export interface Tamanho {
  id_tamanho: number;
  descricao_tamanho: string;
  preco: number;
}

export interface ClassificacaoPreco {
  id_tamanho: number;
  id_classificacao_preco: number;
  descricao_tamanho: string;
  preco: number;
}

