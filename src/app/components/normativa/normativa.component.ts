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
interface NormativaInterface {
  id: string;
  categories: any[];
  temas: any[];
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
  selector: 'app-normativa',
  standalone: true,
  imports: [
    CommonModule,
    FilePickerModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './normativa.component.html',
  styleUrl: './normativa.component.css'
})
export class NormativaComponent {
  @ViewChild('infoDiv', { static: true }) infoDiv!: ElementRef;
  years: number[] = [];

  data = {
    id: '',
    categories: [] as any[],
    temas: [] as any[],
    files: [] as string[],
    issue: '',
    image: '',
    serial: '',
    receiver: '',
    subject: '',
    entity: '',
    status: '',
  };
  
docummentSelected: NormativaInterface = {
  id: '',
  categories: [],
  temas: [],
  files: [],
  issue: '',
  image: '',
  serial: '',
  receiver: '',
  subject: '',
  entity: '',
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
  editingNormativaId: string | null = null;
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
    console.log(this.formData);
    this.data.entity = this.formData.entidadRegulatoria;
    this.data.subject = this.formData.asunto;
    this.data.receiver = this.formData.nombreReceptor;
    this.data.issue = this.formData.fechaEmision;
    this.data.serial = this.formData.serial;
    this.data.files = this._butler.uploaderImages;
    this.dataApi.saveNormativa(this.data).subscribe(
      (response) => {
        this.global.normativas.push(this.data);
        this.global.normativas=[...this.global.normativas];
        this.global.filteredNormativas=this.global.normativas;
        this.global.filteredNormativas=[...this.global.filteredNormativas];
        this.data = {
          id: '',
          categories: [],
          temas: [],
          files: [],
          issue: '',
          image: '',
          serial: '',
          receiver: '',
          subject: '',
          entity: '',
          status: ''
        };  
        // this.temas = [...this.temas];
        this._butler.uploaderImages=[];
        console.log('documento cargado con éxito:', response);
       
      },
      (error) => {
        console.error('Error al guardar la marca:', error);
      }
    );
    // Limpia el formulario después de enviarlo.
    this.formData = {};
  }

  editNormativa(normativa: NormativaInterface): void {
    this.isEditMode = true; // Set edit mode to true
    this.editingNormativaId = normativa.id; // Store the ID of the normativa being edited
    this.formData = { ...normativa }; // Populate formData with the normativa's data

    // Ensure that `repositorios` is a valid object
    if (!this.formData.repositorios) {
        this.formData.repositorios = { id: '', name: '' }; // Initialize if necessary
    }
}
  
updateNormativa(formData: NormativaInterface): void {
  if (!this.editingNormativaId) return;

  this.dataApi.updateNormativa(formData, this.editingNormativaId).subscribe(
      (response) => {
          const index = this.global.normativas.findIndex(normativa => normativa.id === this.editingNormativaId);
          if (index !== -1) {
              this.global.normativas[index] = response; // Update the normativa in the global state
              this.global.filteredNormativas = [...this.global.normativas]; // Refresh the filtered list
          }

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
  this.editingNormativaId = null;
  this.formData = {
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
deleteNormativa(normativa: NormativaInterface) {
  const documentId = normativa.id;

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
      this.dataApi.deleteNormativa(documentId).subscribe(
        response => {
          console.log('Documento eliminado:', response);
          
          // Eliminar el documento de la lista local
          this.global.normativas = this.global.normativas.filter(doc => doc.id !== documentId);
          this.global.filteredNormativas = this.global.normativas.filter(doc => doc.id !== documentId);
          
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
  this.editingNormativaId = null;
  this.isEditMode = false;
}
}
