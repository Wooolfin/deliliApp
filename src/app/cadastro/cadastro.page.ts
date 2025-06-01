import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { ProdutoService } from '../services/produto/produto.service';
import { Produto, Classificacao, Tamanho, ProdutoRequest, UpdateRequest } from '../services/produto/produto.model';
import { CadastroModalPage } from '../cadastro/cadastro-modal.page';

interface ClassificacaoView {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class CadastroPage implements OnInit {

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  classificacoes: ClassificacaoView[] = [];
  classificacaoSelecionada: string | null = null;

  constructor(
    private produtoService: ProdutoService,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getProdutos();
    this.getClassificacoes();
  }

  getProdutos() {
    this.produtoService.getProdutos().subscribe((data: Produto[]) => {
      this.produtos = data;

      this.produtos
        .filter(p => p.usa_tamanho)
        .forEach(p =>
          this.produtoService.getTamanhos(p.id_produto)
            .subscribe((tamanhos: Tamanho[]) => {
              p.tamanhos = tamanhos;
              p.selectedTamanho = tamanhos[0] || null;
            })
        );

      this.produtos
        .filter(p => !p.usa_tamanho)
        .forEach(p =>
          this.produtoService.getTamanhos(p.id_produto)
            .subscribe((tamanhos: Tamanho[]) => {
              if (tamanhos.length > 0) {
                p.preco = tamanhos[0].preco;
              }
            })
        );

      this.filtrarProdutos();
    });
  }

  getClassificacoes() {
    this.produtoService.getClassificacoes().subscribe((data: Classificacao[]) => {
      console.log('Classificações:', data);
      this.classificacoes = data.map(item => ({
        id: item.id,
        nome: item.nome_classificacao
      }));
    });
  }

  selecionarClassificacao(nomeClassificacao: string) {
    if (this.classificacaoSelecionada === nomeClassificacao) {
      this.classificacaoSelecionada = null;
    } else {
      this.classificacaoSelecionada = nomeClassificacao;
    }
    this.filtrarProdutos();
  }

  filtrarProdutos() {
    if (this.classificacaoSelecionada) {
      this.produtosFiltrados = this.produtos.filter(p => p.nome_classificacao === this.classificacaoSelecionada);
    } else {
      this.produtosFiltrados = this.produtos;
    }
  }

  onTamanhoChange(produto: Produto) {
    console.log('Tamanho selecionado para', produto.id_produto, produto.selectedTamanho);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CadastroModalPage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.getProdutos();
      }
    });

    return await modal.present();
  }

  async openEditAlert(produto: Produto) {
    const alert = await this.alertController.create({
      header: 'Editar Produto',
      inputs: [
        {
          name: 'nome_produto',
          type: 'text',
          placeholder: 'Nome do Produto',
          value: produto.nome_produto,
        },
        ...(produto.usa_tamanho
          ? [
            {
              name: 'descricao',
              type: 'textarea' as const,
              placeholder: 'Descrição do Produto',
              value: produto.descricao || '', 
            },
          ]
          : []),
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: (data) => {
            const produtoAtualizado: UpdateRequest = {
              id_produto: produto.id_produto,
              nome_produto: data.nome_produto,
              descricao: produto.usa_tamanho ? data.descricao : null,
              usa_tamanho: produto.usa_tamanho,
            };

            console.log('Produto Atualizado:', produtoAtualizado);

            this.updateProduto(produtoAtualizado);
          },
        },
      ],
    });

    await alert.present();
  }

  updateProduto(produto: UpdateRequest) {
    if (!produto.id_produto) {
      console.error('ID do produto é inválido ou não foi fornecido.');
      return;
    }


    this.produtoService.updateProduto(produto).subscribe({
      next: (res) => {
        this.getProdutos();
      },
      error: (err) => {
        console.error('Erro ao atualizar produto', err);
      },
    });
  }

  async openDeleteAlert(produto: Produto) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: `Deseja realmente deletar o produto ${produto.nome_produto}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Deletar',
          role: 'destructive',
          handler: () => {
            this.deleteProduto(produto.id_produto);
          },
        },
      ],
    });

    await alert.present();
  }

  deleteProduto(id_produto: number) {
    this.produtoService.deleteProduto(id_produto).subscribe(() => {
      this.getProdutos();
    });
  }
}
