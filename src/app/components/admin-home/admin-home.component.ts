import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { ImageUploadService } from '@app/services/image-upload.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { virtualRouter } from '@app/services/virtualRouter.service';
import { ModalComponent } from '../modal/modal.component';

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
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalComponent],
})
export class AdminHomeComponent implements OnInit {
  loading = false;
  currentPage = 1;
  itemsPerPage = 30;
  totalItems = 0;
  totalDocuments =0;
  totalNormativas =0;
  totalModelos =0;
  totalJurisprudencias =0;
  totalBoletines =0;
  totalPublicidad =0;
  totalPages = 0;
  Math = Math;
  dateRange: string = '';
  documentos: any[] = [];
  document: any;
  modalVisible: boolean = false;
  modalType: string = '';

  constructor(
    public globalService: GlobalService,
    public imageUpload: ImageUploadService,
    public virtualRoute: virtualRouter
  ) {
  
     this.globalService.getDocuments().subscribe(
      (data: any) => {
        this.globalService.getDocuments = data.items; // Si la API devuelve un objeto con 'items'
        this.totalDocuments = data.items.length;  // Actualiza el total de documentos
        console.log('documentos:', this.globalService.getDocuments);
      },
      (error) => {
        console.error('Error al obtener documentos:', error);
      }
    );
    this.globalService.getNormativas().subscribe(
      (data: any) => {
        this.globalService.getNormativas = data.items; // Si la API devuelve un objeto con 'items'
        this.totalNormativas = data.items.length;  // Actualiza el total de documentos
        console.log('normativas:', this.globalService.getNormativas);
      },
      (error) => {
        console.error('Error al obtener normativas:', error);
      }
    );
    this.globalService.getJurisprudencias().subscribe(
      (data: any) => {
        this.globalService.getJurisprudencias = data.items; // Si la API devuelve un objeto con 'items'
        this.totalJurisprudencias = data.items.length;  // Actualiza el total de documentos
        console.log('jurisprudencias:', this.globalService.getJurisprudencias);
      },
      (error) => {
        console.error('Error al obtener jurisprudencias:', error);
      }
    );
    this.globalService.getPublicidades().subscribe(
      (data: any) => {
        this.globalService.getPublicidades = data.items; // Si la API devuelve un objeto con 'items'
        this.totalPublicidad = data.items.length;  // Actualiza el total de documentos
        console.log('publicidad:', this.globalService.getPublicidades);
      },
      (error) => {
        console.error('Error al obtener publicidad:', error);
      }
    );
    this.globalService.getBoletines().subscribe(
      (data: any) => {
        this.globalService.getBoletines = data.items; // Si la API devuelve un objeto con 'items'
        this.totalBoletines = data.items.length;  // Actualiza el total de documentos
        console.log('boletines:', this.globalService.getBoletines);
      },
      (error) => {
        console.error('Error al obtener boletines:', error);
      }
    );
    this.globalService.getModelos().subscribe(
      (data: any) => {
        this.globalService.getModelos = data.items; // Si la API devuelve un objeto con 'items'
        this.totalModelos = data.items.length;  // Actualiza el total de documentos
        console.log('modelos:', this.globalService.getModelos);
      },
      (error) => {
        console.error('Error al obtener modelos:', error);
      }
    );

    this.globalService.getClientesOperadores().subscribe(
      (data: any) => {
        this.globalService.clientesOperadores = data.items; // Si la API devuelve un objeto con 'items'
        console.log('Clientes Operadores:', this.globalService.clientesOperadores);
      },
      (error) => {
        console.error('Error al obtener clientes operadores:', error);
      }
    );
   
    // Obtener la fecha actual
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 1); 
     this.dateRange = this.formatDate(currentDate);
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
          a.NombreOperador.localeCompare(b.NombreOperador, 'es', { sensitivity: 'base' })
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
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('es-US', options);
  }
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
