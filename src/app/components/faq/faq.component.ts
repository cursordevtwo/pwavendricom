import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  modalVisible: boolean = false;
  modalType: string = '';
constructor (
  public global: GlobalService
){}
openModal(modalType: string): void {
  this.modalType = modalType;
  this.modalVisible = true;
  console.log('Modal abierta:', modalType);
}

closeModal() {
  this.modalVisible = false;
  console.log('Modal cerrada');
}
}
