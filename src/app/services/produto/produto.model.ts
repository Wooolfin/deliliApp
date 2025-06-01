export interface Tamanho {
  id_tamanho: number;
  descricao_tamanho: string;
  preco: number;
}

export interface Produto {
  id_produto: number;
  nome_produto: string;
  descricao?: string | null;
  id_classificacao: number;
  nome_classificacao: string;
  usa_tamanho: boolean;
  preco?: number;
  tamanhos?: Tamanho[];
  selectedTamanho?: Tamanho;
}

export interface Classificacao {
  id_classificacao: number;
  id: number;
  nome_classificacao: string;
  usa_tamanho: boolean;
}

export interface ProdutoRequest {
  id_produto: number;
  nome_produto: string;
  descricao: string | null;
  id_classificacao?: number;
  usa_tamanho: boolean;
  preco?: number;
}

export interface UpdateRequest {
  id_produto: number;
  nome_produto: string;
  descricao: string | null;
  usa_tamanho: boolean;
}
