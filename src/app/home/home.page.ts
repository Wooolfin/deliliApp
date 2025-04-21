import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
import { PratoService } from '../services/prato/prato.service';
import { Prato } from '../services/prato/prato.model';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../services/pedido/pedido.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {
  pratos: Prato[] = [];
  itensSacola: any[] = [];
  modalAberto = false;

  constructor(
    private pratoService: PratoService,
    private alertController: AlertController,
    private modalController: ModalController,
    private pedidoService: PedidoService,
  ) {}

  ngOnInit() {
    this.carregarPratos();
  }

  carregarPratos() {
    this.pratoService.getPratos().subscribe((data: Prato[]) => {
      console.log('Dados recebidos do backend:', data);
      this.pratos = data;
    });
  }

  async abrirQuantidade(prato: Prato) {
    const alert = await this.alertController.create({
      header: `Selecionar quantidade para ${prato.nome}`,
      inputs: [
        {
          name: 'quantidade',
          type: 'number',
          min: 1,
          value: 1,
          placeholder: 'Quantidade',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            const quantidade = parseInt(data.quantidade, 10);
            if (quantidade > 0) {
              this.itensSacola.push({ ...prato, quantidade });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  abrirSacola() {
    this.modalAberto = true;
  }

  editarItem(index: number) {
    const item = this.itensSacola[index];
    this.alertController
      .create({
        header: `Editar quantidade de ${item.nome}`,
        inputs: [
          {
            name: 'quantidade',
            type: 'number',
            value: item.quantidade,
            min: 1,
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Atualizar',
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
    return this.itensSacola.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
  }

  finalizarPedido() {
    this.alertController.create({
      header: 'Informações do Cliente',
      inputs: [
        {
          name: 'cliente',
          type: 'text',
          placeholder: 'Nome do Cliente',
        },
        {
          name: 'telefone',
          type: 'tel',
          placeholder: 'Telefone',
        },
        {
          name: 'endereco',
          type: 'text',
          placeholder: 'Endereço',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: async (data) => {
            const pedido = {
              cliente: data.cliente,
              telefone: data.telefone,
              endereco: data.endereco,
            };
  
            const response = await this.pedidoService.addPedido(pedido);
  
            for (const item of this.itensSacola) {
              await this.pedidoService.addItemSacola({
                pedido_id: response.pedido_id,
                produto_id: item.id,
                quantidade: item.quantidade
              });
            }
  
            this.itensSacola = [];
            this.alertController.dismiss();
          }
        }
      ]
    }).then(alert => alert.present());
  }
}
