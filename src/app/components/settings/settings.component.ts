import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataApiService } from '@app/services/data-api-service';
import { GlobalService } from '@app/services/global.service';
import { virtualRouter } from '@app/services/virtualRouter.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  totalRepositorios: number = 0;
  totalTemas: number = 0;
  totalCategories: number = 0;
  isEditMode: boolean = false;
  editingTema: string | null = null;
  formData: any = {};

  constructor(
    public global: GlobalService,
    public virtualRoute: virtualRouter,
    public dataApi: DataApiService
  ) {
    this.global.getRepositorios().subscribe(
      (data: any) => {
        this.global.getRepositorios = data.items; // Si la API devuelve un objeto con 'items'
        this.totalRepositorios = data.items.length;  // Actualiza el total de s
        console.log('repositorios:', this.global.getRepositorios);
      },
      (error) => {
        console.error('Error al obtener s:', error);
      }
    );
    this.global.getTemas().subscribe(
      (data: any) => {
        this.global.getTemas = data.items; // Si la API devuelve un objeto con 'items'
        this.totalTemas = data.items.length;  // Actualiza el total de s
        console.log('repositorios:', this.global.getTemas);
      },
      (error) => {
        console.error('Error al obtener s:', error);
      }
    );
    this.global.getCategories().subscribe(
      (data: any) => {
        this.global.getCategories = data.items; // Si la API devuelve un objeto con 'items'
        this.totalCategories = data.items.length;  // Actualiza el total de s
        console.log('repositorios:', this.global.getCategories);
      },
      (error) => {
        console.error('Error al obtener s:', error);
      }
    );

  }

  editTema(tema: any): void {
    this.isEditMode = true;
    this.editingTema = tema.id;
    this.formData = { ...tema };
  
    // Asegurarte de que `repositorios` sea un objeto
    if (!this.formData.repositorios) {
      this.formData.repositorios = { id: '', name: '' };
    }
  }
  editRepo(repo: any): void {
    this.isEditMode = true; // Set edit mode to true
    this.formData = { ...repo }; // Copy the selected repo data to formData
}
  viewRepositorio(repositorio: any) {
    this.global.repositorios = repositorio; // Store the selected repository
    this.global.repositorios = this.global.repositorios; // Ensure the repositories are available
}

// Actualizar tema

  updateTema(): void {
    if (!this.editingTema) return;
  
    this.dataApi.updateTema(this.formData, this.editingTema).subscribe(
      (response) => {
        const index = this.global.temas.findIndex(tema => tema.id === this.editingTema);
        if (index !== -1) {
          this.global.temas[index] = response;
          this.global.temas = [...this.global.temas];
        }
  
        Swal.fire('Éxito', 'El  ha sido actualizado con éxito.', 'success');
        this.resetForm();
      },
      (error) => {
        Swal.fire('Error', 'Ocurrió un error al actualizar el .', 'error');
      }
    );
  }
  deleteTema(tema: any) {
    const temaId = tema.id;
  
    if (!temaId) {
      console.error('No se puede eliminar el : ID no definido');
      return;
    }
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se podrá revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataApi.deleteTema(temaId).subscribe(
          response => {
            console.log(' eliminado:', response);
            
            // Eliminar el  de la lista local
            this.global.temas = this.global.temas.filter(tema => tema.id !== temaId);
            this.global.filteredTemas = this.global.filteredTemas.filter(tema => tema.id !== temaId);
            
            Swal.fire(
              'Borrado!',
              'El  ha sido eliminado.',
              'success'
            );
          },
          error => {
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el . Inténtelo de nuevo más tarde.',
              'error'
            );
            console.error('Error al borrar el :', error);
          }
        );
      }
    });
  }
  updateRepo(): void {
    // Call your service to update the repository
    this.dataApi.updateRepositorio(this.formData, this.formData.id).subscribe(
        (response) => {
            // Update the local repositories list with the updated data
            const index = this.global.repositorios.findIndex(repo => repo.id === this.formData.id);
            if (index !== -1) {
                this.global.repositorios[index] = response; // Update the repository in the list
            }
            // Reset the form and exit edit mode
            this.resetForm();
            Swal.fire('Éxito', 'El repositorio ha sido actualizado con éxito.', 'success');
        },
        (error) => {
            Swal.fire('Error', 'Ocurrió un error al actualizar el repositorio.', 'error');
        }
    );
}


  
  resetForm() {
    this.isEditMode = false;
    this.editingTema = null;
    this.formData = {};

  }
  
  cancelDelete(){}

}
