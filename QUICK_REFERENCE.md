# Datatable - Referencia Rápida

## Uso Mínimo (simplemente mostrar datos)

```typescript
@Component({
  selector: 'app-my-table',
  standalone: true,
  imports: [DatatableComponent],
  template: `
    <app-datatable
      [data]="datos"
      [columns]="columns">
    </app-datatable>
  `
})
export class MyTableComponent {
  datos = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' }
  ];
}
```

## Configuración Completa (CRUD + Búsqueda + Paginación)

```typescript
@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [DatatableComponent, CommonModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  // Datos
  users: User[] = [];
  loading = false;
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;

  // Configuración
  columns: ColumnConfig[] = [
    { key: 'id', label: 'ID', type: 'number', sortable: true, width: '60px' },
    { key: 'email', label: 'Email', type: 'text', sortable: true },
    { key: 'role', label: 'Rol', type: 'status', sortable: true },
    { key: 'createdAt', label: 'Fecha', type: 'date', sortable: true },
    { key: 'isActive', label: 'Activo', type: 'boolean' }
  ];

  actions: ActionButton[] = [
    { label: 'Editar', icon: 'bi-pencil', action: 'edit', class: 'btn-edit' },
    { label: 'Eliminar', icon: 'bi-trash', action: 'delete', class: 'btn-delete' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.data;
        this.totalItems = res.total;
        this.loading = false;
      }
    });
  }

  onActionClicked(event: { action: string; row: User }) {
    if (event.action === 'edit') { /* Editar */ }
    if (event.action === 'delete') { /* Eliminar */ }
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  onSearchChanged(term: string) {
    this.currentPage = 1;
    // Búsqueda
  }

  onSortChanged(event: any) {
    // Ordenamiento
  }
}
```

### HTML

```html
<app-datatable
  [data]="users"
  [columns]="columns"
  [actions]="actions"
  [loading]="loading"
  [currentPage]="currentPage"
  [pageSize]="pageSize"
  [totalItems]="totalItems"
  title="Gestión de Usuarios"
  [searchEnabled]="true"
  [showPagination]="true"
  (actionClicked)="onActionClicked($event)"
  (pageChanged)="onPageChanged($event)"
  (searchChanged)="onSearchChanged($event)"
  (sortChanged)="onSortChanged($event)">
</app-datatable>
```

## Tipos de Columnas

```typescript
// Texto simple
{ key: 'name', label: 'Nombre', type: 'text', sortable: true }

// Número con 2 decimales
{ key: 'price', label: 'Precio', type: 'number' }

// Fecha formateada (01/03/2026)
{ key: 'createdAt', label: 'Fecha', type: 'date' }

// Booleano (Sí/No con iconos)
{ key: 'isActive', label: 'Activo', type: 'boolean' }

// Status badge (coloreado automáticamente)
{ key: 'status', label: 'Estado', type: 'status' }
```

## Formateadores

```typescript
// Moneda
{ 
  key: 'price', 
  label: 'Precio',
  type: 'number',
  formatter: (value) => `$${value?.toFixed(2) || '0.00'}`
}

// Porcentaje
{ 
  key: 'percentage', 
  label: '% Cambio',
  formatter: (value) => `${value?.toFixed(2)}%`
}

// Mayúscula
{ 
  key: 'crypto', 
  label: 'Cripto',
  formatter: (value) => value?.toUpperCase()
}

// Condicional
{ 
  key: 'status', 
  label: 'Estado',
  formatter: (value) => {
    if (value === 'PENDING') return '⏳ Pendiente';
    if (value === 'ACTIVE') return '✅ Activo';
    return '❌ Inactivo';
  }
}

// Con acceso a toda la fila
{
  key: 'total',
  label: 'Total',
  formatter: (value, row) => {
    const subtotal = row.quantity * row.price;
    const tax = subtotal * 0.16;
    return `$${(subtotal + tax).toFixed(2)}`;
  }
}
```

