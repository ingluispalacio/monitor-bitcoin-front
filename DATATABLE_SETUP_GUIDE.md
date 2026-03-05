# Guía de Integración: Bootstrap Icons y Datatable Reutilizable

## ¿Qué se ha implementado?

1. **Bootstrap Icons en el Admin Layout** - Reemplazo de emojis con iconos profesionales de Bootstrap Icons
2. **Componente Datatable Reutilizable** - Un componente flexible para mostrar datos en tabla en todos los CRUD

## Instalación

### 1. Bootstrap Icons (ya instalado ✅)

Bootstrap Icons ya está instalado en tu `package.json`:

```json
"dependencies": {
  "bootstrap-icons": "^1.13.1"
}
```

No necesitas hacer nada adicional.

### 2. Componente Datatable

El componente datatable ya está créado en:
```
src/app/shared/components/datatable/
├── datatable.component.ts
├── datatable.component.html
├── datatable.component.css
└── README.md
```

## Cómo Usar el Datatable

### Paso 1: Importar en tu componente

```typescript
import { DatatableComponent, ColumnConfig, ActionButton } from '@shared/components/datatable/datatable.component';

@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [CommonModule, DatatableComponent],  // ← Agregar DatatableComponent
  templateUrl: './my-feature.component.html'
})
export class MyFeatureComponent { }
```

### Paso 2: Configurar columnas

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
    key: 'name',
    label: 'Nombre',
    type: 'text',
    sortable: true
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    sortable: true
  },
  {
    key: 'createdAt',
    label: 'Fecha',
    type: 'date',
    sortable: true
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'status',
    sortable: true
  }
];
```

### Paso 3: Configurar acciones

```typescript
actions: ActionButton[] = [
  {
    label: 'Editar',
    icon: 'bi-pencil',           // ← Ver lista de iconos abajo
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
    label: 'Ver',
    icon: 'bi-eye',
    action: 'view',
    class: 'btn-view',
    condition: (row) => row.isActive  // ← Mostrar solo si cumple la condición
  }
];
```

### Paso 4: Usar en el HTML

```html
<app-datatable
  [data]="datos"
  [columns]="columns"
  [actions]="actions"
  [loading]="loading"
  [currentPage]="currentPage"
  [pageSize]="pageSize"
  [totalItems]="totalItems"
  [title]="'Mi Tabla'"
  [searchEnabled]="true"
  [showPagination]="true"
  (actionClicked)="onActionClicked($event)"
  (pageChanged)="onPageChanged($event)"
  (searchChanged)="onSearchChanged($event)"
  (sortChanged)="onSortChanged($event)">
</app-datatable>
```

### Paso 5: Manejar eventos

```typescript
onActionClicked(event: { action: string; row: any }): void {
  if (event.action === 'edit') {
    // Editar registro
  } else if (event.action === 'delete') {
    // Eliminar registro
  }
}

