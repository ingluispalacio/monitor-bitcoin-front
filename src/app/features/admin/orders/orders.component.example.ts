import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButton, ColumnConfig, DatatableComponent } from '../../../shared/components/datatable/datatable.component';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatatableComponent],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = false;
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  // Configuración de columnas
  columns: ColumnConfig[] = [
    {
      key: 'id',
      label: 'ID Orden',
      type: 'number',
      sortable: true,
      width: '80px'
    },
    {
      key: 'userId',
      label: 'Usuario',
      type: 'number',
      sortable: true,
      width: '80px'
    },
    {
      key: 'cryptoSymbol',
      label: 'Criptomoneda',
      type: 'text',
      sortable: true,
      width: '120px',
      formatter: (value: string) => value?.toUpperCase() || '-'
    },
    {
      key: 'quantity',
      label: 'Cantidad',
      type: 'number',
      sortable: true,
      width: '100px',
      formatter: (value: number) => value?.toFixed(8) || '0'
    },
    {
      key: 'price',
      label: 'Precio',
      type: 'number',
      sortable: true,
      width: '100px',
      formatter: (value: number) => `$${value?.toFixed(2) || '0.00'}`
    },
    {
      key: 'totalAmount',
      label: 'Monto Total',
      type: 'number',
      sortable: true,
      width: '120px',
      formatter: (value: number) => `$${value?.toFixed(2) || '0.00'}`
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'status',
      sortable: true,
      width: '100px'
    },
    {
      key: 'createdAt',
      label: 'Fecha Creación',
      type: 'date',
      sortable: true,
      width: '120px'
    }
  ];

  // Configuración de acciones
  actions: ActionButton[] = [
    {
      label: 'Ver Detalles',
      icon: 'bi-eye',
      action: 'view',
      class: 'btn-view'
    },
    {
      label: 'Editar',
      icon: 'bi-pencil',
      action: 'edit',
      class: 'btn-edit',
      condition: (row: Order) => row.status === 'PENDING' // Solo editar órdenes pendientes
    },
    {
      label: 'Cancelar',
      icon: 'bi-x-circle',
      action: 'cancel',
      class: 'btn-delete',
      condition: (row: Order) => row.status !== 'COMPLETED' && row.status !== 'CANCELLED'
    },
    {
      label: 'Completada',
      icon: 'bi-check-circle',
      action: 'complete',
      class: 'btn-view',
      condition: (row: Order) => row.status === 'PENDING'
    }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Carga la lista de órdenes del servidor
   */
//   loadOrders(): void {
//     this.loading = true;
//     // this.orderService.getOrders(this.currentPage, this.pageSize).subscribe({
//     this.orderService.getAllOrders().subscribe({
//       next: (response) => {
//         this.orders = response.data;
//         this.totalItems = response.total;
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error cargando órdenes:', error);
//         this.loading = false;
//       }
//     });
//   }

  async loadOrders(): Promise<void> {
      this.loading = true;
      try {
        // Convertimos el observable a promesa usando firstValueFrom
        const response = await firstValueFrom(this.orderService.getAllOrders());
        
        this.orders = response;
        // Corregido: .length es una propiedad, no una función ()
        this.totalItems = response.length; 
      } catch (error) {
        console.error('Error cargando usuarios:', error);
        // Aquí podrías disparar una alerta a tu dashboard de Elasticsearch
      } finally {
        this.loading = false;
      }
    }

  /**
   * Maneja los clics en los botones de acción
   */
  onActionClicked(event: { action: string; row: Order }): void {
    switch (event.action) {
      case 'view':
        this.viewOrderDetails(event.row);
        break;
      case 'edit':
        this.editOrder(event.row);
        break;
      case 'cancel':
        this.cancelOrder(event.row);
        break;
    //   case 'complete':
    //     this.completeOrder(event.row);
    //     break;
    }
  }

  /**
   * Cambia de página
   */
  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  /**
   * Maneja la búsqueda
   */
  onSearchChanged(term: string): void {
    this.currentPage = 1;
    // Implementa búsqueda si es necesario
  }

  /**
   * Maneja el ordenamiento
   */
  onSortChanged(event: { column: string; direction: 'asc' | 'desc' }): void {
    console.log('Ordenando por:', event.column, event.direction);
  }

  /**
   * Ver detalles de la orden
   */
  viewOrderDetails(order: Order): void {
    console.log('Ver detalles de orden:', order);
    // Abre modal o navega a página de detalles
  }

  /**
   * Edita una orden
   */
  editOrder(order: Order): void {
    console.log('Editando orden:', order);
    // Abre modal de edición
  }

  /**
   * Cancela una orden
   */
  cancelOrder(order: Order): void {
    if (confirm(`¿Estás seguro de que deseas cancelar la orden #${order.id}?`)) {
      this.orderService.cancelOrder(order.id).subscribe({
        next: () => {
          this.loadOrders();
          // this.toastr.success('Orden cancelada correctamente');
        },
        error: (error) => {
          console.error('Error cancelando orden:', error);
          // this.toastr.error('Error al cancelar la orden');
        }
      });
    }
  }

  /**
   * Marca una orden como completada
   */
//   completeOrder(order: Order): void {
//     if (confirm(`¿Marcar la orden #${order.id} como completada?`)) {
//       this.orderService.completeOrder(order.id).subscribe({
//         next: () => {
//           this.loadOrders();
//           // this.toastr.success('Orden completada');
//         },
//         error: (error) => {
//           console.error('Error completando orden:', error);
//           // this.toastr.error('Error al completar la orden');
//         }
//       });
//     }
//   }
}
