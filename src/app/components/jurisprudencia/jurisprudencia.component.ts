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
import { DataApiService, JurisprudenciaInterface } from '@app/services/data-api-service';
import Swal from 'sweetalert2';

interface jurisprudencia {
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
  status: string;}

@Component({
  selector: 'app-jurisprudencia',
  standalone: true,
  imports: [
    CommonModule,
    FilePickerModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './jurisprudencia.component.html',
  styleUrl: './jurisprudencia.component.css'
})
export class JurisprudenciaComponent {
  @ViewChild('infoDiv', { static: true }) infoDiv!: ElementRef;
  years: number[] = [];
  isEditMode: boolean = false;
  editingJurisprudenciaId: string = '';
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
  };
  
docummentSelected: JurisprudenciaInterface = {
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
  jurisprudencias: jurisprudencia[] = [];
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
    this.loadJurisprudencias();
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
  loadJurisprudencias() {
    this.global.getJurisprudencias().subscribe((jurisprudencias: jurisprudencia[]) => {
        this.global.jurisprudencias = jurisprudencias;
        this.global.filteredJurisprudencias = jurisprudencias; // Asegúrate de inicializar la lista filtrada
    }, error => {
        console.error('Error al cargar las jurisprudencias:', error);
    });
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
    this.dataApi.saveJurisprudencia(this.data).subscribe(
      (response) => {
        this.global.jurisprudencias.push(this.data);
        this.global.jurisprudencias=[...this.global.jurisprudencias];
        this.global.filteredJurisprudencias=this.global.jurisprudencias;
        this.global.filteredJurisprudencias=[...this.global.filteredJurisprudencias];
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
          status: ''
        };  
        // this.temas = [...this.temas];
        this._butler.uploaderImages=[];
        console.log('Jurisprudencia cargada con éxito:', response);
      },
      (error) => {
        console.error('Error al guardar la marca:', error);
      }
    );
    // Limpia el formulario después de enviarlo.
    this.formData = {};
  }
    
      /* submitForm() {
        if (this.isEditMode) {
            this.updateJurisprudencia(this.formData); // Llama al método de actualización
        } else {
            this.dataApi.saveJurisprudencia(this.formData).subscribe(response => {
                console.log('Jurisprudencia guardada:', response);
                this.loadJurisprudencias(); // Carga las jurisprudencias actualizadas
                this.resetForm(); // Reinicia el formulario
            }, error => {
                console.error('Error al guardar el jurisprudencia:', error);
            });
        }
    } */
    editJurisprudencia(jurisprudencia: jurisprudencia): void {
    this.editingJurisprudenciaId = jurisprudencia.id; // Establece el ID del documento que se va a editar
    this.formData = { ...jurisprudencia }; // Carga los datos del documento en el formulario
    this.isEditMode = true; // Cambia a modo de edición
}
 
// Actualizar documento

/* updateJurisprudencia(jurisprudencia: jurisprudencia): void {
  this.editingJurisprudenciaId = jurisprudencia.id;
  this.formData = { ...jurisprudencia };

  // Aquí va la lógica para actualizar la jurisprudencia
  this.dataApi.updateJurisprudencia(this.formData, this.editingJurisprudenciaId).subscribe(
      (response) => {
          const index = this.global.jurisprudencias.findIndex(doc => doc.id === this.editingJurisprudenciaId);
          if (index !== -1) {
              this.global.jurisprudencias[index] = response;
              this.global.filteredJurisprudencias = [...this.global.jurisprudencias];
          }
          Swal.fire('Éxito', 'El documento ha sido actualizado con éxito.', 'success');
      },
      (error) => {
          Swal.fire('Error', 'Ocurrió un error al actualizar el documento.', 'error');
      }
  );
} */
  updateJurisprudencia(jurisprudencia: jurisprudencia): void {
    if (!this.editingJurisprudenciaId) return; // Asegúrate de que estás en modo de edición

    this.dataApi.updateJurisprudencia(this.formData, this.editingJurisprudenciaId).subscribe(
        (response) => {
            const index = this.global.jurisprudencias.findIndex(doc => doc.id === this.editingJurisprudenciaId);
            if (index !== -1) {
                this.global.jurisprudencias[index] = response; // Actualiza el documento existente
                this.global.filteredJurisprudencias = [...this.global.jurisprudencias]; // Actualiza la lista filtrada
            }

            Swal.fire('Éxito', 'El documento ha sido actualizado con éxito.', 'success');
            this.resetForm(); // Reinicia el formulario después de la actualización
        },
        (error) => {
            Swal.fire('Error', 'Ocurrió un error al actualizar el documento.', 'error');
        }
    );
}
  
// Reiniciar formulario
resetForm(): void {
  this.isEditMode = false;
  this.editingJurisprudenciaId = '';
  this.formData = {
    repositorios: { id: '', name: '' }
  };
}

/* deleteJurisprudencia(document: any) {
  const jurisprudenciaId = document.id;

  if (!jurisprudenciaId) {
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
          this.dataApi.deleteJurisprudencia(jurisprudenciaId).subscribe(
              response => {
                  console.log('Documento eliminado:', response);
                  this.global.jurisprudencias = this.global.filteredJurisprudencias.filter((jurisprudencia: jurisprudencia) => jurisprudencia.id !== jurisprudenciaId);
                  Swal.fire('Borrado!', 'El documento ha sido eliminado.', 'success');
                  
                  // Llama al método para cargar jurisprudencias actualizadas
                  this.loadJurisprudencias(); // Carga las jurisprudencias actualizadas
                },
              error => {
                  Swal.fire('Error', 'Ocurrió un error al eliminar el documento. Inténtelo de nuevo más tarde.', 'error');
                  console.error('Error al borrar el documento:', error);
              }
          );
      }
  });
} */
  /* deleteJurisprudencia(id: string): void {
    this.dataApi.deleteJurisprudencia(id).subscribe(
        response => {
            // Eliminar el documento de la lista local
            this.global.jurisprudencias = this.global.jurisprudencias.filter(doc => doc.id !== id);
            this.global.filteredJurisprudencias = [...this.global.jurisprudencias]; // Actualiza la lista filtrada
            Swal.fire('Borrado!', 'El documento ha sido eliminado.', 'success');
        },
        error => {
            Swal.fire('Error', 'Ocurrió un error al eliminar el documento. Inténtelo de nuevo más tarde.', 'error');
            console.error('Error al borrar el documento:', error);
        }
    );
    
} */
    deleteJurisprudencia(id: string): void {
      // Primero, muestra el cuadro de confirmación
      Swal.fire({
          title: '¿Estás seguro?',
          text: '¡Esta acción no se podrá revertir!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, borrar!',
          cancelButtonText: 'No, cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              // Si el usuario confirma, procede a eliminar
              this.dataApi.deleteJurisprudencia(id).subscribe(
                  response => {
                      // Eliminar el documento de la lista local
                      this.global.jurisprudencias = this.global.jurisprudencias.filter(doc => doc.id !== id);
                      this.global.filteredJurisprudencias = [...this.global.jurisprudencias]; // Actualiza la lista filtrada
                      Swal.fire('Borrado!', 'El documento ha sido eliminado.', 'success');
                  },
                  error => {
                      Swal.fire('Error', 'Ocurrió un error al eliminar el documento. Inténtelo de nuevo más tarde.', 'error');
                      console.error('Error al borrar el documento:', error);
                  }
              );
          }
      });
  }
cancelDelete(){}
}

