import { Component } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ModalComponent, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  modalVisible: boolean = false;
  modalType: string = '';

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
