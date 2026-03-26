## Componente Datatable Reutilizable

El componente datatable es un componente flexible y reutilizable diseñado para mostrar datos tabulares en toda la aplicación. Incluye búsqueda, ordenamiento, paginación y acciones personalizables.

### Características

- ✅ Búsqueda en tiempo real
- ✅ Ordenamiento de columnas
- ✅ Paginación
- ✅ Estados de carga
- ✅ Acciones personalizables
- ✅ Formatos condicionales (status badges, booleanos, etc.)
- ✅ Iconos de Bootstrap Icons
- ✅ Totalmente responsive
- ✅ TypeScript tipado

### Instalación/Importación

En el componente donde desees usar el datatable:

```typescript
import { DatatableComponent, ColumnConfig, ActionButton } from '@shared/components/datatable/datatable.component';

@Component({
  selector: 'app-users',
  imports: [DatatableComponent, CommonModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  // ...
}
```

### Configuración de Columnas

Define las columnas con la interfaz `ColumnConfig`:

```typescript
columns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'number',
    sortable: true,
    width: '80px'
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    sortable: true
  },
  {
    key: 'role',
    label: 'Rol',
    type: 'status',
    sortable: true
  },
  {
    key: 'createdAt',
    label: 'Fecha Creación',
    type: 'date',
    sortable: true
  },
  {
    key: 'isActive',
    label: 'Activo',
    type: 'boolean'
  },
  {
    key: 'balance',
    label: 'Balance',
    type: 'number',
    formatter: (value) => `$${value?.toFixed(2) || '0.00'}`
  }
];
```

### Tipos de Columnas Soportados

- `text` - Texto simple
- `number` - Números con 2 decimales por defecto
- `date` - Fechas formateadas automáticamente
- `boolean` - Sí/No con iconos
- `status` - Badges de estado coloreados

### Configuración de Acciones

Define los botones de acción con la interfaz `ActionButton`:

```typescript
actions: ActionButton[] = [
  {
    label: 'Editar',
    icon: 'bi-pencil',
    action: 'edit',
    class: 'btn-edit'
  },
  {
    label: 'Eliminar',
    icon: 'bi-trash',
    action: 'delete',
    class: 'btn-delete'
  },
  {
    label: 'Ver Detalles',
    icon: 'bi-eye',
    action: 'view',
    class: 'btn-view'
  },
  {
    label: 'Desactivar',
    icon: 'bi-x-circle',
    action: 'deactivate',
    class: 'btn-delete',
    condition: (row) => row.isActive // Solo mostrar si está activo
  }
];
```

### Ejemplo de Uso Completo - Módulo de Usuarios

#### users.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatableComponent, ColumnConfig, ActionButton } from '@shared/components/datatable/datatable.component';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, DatatableComponent],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading: boolean = false;
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  columns: ColumnConfig[] = [
    {
      key: 'id',
      label: 'ID',
      type: 'number',
      sortable: true,
      width: '60px'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      sortable: true
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'status',
      sortable: true,
      width: '100px'
    },
    {
      key: 'createdAt',
      label: 'Fecha Creación',
      type: 'date',
      sortable: true
    },
    {
      key: 'isActive',
      label: 'Activo',
      type: 'boolean',
      width: '80px'
    }
  ];

  actions: ActionButton[] = [
    {
      label: 'Editar',
      icon: 'bi-pencil',
      action: 'edit',
      class: 'btn-edit'
    },
    {
      label: 'Eliminar',
      icon: 'bi-trash',
      action: 'delete',
      class: 'btn-delete'
    }
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.users = response.data;
          this.totalItems = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
        }
      });
  }

  onActionClicked(event: { action: string; row: any }): void {
    switch (event.action) {
      case 'edit':
        this.editUser(event.row);
        break;
      case 'delete':
        this.deleteUser(event.row);
        break;
    }
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onSearchChanged(term: string): void {
    this.currentPage = 1;
    // Implementar búsqueda si es necesario
  }

  onSortChanged(event: { column: string; direction: 'asc' | 'desc' }): void {
    // Implementar ordenamiento en el servidor
    console.log('Sort:', event);
  }

  editUser(user: any): void {
    // Implementar edición
    console.log('Edit user:', user);
  }

  deleteUser(user: any): void {
    // Implementar eliminación
    console.log('Delete user:', user);
  }
}
```

#### users.component.html

```html
<app-datatable
  [data]="users"
  [columns]="columns"
  [actions]="actions"
  [loading]="loading"
  [currentPage]="currentPage"
  [pageSize]="pageSize"
  [totalItems]="totalItems"
  [title]="'Gestión de Usuarios'"
  [searchEnabled]="true"
  [showPagination]="true"
  (actionClicked)="onActionClicked($event)"
  (pageChanged)="onPageChanged($event)"
  (searchChanged)="onSearchChanged($event)"
  (sortChanged)="onSortChanged($event)">
