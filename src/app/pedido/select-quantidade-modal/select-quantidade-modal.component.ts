import { Component, Input } from '@angular/core'
import { ModalController, IonicModule } from '@ionic/angular'
import { Produto } from '../../services/pedido/pedido.model'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-select-quantidade-modal',
  standalone: true,
  templateUrl: './select-quantidade-modal.component.html',
  styleUrls: ['./select-quantidade-modal.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class SelectQuantidadeModalComponent {
  @Input() produto!: Produto
  quantidade = 1
  tamanhoIndex = 0
  deliveryNotes = ''

  constructor(private modalCtrl: ModalController) {}

  decrement() {
    if (this.quantidade > 1) this.quantidade--
  }

  increment() {
    this.quantidade++
  }

  close() {
    this.modalCtrl.dismiss()
  }

  addToCart() {
    this.modalCtrl.dismiss({
      quantidade: this.quantidade,
      tamanhoIndex: this.tamanhoIndex,
      deliveryNotes: this.deliveryNotes
    })
  }
}
