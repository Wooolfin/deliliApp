import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { PratoService } from '../services/prato/prato.service';
import { Prato } from '../services/prato/prato.model';
import { CadastroModalPage } from '../cadastro/cadastro-modal.page';
import { AlertController } from '@ionic/angular';

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

  pratos: Prato[] = [];

  constructor(
    private pratoService: PratoService,
    private modalController: ModalController,
    private alertController: AlertController
 
  ) {}

  ngOnInit() {
    this.getPratos();
  }

  getPratos() {
    this.pratoService.getPratos().subscribe((data: Prato[]) => {
      console.log('Dados recebidos do backend:', data);
      this.pratos = data;
    });
  }

  updatePrato(prato: Prato) {
    this.pratoService.updatePrato(prato).subscribe(() => {
      this.getPratos();
    });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CadastroModalPage
    });
  
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log('Novo prato retornado:', dataReturned.data);
        this.getPratos();
      }
    });
  
    return await modal.present();
  }

  async openEditAlert(prato: Prato) {
    const alert = await this.alertController.create({
      header: 'Editar Prato',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Nome',
          value: prato.nome,
        },
        {
          name: 'descricao',
          type: 'text',
          placeholder: 'Descrição',
          value: prato.descricao,
        },
        {
          name: 'valor',
          type: 'number',
          placeholder: 'Valor',
          value: prato.valor,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: (data) => {
            const pratoAtualizado: Prato = {
              id: prato.id,
              nome: data.nome,
              descricao: data.descricao,
              valor: parseFloat(data.valor),
            };
            this.updatePrato(pratoAtualizado);
          },
        },
      ],
    });
  
    await alert.present();
  }  
}