</app-datatable>
```

### Ejemplo para Órdenes

```typescript
columns: ColumnConfig[] = [
  { key: 'id', label: 'ID Orden', type: 'number', sortable: true, width: '100px' },
  { key: 'userId', label: 'Usuario', type: 'number', sortable: true },
  { key: 'cryptoSymbol', label: 'Criptomoneda', type: 'text', sortable: true },
  { key: 'quantity', label: 'Cantidad', type: 'number', sortable: true },
  { key: 'price', label: 'Precio', type: 'number', formatter: (v) => `$${v?.toFixed(2)}` },
  { key: 'status', label: 'Estado', type: 'status', sortable: true },
  { key: 'createdAt', label: 'Fecha', type: 'date', sortable: true }
];

actions: ActionButton[] = [
  { label: 'Ver', icon: 'bi-eye', action: 'view', class: 'btn-view' },
  { label: 'Editar', icon: 'bi-pencil', action: 'edit', class: 'btn-edit', 
    condition: (row) => row.status === 'PENDING' },
  { label: 'Cancelar', icon: 'bi-x-circle', action: 'cancel', class: 'btn-delete',
    condition: (row) => row.status !== 'COMPLETED' && row.status !== 'CANCELLED' }
];
```

### Propiedades de Entrada (@Input)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `data` | `any[]` | Datos a mostrar en la tabla |
| `columns` | `ColumnConfig[]` | Configuración de columnas |
| `actions` | `ActionButton[]` | Botones de acción disponibles |
| `loading` | `boolean` | Estado de carga |
| `pageSize` | `number` | Cantidad de filas por página (default: 10) |
| `currentPage` | `number` | Página actual |
| `totalItems` | `number` | Total de items (para paginación del servidor) |
| `showPagination` | `boolean` | Mostrar controles de paginación |
| `searchEnabled` | `boolean` | Habilitar búsqueda |
| `title` | `string` | Título de la tabla |

### Eventos de Salida (@Output)

| Evento | Descripción |
|--------|-------------|
| `actionClicked` | Emite `{ action: string; row: any }` cuando se hace clic en un botón |
| `pageChanged` | Emite el número de página cuando cambia |
| `searchChanged` | Emite el término de búsqueda |
| `sortChanged` | Emite `{ column: string; direction: 'asc' \| 'desc' }` |

### Iconos de Bootstrap Disponibles

Algunos iconos útiles para acciones:
- `bi-pencil` - Editar
- `bi-trash` - Eliminar
- `bi-eye` - Ver
- `bi-plus-circle` - Agregar
- `bi-arrow-clockwise` - Actualizar
- `bi-check-circle` - Confirmar
- `bi-x-circle` - Cancelar
- `bi-download` - Descargar
- `bi-printer` - Imprimir
- `bi-copy` - Copiar

Lista completa: https://icons.getbootstrap.com/

### Colores de Status Badges

Los badges de estado automáticamente aplican colores según el valor:
- `pending` - Amarillo
- `active` - Verde
- `inactive` - Rojo
- `completed` - Verde oscuro
- `cancelled` - Gris

### Casos de Uso

1. **Listado de Usuarios** - Mostrar todos los usuarios con opción de editar/eliminar
2. **Gestión de Órdenes** - Mostrar órdenes con filtrado y acciones
3. **Reportes** - Mostrar datos históricos con búsqueda
4. **Auditoría** - Mostrar logs con timestamp y estado
5. **Gestión de Criptos** - Mostrar precios con historial

---

**Nota**: El componente es totalmente responsive y se adapta automáticamente a pantallas móviles.
