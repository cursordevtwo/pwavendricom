import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalService } from '@app/services/global.service';
import { BootstrapOptions } from '@angular/core';
import Swal from 'sweetalert2';
import { DataApiService } from '@app/services/data-api-service';
declare var bootstrap: any;  // Agregar esta declaración para evitar el error de "Cannot find name 'bootstrap'"

export interface ClienteOperador {
  id: string; 
  NombreOperador: string;
  Email: string;
  Telefono: string;
  Direccion: string;
  PaginaWeb: string;
  Fax: string;
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
  imports: [CommonModule,  FormsModule, ReactiveFormsModule],
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
  formData: any = {};
  clienteForm!: FormGroup;  // Asegúrate de usar el operador `!`
  isEditing: boolean = false;
  editingClientId: string | null = null;
  clienteOperador: ClienteOperador | null = null; 
  clientesOperadores: ClienteOperador[] = [];
  filteredClientesOperadores: ClienteOperador[] = [];
  searchQuery: string = ''; // Para almacenar la consulta de búsqueda
  
  constructor (
  public globalService: GlobalService,
  public fb: FormBuilder,
  public dataApiService: DataApiService
)
{
  /* this.globalService.getClientesOperadores().subscribe(
    (data: any) => {
      this.globalService.clientesOperadores = data.items; // Si la API devuelve un objeto con 'items'
      console.log('Clientes Operadores:', this.globalService.clientesOperadores);
    },
    (error) => {
      console.error('Error al obtener clientes operadores:', error);
    }
  );
  this.clientesOperadores = this.globalService.clientesOperadores;
    this.filteredClientesOperadores = this.clientesOperadores; // Initialize with all contacts
 */
    this.globalService.getClientesOperadores().subscribe(
      (data: any) => {
          this.globalService.clientesOperadores = data.items; // Store the fetched items
          console.log('Clientes Operadores:', this.globalService.clientesOperadores);
          this.filteredClientesOperadores = this.globalService.clientesOperadores; // Initialize with fetched contacts
      },
      (error) => {
          console.error('Error al obtener clientes operadores:', error);
      }
  );
}
ngOnInit() {
  this.loadData();
  this.clienteForm = this.fb.group({
    NombreOperador: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    Direccion: ['', Validators.required],
    PaginaWeb: ['', Validators.required],
    Fax: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
  });
  this.globalService.getClientesOperadores().subscribe((data: ClienteOperador[]) => {
    this.clientesOperadores = data;
    this.filteredClientesOperadores = data; // Inicializa el filtro con todos los contactos
    console.log('Clientes Operadores:', this.clientesOperadores); // Verifica que los datos se carguen correctamente
});
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
setClienteOperador(cliente: ClienteOperador): void {
  this.clienteOperador = cliente;
}
/* applyFilters() {
  if (this.searchQuery) {
      this.filteredClientesOperadores = this.clientesOperadores.filter(contact =>
          contact.NombreOperador.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
  } else {
      this.filteredClientesOperadores = this.clientesOperadores; // Si no hay búsqueda, mostrar todos
  }
  console.log('Filtrados:', this.filteredClientesOperadores); // Verifica el resultado del filtrado
} */
  /* applyFilters() {
    console.log('Search Query:', this.searchQuery);
    console.log('All Contacts:', this.clientesOperadores);

    // Test with a known value
    const testValue = 'knownName'; // Replace 'knownName' with an actual name you expect to find
    this.filteredClientesOperadores = this.clientesOperadores.filter(contact =>
        contact.NombreOperador.toLowerCase().includes(testValue.toLowerCase())
    );

    console.log('Filtered Contacts:', this.filteredClientesOperadores);
} */

 guardarCambios() {
    const clienteOperador = this.globalService.clienteOperador; // Asegúrate de que esto no sea null
    if (!clienteOperador) {
      console.error('No se ha seleccionado ningún cliente para editar.');
      Swal.fire({
        title: 'Error',
        text: 'No se ha seleccionado un cliente para editar.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return; // Salir si clienteOperador es null
    }
  
    // Llamar al servicio para actualizar los datos del cliente
    this.dataApiService.updateContact(clienteOperador, clienteOperador.id).subscribe(
      (response) => {
        console.log('Cliente actualizado con éxito:', response);
        Swal.fire({
          title: 'Éxito!',
          text: 'Cliente actualizado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
  
        // Restablecer el formulario o salir del modo de edición si lo deseas
        this.isEditing = false; // Salir del modo de edición
      },
      (error) => {
        console.error('Error al actualizar el cliente:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al actualizar el cliente. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
  agregarNuevoCliente() {
  if (this.clienteForm.valid) {
    const clienteOperador = this.clienteForm.value;

    // Crear un objeto para enviar
    const data = {
      NombreOperador: clienteOperador.NombreOperador,
      Email: clienteOperador.Email,
      Telefono: clienteOperador.Telefono,
      Direccion: clienteOperador.Direccion,
      PaginaWeb: clienteOperador.PaginaWeb,
      Fax: clienteOperador.Fax,
    };

    // Aquí puedes llamar al servicio para guardar el cliente
    this.dataApiService.saveCliente(data).subscribe(
      (response) => {
        // Manejar la respuesta, por ejemplo, agregar el cliente a una lista
        console.log('Cliente guardado con éxito:', response);
        
        // Mostrar SweetAlert2
        Swal.fire({
          title: 'Éxito!',
          text: 'Cliente registrado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        
        // Limpiar el formulario
        this.clienteForm.reset();
      },
      (error) => {
        console.error('Error al guardar el cliente:', error);
      }
    );
  } else {
    console.error('Formulario no válido');
  }
}

resetForm() {
  this.isEditing = false;
  this.editingClientId = null;
    this.clienteOperador = {
      id: '',
      NombreOperador: '',
      Email: '', 
      Telefono: '',
      Direccion: '',
      PaginaWeb: '',
      Fax: '',
    };
}
cancelar(){}
borrarCliente() {
  const clienteOperador = this.globalService.clienteOperador;

  if (!clienteOperador) {
    console.error('No se ha seleccionado ningún cliente para borrar.');
    return; // Salir si clienteOperador es null
  }

  const contactId = clienteOperador.id; // Asegúrate de que esto sea correcto

  // Confirmar la eliminación
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás recuperar este cliente después de borrarlo!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Llamar al servicio para eliminar el cliente
      this.dataApiService.deleteClientOperator(contactId).subscribe(
        (response) => {
          console.log('Cliente borrado con éxito:', response);
          Swal.fire(
            'Borrado!',
            'El cliente ha sido borrado.',
            'success'
          );

          // Actualizar la lista de clientes
          this.loadData(); // Asumiendo que tienes un método para recargar los datos

          // Restablecer el clienteOperador en el servicio global
          this.globalService.clienteOperador = null; // o un objeto vacío si prefieres
          this.isEditing = false; // Salir del modo de edición
        },
        (error) => {
          console.error('Error al borrar el cliente:', error);
          Swal.fire(
            'Error',
            `Hubo un problema al borrar el cliente: ${error.message}`,
            'error'
          );
        }
      );
    }
  });
}
/* borrarCliente() {

  const clienteOperador = this.globalService.clienteOperador;

  if (!clienteOperador) {
    console.error('No se ha seleccionado ningún cliente para borrar.');
    return; // Salir si clienteOperador es null
  }

  const contactId = clienteOperador.id; // Asegúrate de que esto sea correcto

  // Confirmar la eliminación
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás recuperar este cliente después de borrarlo!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Llamar al servicio para eliminar el cliente
      this.dataApiService.deleteClientOperator(contactId).subscribe(
        (response) => {
          console.log('Cliente borrado con éxito:', response);
          Swal.fire(
            'Borrado!',
            'El cliente ha sido borrado.',
            'success'
          );
          // Cerrar la ventana modal
          this.isEditing = false; // Cambia el estado de edición
          this.loadData(); // Asumiendo que tienes un método para recargar los datos
        },
        (error) => {
          console.error('Error al borrar el cliente:', error);
          Swal.fire(
            'Error',
            `Hubo un problema al borrar el cliente: ${error.message}`,
            'error'
          );
        }
      );
    }
  });
} */
}
