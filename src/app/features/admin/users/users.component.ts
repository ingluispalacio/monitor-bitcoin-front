import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { ActionButton, ColumnConfig, DatatableComponent } from '../../../shared/components/datatable/datatable.component';
import { firstValueFrom } from 'rxjs';

// Importar modales
import { UserFormModalComponent } from './components/user-form-modal/user-form-modal.component';
import { UserRole } from '../../../core/enums/user-role.enum';
import { ConfirmationData, ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    DatatableComponent,
    UserFormModalComponent,
    ConfirmationDialogComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './users.component.html',
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  // Control de modales
  showUserModal = false;
  showConfirmation = false;
  modalData: { user?: User } = {};
  confirmationData: ConfirmationData & { onConfirm?: () => void } = {
    title: '',
    message: '',
    type: 'info'
  };
  pendingAction: { type: string; user: User } | null = null;

  // Configuración de columnas para la tabla
  columns: ColumnConfig[] = [
    {
      key: 'fullName',
      label: 'Nombre Completo',
      type: 'text',
      sortable: true
    },
    {
      key: 'username',
      label: 'Usuario',
      type: 'text',
      sortable: true,
      width: '150px'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      sortable: true,
      width: '200px'
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'status',
      sortable: true,
      width: '100px',
      formatter: (value: string) => value === 'ADMIN' ? 'Administrador' : 'Cliente'
    },
    {
      key: 'createdAt',
      label: 'Registro',
      type: 'date',
      sortable: true,
      width: '120px'
    },
    {
      key: 'isActive',
      label: 'Activo',
      type: 'boolean',
      width: '80px',
      formatter: (value: boolean) => value ? 'Sí' : 'No'
    }
  ];

  // Configuración de acciones
  actions: ActionButton[] = [
    // {
    //   label: 'Editar',
    //   icon: 'bi-pencil',
    //   action: 'edit',
    //   class: 'text-blue-600 hover:text-blue-800'
    // },
    {
      label: 'Eliminar',
      icon: 'bi-trash',
      action: 'delete',
      class: 'text-red-600 hover:text-red-800'
    },
    // {
    //   label: 'Cambiar Rol',
    //   icon: 'bi-arrow-repeat',
    //   action: 'change-role',
    //   class: 'text-green-600 hover:text-green-800'
    // },
    // {
    //   label: 'Desactivar',
    //   icon: 'bi-x-circle',
    //   action: 'deactivate',
    //   class: 'text-orange-600 hover:text-orange-800',
    //   condition: (row: User) => row.active === true
    // },
    // {
    //   label: 'Activar',
    //   icon: 'bi-check-circle',
    //   action: 'activate',
    //   class: 'text-green-600 hover:text-green-800',
    //   condition: (row: User) => row.active === false
    // }
  ];

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Carga la lista de usuarios del servidor
   */
  async loadUsers(): Promise<void> {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.userService.getAllUsers());

      let rawData: any[] = [];
      
      if (Array.isArray(response)) {
        rawData = response;
      } else if (response && Array.isArray(response.data)) {
        rawData = response.data;
      }

      this.users = rawData.map(u => ({
        ...u,
        fullName: `${u.name || ''} ${u.lastname || ''}`.trim() || u.username || 'Sin nombre',
        isActive: u.isActive ?? u.active ?? true
      }));

      this.totalItems = this.users.length;
      this.toastr.success('Usuarios cargados correctamente');
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      this.toastr.error('Error al cargar los usuarios');
    } finally {
      this.loading = false;
    }
  }

  /**
   * Maneja los clics en los botones de acción
   */
  onActionClicked(event: { action: string; row: User }): void {
    switch (event.action) {
      case 'edit':
        this.editUser(event.row);
        break;
      case 'delete':
        this.confirmDeleteUser(event.row);
        break;
      case 'change-role':
        this.confirmChangeRole(event.row);
        break;
      case 'deactivate':
        this.confirmDeactivateUser(event.row);
        break;
      case 'activate':
        this.confirmActivateUser(event.row);
        break;
    }
  }

  /**
   * Abre modal para crear nuevo usuario
   */
  openCreateModal(): void {
    this.modalData = {};
    this.showUserModal = true; // Debe ser true
  }

  /**
   * Abre modal para editar usuario
   */
  editUser(user: User): void {
    this.modalData = { user };
    this.showUserModal = true;
  }

  /**
   * Maneja el cierre del modal de usuario
   */
  onUserModalClosed(): void {
    this.showUserModal = false;
    this.modalData = {};
  }

  /**
   * Maneja el envío del modal de usuario
   */
  onUserModalSubmitted(userData: User): void {
    this.showUserModal = false;
    console.log('Datos recibidos del modal:', userData);
    if (this.modalData.user) {
      // Editar
      this.userService.updateUser(this.modalData.user.id, userData).subscribe({
        next: () => {
          this.toastr.success('Usuario actualizado correctamente');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error actualizando usuario:', error);
          this.toastr.error('Error al actualizar el usuario');
        }
      });
    } else {
      // Crear

      this.userService.createUser(userData).subscribe({
        next: () => {
          this.toastr.success('Usuario creado correctamente');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error creando usuario:', error);
          this.toastr.error('Error al crear el usuario');
        }
      });
    }
    
    this.modalData = {};
  }

  /**
   * Confirmar eliminación de usuario
   */
  confirmDeleteUser(user: User): void {
    this.pendingAction = { type: 'delete', user };
    this.confirmationData = {
      title: 'Eliminar Usuario',
      message: `¿Estás seguro?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    };
    this.showConfirmation = true;// Debe ser true
  }

  /**
   * Confirmar cambio de rol
   */
  confirmChangeRole(user: User): void {
    const newRole: UserRole = user.role ;
    const roleText = newRole === 'ADMIN' ? 'Administrador' : 'Cliente';
    
    this.pendingAction = { type: 'change-role', user };
    this.confirmationData = {
      title: 'Cambiar Rol',
      message: `¿Cambiar el rol de "${user.name} ${user.lastname}" a ${roleText}?`,
      confirmText: 'Cambiar',
      cancelText: 'Cancelar',
      type: 'info'
    };
    this.showConfirmation = true;
  }

  /**
   * Confirmar desactivación de usuario
   */
  confirmDeactivateUser(user: User): void {
    this.pendingAction = { type: 'deactivate', user };
    this.confirmationData = {
      title: 'Desactivar Usuario',
      message: `¿Desactivar a "${user.name} ${user.lastname}"? El usuario no podrá iniciar sesión.`,
      confirmText: 'Desactivar',
      cancelText: 'Cancelar',
      type: 'warning'
    };
    this.showConfirmation = true;
  }

  /**
   * Confirmar activación de usuario
   */
  confirmActivateUser(user: User): void {
    this.pendingAction = { type: 'activate', user };
    this.confirmationData = {
      title: 'Activar Usuario',
      message: `¿Activar a "${user.name} ${user.lastname}"? El usuario podrá iniciar sesión nuevamente.`,
      confirmText: 'Activar',
      cancelText: 'Cancelar',
      type: 'success'
    };
    this.showConfirmation = true;
  }

  /**
   * Maneja el resultado de la confirmación
   */
  onConfirmationResult(result: boolean): void {
    this.showConfirmation = false;
    
    if (result && this.pendingAction) {
      const { type, user } = this.pendingAction;
      
      switch (type) {
        case 'delete':
          this.executeDelete(user);
          break;
        case 'change-role':
          this.executeChangeRole(user);
          break;
        // case 'deactivate':
        //   this.executeDeactivate(user);
        //   break;
        // case 'activate':
        //   this.executeActivate(user);
        //   break;
      }
    }
    
    this.pendingAction = null;
  }

  /**
   * Ejecuta eliminación de usuario
   */
  private executeDelete(user: User): void {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastr.success('Usuario eliminado correctamente');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error eliminando usuario:', error);
        this.toastr.error('Error al eliminar el usuario');
      }
    });
  }

  /**
   * Ejecuta cambio de rol
   */
  private executeChangeRole(user: User): void {
    const roleText = user.role === 'ADMIN' ? 'Administrador' : 'Cliente';
    
    this.userService.updateUser(user.id, user).subscribe({
      next: () => {
        this.toastr.success(`Rol cambiado a ${roleText}`);
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error cambiando rol:', error);
        this.toastr.error('Error al cambiar el rol');
      }
    });
  }

  /**
   * Ejecuta desactivación de usuario
   */
  // private executeDeactivate(user: User): void {
  //   this.userService.updateUser(user.id, { isActive: false }).subscribe({
  //     next: () => {
  //       this.toastr.warning('Usuario desactivado');
  //       this.loadUsers();
  //     },
  //     error: (error) => {
  //       console.error('Error desactivando usuario:', error);
  //       this.toastr.error('Error al desactivar el usuario');
  //     }
  //   });
  // }

  /**
   * Ejecuta activación de usuario
   */
  // private executeActivate(user: User): void {
  //   this.userService.updateUser(user.id, { isActive: true }).subscribe({
  //     next: () => {
  //       this.toastr.success('Usuario activado');
  //       this.loadUsers();
  //     },
  //     error: (error: any) => {
  //       console.error('Error activando usuario:', error);
  //       this.toastr.error('Error al activar el usuario');
  //     }
  //   });
  // }

  /**
   * Cambia de página en la paginación
   */
  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  /**
   * Maneja cambios en la búsqueda
   */
  onSearchChanged(term: string): void {
    this.currentPage = 1;
    console.log('Buscando:', term);
    // Implementar búsqueda
  }

  /**
   * Maneja cambios en el ordenamiento
   */
  onSortChanged(event: { column: string; direction: 'asc' | 'desc' }): void {
    console.log('Ordenando por:', event.column, '- Dirección:', event.direction);
    // Implementar ordenamiento
  }
}