onPageChanged(page: number): void {
  this.currentPage = page;
  this.loadData();
}
```

## Iconos de Bootstrap Disponibles

### Acciones Comunes
- `bi-pencil` - Editar
- `bi-trash` - Eliminar
- `bi-eye` - Ver
- `bi-plus-circle` - Agregar
- `bi-x-circle` - Cancelar
- `bi-check-circle` - Confirmar
- `bi-gear` - Configuración
- `bi-download` - Descargar
- `bi-upload` - Subir
- `bi-arrow-clockwise` - Recargar
- `bi-search` - Buscar
- `bi-copy` - Copiar
- `bi-printer` - Imprimir

### Navegación
- `bi-chevron-left` - Anterior
- `bi-chevron-right` - Siguiente
- `bi-chevron-up` - Arriba
- `bi-chevron-down` - Abajo
- `bi-home` - Inicio
- `bi-house` - Casa

### Status/Estados
- `bi-check` - Completado
- `bi-x` - Error
- `bi-exclamation-triangle` - Advertencia
- `bi-info-circle` - Información
- `bi-clock` - Pendiente

### Otros Útiles
- `bi-graph-up` - Dashboard
- `bi-box-seam` - Órdenes
- `bi-people` - Usuarios
- `bi-toggles2` - Configuración
- `bi-box-arrow-right` - Cerrar sesión

### Lista Completa
Visita: https://icons.getbootstrap.com/

## Tipos de Columnas Soportados

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `text` | Texto simple | Nombres, emails |
| `number` | Números con 2 decimales | Precios, cantidades |
| `date` | Fechas formateadas | 01/03/2026 |
| `boolean` | Sí/No con iconos | Activo/Inactivo |
| `status` | Badges coloreados | PENDING, ACTIVE |

## Formateadores Personalizados

Puedes formatear valores custom con la propiedad `formatter`:

```typescript
columns: ColumnConfig[] = [
  {
    key: 'price',
    label: 'Precio',
    type: 'number',
    formatter: (value) => `$${value?.toFixed(2) || '0.00'}`
  },
  {
    key: 'balance',
    label: 'Balance',
    type: 'number',
    formatter: (value) => {
      if (value > 1000) return `$${(value / 1000).toFixed(1)}K`;
      return `$${value}`;
    }
  },
  {
    key: 'crypto',
    label: 'Criptomoneda',
    type: 'text',
    formatter: (value) => value?.toUpperCase()
  }
];
```

## Cambios Realizados

### 1. Admin Layout Actualizado
📍 `src/app/layout/admin-layout/admin-layout.component.html`

**Nuevos Iconos Agregados:**
- Dashboard: `bi-graph-up`
- Órdenes: `bi-box-seam`
- Usuarios: `bi-people`
- Control de Compras: `bi-toggles2`
- Cerrar Sesión: `bi-box-arrow-right`

### 2. Nuevos Archivos Creados

```
src/app/shared/components/datatable/
├── datatable.component.ts          (Lógica del componente)
├── datatable.component.html        (Template)
├── datatable.component.css         (Estilos)
└── README.md                        (Documentación)
```

### 3. Ejemplos de Implementación

```
src/app/features/admin/
├── users/users.component.example.ts       (Ejemplo para Users)
├── users/users.component.example.html
├── orders/orders.component.example.ts     (Ejemplo para Orders)
└── orders/orders.component.example.html
```

## Características del Datatable

✅ **Búsqueda en tiempo real** - Filtra datos mientras escribes
✅ **Ordenamiento** - Haz clic en encabezados para ordenar
✅ **Paginación** - Navega entre páginas
✅ **Estados de carga** - Spinner mientras carga datos
✅ **Acciones personalizables** - Agregar cualquier botón
✅ **Condiciones** - Mostrar botones solo cuando cumplen condiciones
✅ **Formatos automáticos** - Fechas, números, booleanos
✅ **Formatos personalizados** - Función custom formatter
✅ **Responsive** - Se adapta a móviles y tablets
✅ **Iconos de Bootstrap** - Todos los iconos disponibles

## Ejemplo Rápido Completo

```typescript
// component.ts
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [DatatableComponent, CommonModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  products = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 45000, status: 'ACTIVE' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 2500, status: 'ACTIVE' }
  ];

  columns: ColumnConfig[] = [
    { key: 'id', label: 'ID', type: 'number', sortable: true },
    { key: 'name', label: 'Nombre', type: 'text', sortable: true },
    { key: 'symbol', label: 'Símbolo', type: 'text' },
    { key: 'price', label: 'Precio', type: 'number', 
      formatter: (v) => `$${v?.toFixed(2)}` },
    { key: 'status', label: 'Estado', type: 'status' }
  ];

  actions: ActionButton[] = [
    { label: 'Editar', icon: 'bi-pencil', action: 'edit', class: 'btn-edit' },
    { label: 'Eliminar', icon: 'bi-trash', action: 'delete', class: 'btn-delete' }
  ];

  onActionClicked(event: any) {
    if (event.action === 'edit') {
      console.log('Editando:', event.row);
    }
  }
}
```

```html
<!-- component.html -->
<app-datatable
  [data]="products"
  [columns]="columns"
  [actions]="actions"
  title="Productos"
  (actionClicked)="onActionClicked($event)">
</app-datatable>
```

## Próximos Pasos

### 1. Integrar en tus componentes
Reemplaza los componentes de users, orders y features con la implementación del datatable.

### 2. Personalizar estilos
Puedes modificar `datatable.component.css` para cambiar colores, bordes, etc.

### 3. Agregar más funcionalidades
- Exportar a CSV
- Imprimir tabla
- Búsqueda avanzada
- Filtros personalizados

## Soporte

Si necesitas ayuda:
1. Revisa el archivo `README.md` en la carpeta del datatable
2. Consulta los archivos `.example.ts` y `.example.html`
3. Experimenta con diferentes configuraciones de columnas y acciones

## Notas Importantes

- El datatable usa **Tailwind CSS**, asegúrate que esté correctamente configurado
- Los iconos se cargan desde CDN de Bootstrap Icons
- El componente es **standalone**, úsalo directamente sin módulos
- Compatible con **Angular 19+**

---

**¡Listo para usar!** 🚀 El datatable está completamente funcional y listo para ser integrado en todos tus CRUD.
