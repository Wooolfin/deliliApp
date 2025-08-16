import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
import { Produto } from '../services/pedido/pedido.model';
import { PedidoService } from '../services/pedido/pedido.service';
import { ItemSacola, ItemSacolaRequest } from '../services/pedido/item-sacola.model';
import { CommonModule } from '@angular/common';
import { SelectQuantidadeModalComponent } from '../pedido/select-quantidade-modal/select-quantidade-modal.component'


@Component({
  selector: 'app-home',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PedidosPage implements OnInit {
  produtos: Produto[] = [];
  produtosAgrupados: any[] = [];
  itensSacola: ItemSacola[] = [];
  itensSacolaRequest: ItemSacolaRequest[] = [];
  modalAberto = false;

  classificacaoSelecionada: string | null = null;

  constructor(
    private alertController: AlertController,
    private pedidoService: PedidoService,
    private modalCtrl: ModalController,

  ) { }

  ngOnInit() {
    this.carregarProdutos();
  }

  selecionarClassificacao(cat: string | null) {
    this.classificacaoSelecionada = cat;
  }

  get itemCount(): number {
    return this.itensSacola.length;
  }

  get valorTotal(): number {
    return this.itensSacola.reduce((acc, item) => acc + item.preco * item.quantidade, 0)
  }

  carregarProdutos() {
    this.pedidoService.getProdutos().subscribe((data: Produto[]) => {
      console.log('[getProdutos] Produtos recebidos:', data);
      this.produtos = data;
      this.produtosAgrupados = this.agruparPorClassificacao(data);
    });
  }

  private agruparPorClassificacao(produtos: Produto[]) {
    const grupos: { [key: string]: Produto[] } = {};

    produtos.forEach(produto => {
      const key = produto.nome_classificacao || 'Outros';
      if (!grupos[key]) {
        grupos[key] = [];
      }
      grupos[key].push(produto);
    });

    return Object.entries(grupos).map(([classificacao, produtos]) => {
      const produtoComTamanho = produtos.find(p => p.usa_tamanho === 1 && p.classificacao_preco?.length);
      const primeiroPreco = produtoComTamanho?.classificacao_preco?.[0];
      return {
        classificacao,
        produtos,
        usaTamanho: !!produtoComTamanho,
        tamanho: primeiroPreco?.descricao_tamanho,
        preco: primeiroPreco?.preco
      };
    });
  }

  async abrirQuantidade(produto: Produto) {
    const modal = await this.modalCtrl.create({
      component: SelectQuantidadeModalComponent,
      componentProps: { produto }
    })
    await modal.present()
    const { data } = await modal.onDidDismiss()
    if (data) {
      const { quantidade, tamanhoIndex, deliveryNotes } = data
      this.handleConfirmar({ quantidade: quantidade.toString(), tamanho: tamanhoIndex.toString() }, produto, deliveryNotes)
    }
  }

  handleConfirmar(data: any, produto: Produto, deliveryNotes?: string) {
    const quantidade = parseInt(data.quantidade, 10);
    if (quantidade > 0) {
      let preco = produto.preco_unico ?? 0;
      let selectedTamanho;

      if (produto.usa_tamanho && produto.classificacao_preco?.length) {
        const selectedIndex = parseInt(data.tamanho, 10);
        selectedTamanho = produto.classificacao_preco[selectedIndex];
        preco = selectedTamanho.preco;
      }

      const item: ItemSacola = {
        pedido_id: 0,
        produto_id: produto.id_produto,
        nome_produto: produto.nome_produto,
        descricao: produto.descricao || '',
        id_classificacao: produto.id_classificacao,
        id_produto_preco: produto.id_produto_preco,
        nome_classificacao: produto.nome_classificacao,
        usa_tamanho: produto.usa_tamanho,
        preco: preco,
        quantidade: quantidade,
        selectedTamanho: selectedTamanho,
      };

      this.itensSacola.push(item);
    }
  }

  abrirSacola() {
    this.modalAberto = true;
  }

  editarItem(index: number) {
    const item = this.itensSacola[index];
    this.alertController
      .create({
        header: `Quantidade de ${item.nome_produto}`,
        cssClass: 'custom-alert',
        inputs: [
          {
            name: 'quantidade',
            type: 'number',
            value: item.quantidade,
            min: 1,
          },
        ],
        buttons: [
          { text: '', role: 'cancel', cssClass: 'alert-cancel-btn' },
          {
            text: 'Atualizar',
            cssClass: 'alert-confirm-btn',
            handler: (data) => {
              const novaQtd = parseInt(data.quantidade, 10);
              if (novaQtd > 0) {
                this.itensSacola[index].quantidade = novaQtd;
              }
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  removerItem(index: number) {
    this.itensSacola.splice(index, 1);
  }

  calcularTotal(): number {
    return this.itensSacola.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  }

  finalizarPedido() {
    this.alertController
      .create({
        header: 'Informações do Cliente',
        cssClass: 'custom-alert',
        inputs: [
          { name: 'cliente', type: 'text', placeholder: 'Nome do Cliente' },
          { name: 'telefone', type: 'tel', placeholder: 'Telefone' },
          { name: 'endereco', type: 'text', placeholder: 'Endereço' }
        ],
        buttons: [
          { text: '', role: 'cancel', cssClass: 'alert-cancel-btn' },
          {
            text: 'Confirmar',
            cssClass: 'alert-confirm-btn',
            handler: (data) => {
              const pedido = {
                cliente: data.cliente,
                telefone: data.telefone,
                endereco: data.endereco,
              };

              console.log('Enviando pedido:', pedido);

              this.pedidoService.addPedido(pedido).subscribe(response => {
                const pedido_id = response.pedido_id;

                console.log('Pedido criado com sucesso! ID do pedido:', pedido_id);

                const itensSacolaRequest: ItemSacolaRequest[] = this.itensSacola.map(item => {
                  let itemSacolaRequest: ItemSacolaRequest = {
                    pedido_id: pedido_id,
                    produto_id: item.produto_id,
                    quantidade: item.quantidade
                  };

                  if (item.usa_tamanho) {
                    itemSacolaRequest.id_classificacao_preco = item.selectedTamanho?.id_classificacao_preco;
                  } else {
                    itemSacolaRequest.id_produto_preco = item.id_produto_preco ?? item.id_produto_preco;
                  }

                  return itemSacolaRequest;
                });

                console.log('Enviando itens para a sacola:', itensSacolaRequest);

                this.pedidoService.addItemSacola(itensSacolaRequest).subscribe(() => {
                  console.log('Itens adicionados à sacola com sucesso!');
                  this.itensSacola = [];
                  this.alertController.dismiss();
                });
              });
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }




}
