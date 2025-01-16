import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core'; // Ensure Input is imported

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() modalType: string = ''; // This should now work
  isVisible: boolean = false;
  constructor() {}
  ngOnInit() {
    console.log('Modal type:', this.modalType); // This will log the modal type
  }
  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false; // Esto debe ocultar el modal
  }

}