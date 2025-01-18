import { HttpClient } from '@angular/common/http';
import { Component,OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
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
interface PublicidadInterface {
  id: string;
  categories: any[];
  temas: any[];
  files: string[];
  issue: string;
  image: string;
  whatsapp: string;
  subject: string;
  status: string;
  description: string
}
@Component({
  selector: 'app-publicity',
  standalone: true,
  imports: [
    CommonModule,
    FilePickerModule,
    FormsModule,
    NgMultiSelectDropDownModule,],
  templateUrl: './publicity.component.html',
  styleUrl: './publicity.component.css'
})
export class PublicityComponent {
  @ViewChild('infoDiv', { static: true }) infoDiv!: ElementRef;
  years: number[] = [];

  data = {
    id: '',
    categories: [] as any[],
    temas: [] as any[],
    files: [] as string[],
    issue: '',
    image: '',
    whatsapp: '',
    subject: '',
    description: '',
    status: '',
  };
  
docummentSelected: PublicidadInterface = {
  id: '',
  categories: [],
  temas: [],
  files: [],
  issue: '',
  image: '',
  whatsapp: '',
  description: '',
  subject: '',
  status: ''
};
  dropdownSettings: IDropdownSettings = {};
  formData: any = {};
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
  editMode: boolean = false;
  editingPublicidadId: string | null = null;
  isEditMode: boolean = false;
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
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 3,
      allowSearchFilter: true,
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

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 40; i++) {
      this.years.push(currentYear - i);
    }
  }
  submitForm() {
    // Aquí puedes manejar los datos del formulario, por ejemplo, enviarlos a un servicio o imprimirlos en la consola.
    console.log(this.formData);
    // this.dataApi.saveDocument(this.formData).subscribe(){};
    this.data.subject = this.formData.asunto;
    this.data.issue = this.formData.fechaEmision;
    this.data.whatsapp = this.formData.whatsapp;
    this.data.description = this.formData.description;
    this.data.files = this._butler.uploaderImages;
    this.dataApi.savePublicidades(this.data).subscribe(
      (response) => {
        this.global.publicidades.push(this.data);
        this.global.publicidades=[...this.global.publicidades];
        this.global.filteredPublicidad=this.global.publicidades;
        this.global.filteredPublicidad=[...this.global.filteredPublicidad];
        this.data = {
          id: '',
          categories: [],
          temas: [],
          files: [],
          issue: '',
          image: '',
          whatsapp: '',
          description: '',
          subject: '',
          status: ''
        };  
        // this.temas = [...this.temas];
        this._butler.uploaderImages=[];
        console.log('Publicidad cargada con éxito:', response);
        
      },
      (error) => {
        console.error('Error al guardar publicidad:', error);
      }
    );
    // Limpia el formulario después de enviarlo.
    this.formData = {};
  }
  editPublicidad(publicidad: PublicidadInterface): void {
    this.isEditMode = true; // Set edit mode to true
    this.editingPublicidadId = publicidad.id; // Store the ID of the publicidad being edited
    this.formData = { ...publicidad }; // Populate formData with the publicidad's data

    // Ensure that `repositorios` is a valid object
    if (!this.formData.repositorios) {
        this.formData.repositorios = { id: '', name: '' }; // Initialize if necessary
    }
}
  
updatePublicidad(formData: PublicidadInterface): void {
  if (!this.editingPublicidadId) return;

  this.dataApi.updatePublicidad(formData, this.editingPublicidadId).subscribe(
      (response) => {
          const index = this.global.publicidades.findIndex(publicidad => publicidad.id === this.editingPublicidadId);
          if (index !== -1) {
              this.global.publicidades[index] = response; // Update the publicidad in the global state
/*               this.global.filteredPublicidades = [...this.global.publicidades]; // Refresh the filtered list
 */          }

          Swal.fire('Éxito', 'El documento ha sido actualizado con éxito.', 'success');
          this.resetForm(); // Reset the form after successful update
      },
      (error) => {
          console.error('Error updating normativa:', error); // Log the error for debugging
          Swal.fire('Error', 'Ocurrió un error al actualizar el documento.', 'error');
      }
  );
}
  
  
// Reiniciar formulario
resetForm(): void {
  this.isEditMode = false;
  this.editingPublicidadId = null;
  this.formData = {
    id: '',
    subject: '',
    temas: [],
    categories: [],
    files: [],
    issue: '',
    image: '',
    serial: '',
    receiver: '',
    entity: '',
    status: ''
  };
  
}
deletePublicidad(publicidad: PublicidadInterface) {
  const documentId = publicidad.id;

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
      this.dataApi.deletePublicidad(documentId).subscribe(
        response => {
          console.log('Documento eliminado:', response);
          
          // Eliminar el documento de la lista local
          this.global.publicidades = this.global.publicidades.filter(doc => doc.id !== documentId);
/*           this.global.filteredPublicidades = this.global.publicidades.filter(doc => doc.id !== documentId);
 */          
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
cancelarDelete() {
  this.editingPublicidadId = null;
  this.isEditMode = false;
}
}
  
