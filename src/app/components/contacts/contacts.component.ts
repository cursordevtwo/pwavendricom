import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '@app/services/global.service';
interface ClienteOperador {
  NombreOperador: string;
  email: string;
  Telefono: string;
  Direccion: string;
}
interface Cliente {
  name: string;
  type: string;
  phone: string;
  images: string[];
}
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  loading = false;
  currentPage = 1;
  itemsPerPage = 30;
  totalItems = 0;
  totalPages = 0;
  Math = Math;
constructor (
  public globalService: GlobalService
)
{
  this.globalService.getClientesOperadores().subscribe(
    (data: any) => {
      this.globalService.clientesOperadores = data.items; // Si la API devuelve un objeto con 'items'
      console.log('Clientes Operadores:', this.globalService.clientesOperadores);
    },
    (error) => {
      console.error('Error al obtener clientes operadores:', error);
    }
  );
}
ngOnInit() {
  this.loadData();
}
private loadData(page: number = 1) {
  this.loading = true;
  
  this.globalService.getClientesOperadores(page, this.itemsPerPage).subscribe(
    (response) => {
      // Ordenar los clientes alfabéticamente por NombreOperador con tipos explícitos
      this.globalService.clientesOperadores = (response.items || []).sort((a: ClienteOperador, b: ClienteOperador) => 
        a.NombreOperador.localeCompare(b.NombreOperador, 'es', {sensitivity: 'base'})
      );
      
      this.totalItems = response.totalItems;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.currentPage = page;
      this.loading = false;
    },
    (error) => {
      console.error('Error loading clientes operadores:', error);
      this.loading = false;
    }
  );
}

onPageChange(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.loadData(page);
  }
}

get pages(): number[] {
  return Array.from({length: this.totalPages}, (_, i) => i + 1);
}
}
