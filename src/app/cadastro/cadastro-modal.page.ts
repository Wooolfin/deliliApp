import { Component } from '@angular/core';
import { ProdutoService } from '../services/produto/produto.service';
import { Classificacao, ProdutoRequest } from '../services/produto/produto.model';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-cadastro-modal',
  templateUrl: './cadastro-modal.page.html',
  styleUrls: ['./cadastro-modal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class CadastroModalPage {
  classificacaoSelecionada: Classificacao | null = null;
  nome_produto: string = '';
  descricao: string | null = '';
  usaTamanho: boolean = false;
  valorUnico: number | undefined = undefined;
  classificacoes: Classificacao[] = [];

  constructor(
    private produtoService: ProdutoService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.produtoService.getClassificacoes().subscribe((classificacoes: Classificacao[]) => {
      this.classificacoes = classificacoes;
    });
  }

  selecionarClassificacao(classificacao: Classificacao | null) {
    if (classificacao) {
      this.classificacaoSelecionada = classificacao;
      this.usaTamanho = classificacao.usa_tamanho;
      if (!this.usaTamanho) {
        this.descricao = null;
      }
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  addProduto() {
    const payload = {
      id_produto: 0 as number,
      nome_produto: this.nome_produto,
      descricao: this.usaTamanho ? this.descricao : null,
      id_classificacao: this.classificacaoSelecionada ? this.classificacaoSelecionada.id_classificacao : 0,
      usa_tamanho: this.usaTamanho,
      ...(this.usaTamanho ? {} : { preco: this.valorUnico })
    };

    this.produtoService.addProduto(payload).subscribe({
      next: res => this.modalController.dismiss(res),
      error: err => console.error('Erro ao salvar produto', err)
    });
  }
}
