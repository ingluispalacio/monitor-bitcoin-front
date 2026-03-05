import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { Order } from '../../../core/models/order.model';
import { WebSocketEvent } from '../../../core/models/websocket-event.model'; // Asegúrate de importar esto
import { EventType } from '../../../core/enums/event-type.enum'; // Importa tus Enums
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { OrderStatus, OrderStatusLabels, OrderStatusColors } from '../../../core/enums/order-status.enum';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-orders.component.html',
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  loading = true;
  statusFilter = '';
  searchTerm = '';
  OrderStatus = OrderStatus; 
  orderStats = {
    total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0, completed: 0
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private orderService: OrderService,
    private wsService: WebSocketService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.setupWebSocket();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    // Opcional: desconectar si solo este componente usa el socket
    // this.wsService.disconnect(); 
  }

  private loadOrders(): void {
    this.loading = true;
    const sub = this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders.data || [];
        this.updateStats();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Error al cargar las órdenes', 'Error');
      }
    });
    this.subscriptions.push(sub);
  }

  private setupWebSocket(): void {
    this.wsService.connectClient();
    
    // 🛠️ CORRECCIÓN: Tipado explícito 'event: WebSocketEvent' para evitar TS7006
    const sub = this.wsService.onClientEvent().subscribe((event: WebSocketEvent) => {
      
      if (event.type === EventType.ORDER_STATUS_UPDATED || event.type === EventType.ORDER_APPROVED || event.type === EventType.ORDER_REJECTED) {
        
        // OPTIMIZACIÓN: En lugar de llamar a loadOrders() (HTTP), 
        // actualizamos el objeto directamente si viene en el 'data'
        const updatedOrder = event.data as Order;
        
        if (updatedOrder && updatedOrder.id) {
          const index = this.orders.findIndex(o => o.id === updatedOrder.id);
          if (index !== -1) {
            this.orders[index] = updatedOrder;
            this.applyFilters();
            this.updateStats();
          } else {
            // Si por alguna razón no está en la lista actual, refrescamos todo
            this.loadOrders();
          }
        } else {
          this.loadOrders();
        }

        this.toastr.info(`Tu orden ha sido actualizada a: ${this.getStatusLabel(updatedOrder.status)}`, 'Notificación');
      }
    });
    
    this.subscriptions.push(sub);
  }

  // ... (Resto de métodos updateStats, applyFilters, getStatusClass se mantienen igual)
  
  private updateStats(): void {
    this.orderStats = {
      total: this.orders.length,
      pending: this.orders.filter(o => o.status === OrderStatus.PENDING).length,
      approved: this.orders.filter(o => o.status === OrderStatus.APPROVED).length,
      rejected: this.orders.filter(o => o.status === OrderStatus.REJECTED).length,
      cancelled: this.orders.filter(o => o.status === OrderStatus.CANCELLED).length,
      completed: this.orders.filter(o => o.status === OrderStatus.COMPLETED).length
    };
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchStatus = !this.statusFilter || order.status === this.statusFilter;
      const matchSearch = !this.searchTerm || 
        (order.id + '').toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  getStatusClass(status: OrderStatus | string): string {
    return OrderStatusColors[status as OrderStatus] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: OrderStatus | string): string {
    return OrderStatusLabels[status as OrderStatus] || status;
  }
}