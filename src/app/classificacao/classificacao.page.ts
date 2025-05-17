import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClassificacaoService } from '../services/classificacao/classificacao.service';
import { Classificacao, Tamanho, Produto } from '../services/classificacao/classificacao.model';

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao.page.html',
  styleUrls: ['./classificacao.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClassificacaoPage implements OnInit {

  classificacoes: Classificacao[] = [];
  tamanhos: (Tamanho & { precoEditavel: string })[] = [];
  produtos: (Produto & { precoEditavel: string })[] = [];
  idClassificacaoSelecionada: number | null = null;
  classificacaoSelecionada: Classificacao | null = null;


  constructor(private classificacaoService: ClassificacaoService) {}

  ngOnInit() {
    this.getClassificacoes();
  }

  getClassificacoes() {
    this.classificacaoService.getClassificacoes().subscribe((data: Classificacao[]) => {
      console.log('Classificações:', data);
      this.classificacoes = data;
    });
  }

  getTamanhos(id: number) {
    this.idClassificacaoSelecionada = id;
    this.classificacaoService.getTamanhos(id).subscribe((data: Tamanho[]) => {
      console.log('Tamanhos:', data);
      this.tamanhos = data.map(t => ({
        ...t,
        precoEditavel: t.preco.toFixed(2).replace('.', ',')
      }));
    });
  }

  getProdutos(id: number) {
    this.idClassificacaoSelecionada = id;
    this.classificacaoService.getProdutos(id).subscribe((data: Produto[]) => {
      console.log('Produtos:', data);
      this.produtos = data.map(t => ({
        ...t,
        precoEditavel: t.preco.toFixed(2).replace('.', ',')
      }));
    });
  }

  getPrecoNumerico(precoEditavel: string): number {
    return parseFloat(precoEditavel.replace(',', '.'));
  }

  salvarPrecos() {
    if (!this.idClassificacaoSelecionada) return;

    if (this.tamanhos.length > 0) {
      const precos_tamanhos = this.tamanhos.map(t => ({
        id_tamanho: t.id_tamanho,
        preco: this.getPrecoNumerico(t.precoEditavel)
      }));

      const payload = {
        id_classificacao: this.idClassificacaoSelecionada,
        precos_tamanhos
      };

      this.classificacaoService.atualizarPrecosTamanhos(payload).subscribe({
        next: res => {
          console.log('Preços dos tamanhos atualizados com sucesso', res);
          alert('Preços dos tamanhos atualizados com sucesso!');
        },
        error: err => {
          console.error('Erro ao atualizar preços dos tamanhos', err);
          alert('Erro ao atualizar os preços dos tamanhos!');
        }
      });
    }

    if (this.produtos.length > 0) {
      const precos_produtos = this.produtos.map(p => ({
        id_produto: p.id_produto,
        preco: this.getPrecoNumerico(p.precoEditavel)
      }));

      const payload = {
        id_classificacao: this.idClassificacaoSelecionada,
        precos_produtos
      };

      this.classificacaoService.atualizarPrecosProdutos(payload).subscribe({
        next: res => {
          console.log('Preços dos produtos atualizados com sucesso', res);
          alert('Preços dos produtos atualizados com sucesso!');
        },
        error: err => {
          console.error('Erro ao atualizar preços dos produtos', err);
          alert('Erro ao atualizar os preços dos produtos!');
        }
      });
    }
  }

  selecionarClassificacao(classificacao: Classificacao) {
    this.classificacaoSelecionada = classificacao;
    this.idClassificacaoSelecionada = classificacao.id_classificacao;

    if (classificacao.usa_tamanho) {
      this.getTamanhos(classificacao.id_classificacao);
      this.produtos = [];
    } else {
      this.getProdutos(classificacao.id_classificacao);
      this.tamanhos = [];
    }
  }
}