## Acciones Condicionales

```typescript
actions: ActionButton[] = [
  {
    label: 'Editar',
    icon: 'bi-pencil',
    action: 'edit',
    class: 'btn-edit',
    condition: (row) => row.status === 'PENDING'  // Solo si está pendiente
  },
  {
    label: 'Activar',
    icon: 'bi-check-circle',
    action: 'activate',
    condition: (row) => !row.isActive  // Solo si está inactivo
  },
  {
    label: 'Desactivar',
    icon: 'bi-x-circle',
    action: 'deactivate',
    condition: (row) => row.isActive  // Solo si está activo
  }
];
```

## Iconos Más Usados

```
Editar:        bi-pencil
Eliminar:      bi-trash
Ver:           bi-eye
Agregar:       bi-plus-circle
Cancelar:      bi-x-circle
Confirmar:     bi-check-circle
Descargar:     bi-download
Subir:         bi-upload
Recargar:      bi-arrow-clockwise
Búsqueda:      bi-search
Copiar:        bi-copy
Imprimir:      bi-printer
Configurar:    bi-gear
Anterior:      bi-chevron-left
Siguiente:     bi-chevron-right
Dashboard:     bi-graph-up
Órdenes:       bi-box-seam
Usuarios:      bi-people
Salir:         bi-box-arrow-right
Información:   bi-info-circle
Advertencia:   bi-exclamation-triangle
Reloj:         bi-clock
```

## Clases CSS para Botones

```typescript
actions: ActionButton[] = [
  { label: 'Editar', icon: 'bi-pencil', action: 'edit', class: 'btn-edit' },
  { label: 'Ver', icon: 'bi-eye', action: 'view', class: 'btn-view' },
  { label: 'Eliminar', icon: 'bi-trash', action: 'delete', class: 'btn-delete' },
  { label: 'Acción', icon: 'bi-gear', action: 'action', class: 'btn-action' }
];
```

### Colores Automáticos
- `btn-edit` → Azul
- `btn-view` → Verde
- `btn-delete` → Rojo
- `btn-action` → Gris

## Pasos para Crear un CRUD

### 1. Crear columnas
```typescript
columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Nombre', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'status', label: 'Estado', type: 'status' },
  { key: 'createdAt', label: 'Fecha', type: 'date' }
];
```

### 2. Crear acciones
```typescript
actions: ActionButton[] = [
  { label: 'Editar', icon: 'bi-pencil', action: 'edit' },
  { label: 'Eliminar', icon: 'bi-trash', action: 'delete' }
];
```

### 3. Manejar evento de acción
```typescript
onActionClicked(event: { action: string; row: any }) {
  if (event.action === 'edit') {
    this.editUser(event.row);
  } else if (event.action === 'delete') {
    this.deleteUser(event.row);
  }
}
```

### 4. Implementar métodos
```typescript
editUser(user: User) {
  // Abre modal o navega a página de edición
  this.modalService.open(EditUserComponent, { user });
}

deleteUser(user: User) {
  if (confirm('¿Estás seguro?')) {
    this.userService.deleteUser(user.id).subscribe(() => {
      this.loadUsers(); // Recargar tabla
    });
  }
}
```

## Propiedades Útiles

```typescript
// Cargar datos
loading: boolean = false;

// Paginación
currentPage: number = 1;
pageSize: number = 10;
totalItems: number = 0;

// Mostrar/ocultar
searchEnabled: boolean = true;
showPagination: boolean = true;
```

## Ejemplo de Servicio

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'https://api.example.com/users';

  constructor(private http: HttpClient) {}

  getUsers(page: number, pageSize: number) {
    return this.http.get(`${this.api}?page=${page}&limit=${pageSize}`);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }
}
```

---

**Recuerda:** El datatable lo maneja todo automáticamente. ¡Solo carga los datos y deja el resto! 🚀
