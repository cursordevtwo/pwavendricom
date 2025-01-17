import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() modalType: string = ''; // Recibe el tipo de modal
  @Output() close = new EventEmitter<void>(); // Evento para cerrar la modal
  
  isVisible: boolean = false; // Usamos solo esta propiedad para controlar la visibilidad

  constructor() {}

  ngOnInit() {
    console.log('Modal type:', this.modalType); // Verifica el tipo de modal
  }

  openModal() {
    this.isVisible = true; // Establece isVisible a true para mostrar la modal
  }

  closeModal() {
    this.isVisible = false; // Establece isVisible a false para ocultar la modal
    this.close.emit(); // Emite el evento 'close' para informar al componente padre que debe cerrar la modal
  }
}
