import { HttpClient } from '@angular/common/http';
import { Component,OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRESTService } from '@app/services/auth-rest.service';
import { Butler } from '@app/services/butler.service';
import { GlobalService } from '@app/services/global.service';
import { PocketAuthService } from '@app/services/pocket-auth.service';
import { ScriptService } from '@app/services/script.service';
import { virtualRouter } from '@app/services/virtualRouter.service';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { UploaderCaptions } from 'ngx-awesome-uploader';
import { DemoFilePickerAdapter } from '@app/file-picker.adapter';
import { ImageUploadService } from '@app/services/image-upload.service';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { DataApiService } from '@app/services/data-api-service';
import Swal from 'sweetalert2';
import { FilterByRepositorioPipe } from '@app/pipes/filter-by-repositorio.pipe';

interface DocumentInterface {
  id?: string;
  categories: any[];
  temas: any[];
  repositorios: any[];
  files: string[];
  issue: string;
  image: string;
  serial: string;
  receiver: string;
  subject: string;
  entity: string;
  status: string;
}
@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [
    CommonModule,
    FilePickerModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule
  ],
  providers: [FilterByRepositorioPipe],
  templateUrl: './file-manager.component.html',
  /* styleUrl: './file-manager.component.css', */
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit{
  @ViewChild('infoDiv', { static: true }) infoDiv!: ElementRef;
  years: number[] = [];
  isEditMode: boolean = false;
    data = {
    id:'',
    categories: [] as any[],
    temas: [] as any[],
    repositorios: [] as any[],
    files: [] as string[],
    issue: '',
    image: '',
    serial: '',
    receiver: '',
    subject: '',
    entity: '',
    status: '',
    repositorioId: '',
  };
  
docummentSelected: DocumentInterface = {
  id:'',
  categories: [],
  temas: [],
  repositorios:[],
  files: [],
  issue: '',
  image: '',
  serial: '',
  receiver: '',
  subject: '',
  entity: '',
  status: '',

};
  dropdownSettings: IDropdownSettings = {};
  formData: any = {};
  editingDocumentId: string | null = null; // Almacena el ID del documento que se está editando
  showDocuments: boolean = false;
  public filteredTemas: any[] = []; // para almacenar los temas filtrados

  public captions: UploaderCaptions = {
    dropzone: {
      title: 'Imágenes del producto',
      or: '.',
      browse: 'Cargar',
    },
    cropper: {
      crop: 'Cortar',
      cancel: 'Cancelar',
    },
    previewCard: {
      remove: 'Borrar',
      uploadError: 'error',
    },
  };
  adapter = new DemoFilePickerAdapter(this.http, this._butler, this.global);
  selectedCategory: any; // La categoría seleccionada
  filteredRepositorios: any[] = []; // Para guardar los repositorios filtrados
  selectedRepositorio: any = null; // Para guardar el repositorio seleccionado

  constructor(
    public imageUpload: ImageUploadService,
    private formBuilder: FormBuilder,
    public AuthRESTService: AuthRESTService,
    public pocketAuthService: PocketAuthService,
    public global: GlobalService,
    public http: HttpClient,
    public _butler: Butler,
    public script: ScriptService,
    public virtualRouter: virtualRouter,
    private renderer: Renderer2,
    public dataApi: DataApiService
  ) {
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Seleccionar Todo',
      unSelectAllText: 'Deseleccionar Todo',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  
  close() {
    // Aquí va tu lógica para la acción
    this.renderer.removeClass(this.infoDiv.nativeElement, 'fmapp-info-active');
    // Luego de la acción, agregar la clase
    this.renderer.addClass(this.infoDiv.nativeElement, 'fmapp-wrap');
  }
  open(option:string){
    this.global.modaltitle=option;
  }
  setPreview(selected:any){
    
    this.docummentSelected=selected;
    
  }
  viewAllDocuments(){
    this.showDocuments = false;
    this.global.filteredDocuments = this.global.documents;
  }
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 40; i++) {
      this.years.push(currentYear - i);
    }
    
    // Asegúrate que global.filteredTemas tenga datos
    console.log('Temas:', this.global.filteredTemas);
    
    // Verifica si temaSelected está establecido
    console.log('Tema seleccionado:', this.global.temaSelected);
    
  }
  viewRepositorio(repositorio: any) {
    this.showDocuments = true;
    if (repositorio && repositorio.id) {
      // Filter documents that belong to the selected repository
      this.global.filteredDocuments = this.global.documents.filter(doc => 
        doc.repositorios.some((repo: any) => repo.id === repositorio.id)
      );
      
      if (this.global.filteredDocuments.length === 0) {
        Swal.fire({
          title: 'Info',
          text: 'No se encontraron documentos en este repositorio',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    } else {
      // If no repository is selected, show all documents
      this.global.filteredDocuments = this.global.documents;
    }
  }

  onCategoryChange(selectedCategory: any): void {
    if (selectedCategory && selectedCategory.length > 0) {
      console.log('Categoría seleccionada: ' + JSON.stringify(selectedCategory));
      this.global.categorySelected = true;
      
      // Asegúrate de que el objeto tenga la propiedad 'id'
      if (selectedCategory[0] && selectedCategory[0].id) {
        let idCategorySelected = selectedCategory[0].id;
        this.global.filteredRepositorios = [];
  
        for (let repository of this.global.repositorios) {
          console.log(
            'Comparando [' + idCategorySelected + '] con [' + repository.idFhater + ']'
          );
          if (idCategorySelected === repository.idFhater) {
            console.log('Repositorio agregado al array: ' + JSON.stringify(repository));
            this.global.filteredRepositorios.push(repository);
          }
        }
      } else {
        console.error('El objeto de la categoría seleccionada no tiene un id válido.');
      }
    } else {
      this.global.categorySelected = false;
      this.global.filteredRepositorios = [];
    }
  }  

  submitForm() {
    // Aquí puedes manejar los datos del formulario, por ejemplo, enviarlos a un servicio o imprimirlos en la consola.
    console.log(this.formData);
  
    // Mapear los datos del formulario al objeto data
    this.data.entity = this.formData.entidadRegulatoria;
    this.data.subject = this.formData.asunto;
    this.data.receiver = this.formData.nombreReceptor;
    this.data.issue = this.formData.fechaEmision;
    this.data.serial = this.formData.serial;
    this.data.files = this._butler.uploaderImages;
  
    // Guardar el documento en el backend
    this.dataApi.saveDocument(this.data).subscribe(
      (response) => {
        // Agregar el nuevo documento a la lista global de documentos
        this.global.documents.push(response);
        this.global.documents = [...this.global.documents];
        this.global.filteredDocuments = this.global.documents;
        this.global.filteredDocuments = [...this.global.filteredDocuments];
  
        // Mostrar alerta de éxito con SweetAlert
        Swal.fire({
          title: 'Éxito',
          text: 'El documento ha sido guardado con éxito.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
  
        // Limpiar el formulario y resetear el objeto data
        this.data = {
          id:'',
          categories: [],
          temas: [],
          repositorios:[],
          files: [],
          issue: '',
          image: '',
          serial: '',
          receiver: '',
          subject: '',
          entity: '',
          status: '',
          repositorioId: '',
        };
        
        // Limpiar las imágenes subidas
        this._butler.uploaderImages = [];
        console.log('Documento cargado con éxito:', response);
  
        // Opcionalmente, cerrar modal si se utilizaba
        // this.activeModal.close();
      },
      (error) => {
        console.error('Error al guardar el documento:', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al guardar el documento. Por favor, inténtelo de nuevo.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  
    // Limpia el formulario después de enviarlo.
    this.formData = {};
  }
  
  // Manejar el inicio del modo de edición

    editDocument(document: any): void {
      this.isEditMode = true;
      this.editingDocumentId = document.id;
      this.formData = { ...document };
    
      // Asegurarte de que `repositorios` sea un objeto
      if (!this.formData.repositorios) {
        this.formData.repositorios = { id: '', name: '' };
      }
    }
    
    

  // Actualizar documento
 
    updateDocument(): void {
      if (!this.editingDocumentId) return;
    
      this.dataApi.updateDocument(this.formData, this.editingDocumentId).subscribe(
        (response) => {
          const index = this.global.documents.findIndex(doc => doc.id === this.editingDocumentId);
          if (index !== -1) {
            this.global.documents[index] = response;
            this.global.filteredDocuments = [...this.global.documents];
          }
    
          Swal.fire('Éxito', 'El documento ha sido actualizado con éxito.', 'success');
          this.resetForm();
        },
        (error) => {
          Swal.fire('Error', 'Ocurrió un error al actualizar el documento.', 'error');
        }
      );
    }
    
    
  // Reiniciar formulario
  resetForm(): void {
    this.isEditMode = false;
    this.editingDocumentId = null;
    this.formData = {
      repositorios: { id: '', name: '' }
    };
  }
  

  
  deleteDocuments(document: any) {
    const documentId = document.id;
  
    if (!documentId) {
      console.error('No se puede eliminar el documento: ID no definido');
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
        this.dataApi.deleteDocuments(documentId).subscribe(
          response => {
            console.log('Documento eliminado:', response);
            
            // Eliminar el documento de la lista local
            this.global.documents = this.global.documents.filter(doc => doc.id !== documentId);
            this.global.filteredDocuments = this.global.filteredDocuments.filter(doc => doc.id !== documentId);
            
            Swal.fire(
              'Borrado!',
              'El documento ha sido eliminado.',
              'success'
            );
          },
          error => {
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el documento. Inténtelo de nuevo más tarde.',
              'error'
            );
            console.error('Error al borrar el documento:', error);
          }
        );
      }
    });
  }
  
  cancelDelete(){}
}
