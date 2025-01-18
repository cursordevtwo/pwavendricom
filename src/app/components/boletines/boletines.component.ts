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
interface DocumentInterface {
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
  temeOpen: string
}
@Component({
  selector: 'app-boletines',
  standalone: true,
  imports: [
    CommonModule,
    FilePickerModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './boletines.component.html',
  styleUrl: './boletines.component.css'
})
export class BoletinesComponent {
  @ViewChild('infoDiv', { static: true }) infoDiv!: ElementRef;
  years: number[] = [];

  data = {
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
    temeOpen: ''
  };
  
docummentSelected: DocumentInterface = {
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
  status: '',
  temeOpen: ''
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
  editingBoletinId: string | null = null;
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
    this.data.entity = this.formData.entidadRegulatoria;
    this.data.subject = this.formData.asunto;
    this.data.receiver = this.formData.nombreReceptor;
    this.data.issue = this.formData.fechaEmision;
    this.data.serial = this.formData.serial;
    this.data.files = this._butler.uploaderImages;
    this.dataApi.saveBoletin(this.data).subscribe(
      (response) => {
        this.global.boletines.push(this.data);
        this.global.boletines=[...this.global.boletines];
        this.global.filteredBoletines=this.global.boletines;
        this.global.filteredBoletines=[...this.global.filteredBoletines];
        this.data = {
          
          categories: [],
          temas: [],
          files: [],
          issue: '',
          image: '',
          serial: '',
          receiver: '',
          subject: '',
          entity: '',
          status: '',
          temeOpen: ''
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
  editBoletin(boletin: DocumentInterface): void {
    this.isEditMode = true; // Set edit mode to true
    this.editingBoletinId = boletin.id; // Store the ID of the modelo being edited
    this.formData = { ...boletin }; // Populate formData with the modelo's data

    // Ensure that `repositorios` is a valid object
    if (!this.formData.repositorios) {
        this.formData.repositorios = { id: '', name: '' }; // Initialize if necessary
    }
}
  
updateBoletin(formData: DocumentInterface): void {
  if (!this.editingBoletinId) return;

  this.dataApi.updateBoletin(formData, this.editingBoletinId).subscribe(
      (response) => {
          const index = this.global.boletines.findIndex(boletin => boletin.id === this.editingBoletinId);
          if (index !== -1) {
              this.global.boletines[index] = response; // Update the modelo in the global state
              this.global.filteredBoletines = [...this.global.boletines]; // Refresh the filtered list
          }

          Swal.fire('Éxito', 'El documento ha sido actualizado con éxito.', 'success');
          this.resetForm(); // Reset the form after successful update
      },
      (error) => {
          console.error('Error updating modelo:', error); // Log the error for debugging
          Swal.fire('Error', 'Ocurrió un error al actualizar el documento.', 'error');
      }
  );
}
  
  
// Reiniciar formulario
resetForm(): void {
  this.isEditMode = false;
  this.editingBoletinId = null;
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
    status: '',
    tema: '',
    year: '',
    temeOpen: ''
  };
  
}
deleteBoletin(boletin: DocumentInterface) {
  const documentId = boletin.id;

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
      this.dataApi.deleteBoletin(documentId).subscribe(
        response => {
          console.log('Documento eliminado:', response);
          
          // Eliminar el documento de la lista local
          this.global.boletines = this.global.boletines.filter(doc => doc.id !== documentId);
          this.global.filteredBoletines = this.global.boletines.filter(doc => doc.id !== documentId);
          
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
  this.editingBoletinId = null;
  this.isEditMode = false;
}
}
