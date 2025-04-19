import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { PratoService } from '../services/prato/prato.service';
import { Prato } from '../services/prato/prato.model';
import { CadastroModalPage } from '../cadastro/cadastro-modal.page';

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
    private modalController: ModalController  
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

  async openModal() {
    const modal = await this.modalController.create({
      component: CadastroModalPage
    });
  
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log('Novo prato retornado:', dataReturned.data);
        this.getPratos();  // 🔁 Atualiza a lista após adicionar
      }
    });
  
    return await modal.present();
  }
  
}
