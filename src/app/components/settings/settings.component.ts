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
  editingRepo: string | null = null;
  editingCategoria: string | null = null;
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
submitNewCategoria(): void {
  if (this.isEditMode) {
      // Update existing category
      this.dataApi.updateCategory(this.formData, this.formData.id).subscribe(
          (response) => {
              const index = this.global.categories.findIndex(categoria => categoria.id === this.formData.id);
              if (index !== -1) {
                  this.global.categories[index] = response; // Update the category in the list
              }
              Swal.fire('Éxito', 'La categoría ha sido actualizada con éxito.', 'success');
              this.resetForm(); // Reset the form after submission
          },
          (error) => {
              Swal.fire('Error', 'Ocurrió un error al actualizar la categoría.', 'error');
              console.error('Error updating category:', error);
          }
      );
  } else {
      // Add new category
      this.dataApi.saveCategory(this.formData).subscribe(
          (response) => {
              this.global.categories.push(response); // Add the new category to the list
              Swal.fire('Éxito', 'La categoría ha sido agregada con éxito.', 'success');
              this.resetForm(); // Reset the form after submission
          },
          (error) => {
              Swal.fire('Error', 'Ocurrió un error al agregar la categoría.', 'error');
              console.error('Error adding category:', error);
          }
      );
  }
}

updateCategoria(categoria: any): void {
  // Populate formData with the selected category
  this.formData = { ...categoria }; 
  this.isEditMode = true; // Set edit mode to true

  // Optionally, you can log the formData to ensure it's populated correctly
  console.log('Editing category:', this.formData);
}
deleteCategoria(categoria: any) {
  const categoriaId = categoria.id;

  if (!categoriaId) {
    console.error('No se puede eliminar la categoria: ID no definido');
    return;
  }

  Swal.fire({
    title: '¿Estás seguro?',
    text: '¡Estaacción no se podrá revertir!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, borrar!',
    cancelButtonText: 'No, cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.dataApi.deleteCategory(categoriaId).subscribe(
        response => {
          console.log(' eliminado:', response);
          
          // Eliminar la categoria de la lista local
          this.global.categories = this.global.categories.filter(categoria => categoria.id !== categoriaId);
          this.global.filteredCategories = this.global.filteredCategories.filter(categoria => categoria.id !== categoriaId);
          
          Swal.fire(
            'Borrado!',
            'La categoria ha sido eliminado.',
            'success'
          );
        },
        error => {
          Swal.fire(
            'Error',
            'Ocurrido un error al eliminar la categoria. Inténtelo de nuevo más tarde.',
            'error'
          );
          console.error('Error al borrar la categoria:', error);
        }
      );
    }
  });
}
submitNewTema(): void {
  if (this.isEditMode) {
      // Update existing tema
      this.dataApi.updateTema(this.formData, this.formData.id).subscribe(
          (response) => {
              const index = this.global.temas.findIndex(tema => tema.id === this.formData.id);
              if (index !== -1) {
                  this.global.temas[index] = response; // Update the tema in the list
              }
              Swal.fire('Éxito', 'El tema ha sido actualizado con éxito.', 'success');
              this.resetForm(); // Reset the form after submission
          },
          (error) => {
              Swal.fire('Error', 'Ocurrió un error al actualizar el tema.', 'error');
              console.error('Error updating tema:', error);
          }
      );
  } else {
      // Add new tema
      this.dataApi.saveTema(this.formData).subscribe(
          (response) => {
              this.global.temas.push(response); // Add the new tema to the list
              Swal.fire('Éxito', 'El tema ha sido agregado con éxito.', 'success');
              this.resetForm(); // Reset the form after submission
          },
          (error) => {
              Swal.fire('Error', 'Ocurrió un error al agregar el tema.', 'error');
              console.error('Error adding tema:', error);
          }
      );
  }
}
updateTema(tema: any): void {
  // Populate formData with the selected category
  this.formData = { ...tema }; 
  this.isEditMode = true; // Set edit mode to true

  // Optionally, you can log the formData to ensure it's populated correctly
  console.log('Editing tema:', this.formData);
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
submitNewRepo(): void {
  if (this.isEditMode) {
      // Update existing repository
      this.dataApi.updateRepositorio(this.formData, this.formData.id).subscribe(
          (response) => {
              const index = this.global.repositorios.findIndex(repo => repo.id === this.formData.id);
              if (index !== -1) {
                  this.global.repositorios[index] = response; // Update the repository in the list
              }
              Swal.fire('Éxito', 'El repositorio ha sido actualizado con éxito.', 'success');
              this.resetForm(); // Reset the form after submission
          },
          (error) => {
              Swal.fire('Error', 'Ocurrió un error al actualizar el repositorio.', 'error');
              console.error('Error updating repository:', error);
          }
      );
  } else {
      // Add new repository
      this.dataApi.saveRepositorio(this.formData).subscribe(
          (response) => {
              this.global.repositorios.push(response); // Add new repository to the list
              Swal.fire('Éxito', 'El repositorio ha sido agregado con éxito.', 'success');
              this.resetForm(); // Reset the form after submission
          },
          (error) => {
              Swal.fire('Error', 'Ocurrió un error al agregar el repositorio.', 'error');
              console.error('Error adding repository:', error);
          }
      );
  }
}
updateRepositorio(repositorio: any): void {
  // Populate formData with the selected repository
  this.formData = { ...repositorio }; 
  this.isEditMode = true; // Set edit mode to true

  // Optionally, you can log the formData to ensure it's populated correctly
  console.log('Editing repo:', this.formData);
}
deleteRepositorio(repositorio: any) {
const repositorioId = repositorio.id;

if (!repositorioId) {
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
    this.dataApi.deleteRepositorio(repositorioId).subscribe(
      response => {
        console.log(' eliminado:', response);
        
        // Eliminar el  de la lista local
        this.global.repositorios = this.global.repositorios.filter(repo => repo.id !== repositorioId);
        
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
 resetForm() {
    this.isEditMode = false;
    this.editingTema = null;
    this.editingRepo = null;
    this.editingCategoria = null;
    this.formData = {};

  }

cancelDelete(){ 
  this.resetForm();
} 

}
