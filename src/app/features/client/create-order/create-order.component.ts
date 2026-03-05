import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { Order } from '../../../core/models/order.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { OrderStatus, OrderStatusLabels, OrderStatusColors } from '../../../core/enums/order-status.enum';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-orders.component.html',
})
export class CreateOrderComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  loading = true;
  statusFilter = '';
  searchTerm = '';
  OrderStatus = OrderStatus; 
  orderStats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    completed: 0
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
    const sub = this.wsService.onClientEvent().subscribe(event => {
      if (event.type === 'ORDER_STATUS_UPDATED') {
        this.loadOrders();
        this.toastr.info('Tu orden ha sido actualizada', 'Notificación');
      }
    });
    this.subscriptions.push(sub);
  }

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
        (order.id + '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.amount.toString().includes(this.searchTerm);
      return matchStatus && matchSearch;
    });
  }

  resetFilters(): void {
    this.statusFilter = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  refreshOrders(): void {
    this.loadOrders();
    this.toastr.success('Órdenes actualizadas', 'Éxito');
  }

  viewDetails(order: Order): void {
    this.selectedOrder = order;
  }

  cancelOrder(orderId: string): void {
    if (!confirm('¿Estás seguro de que deseas cancelar esta orden?')) return;

    const sub = this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        this.toastr.success('Orden cancelada exitosamente', 'Éxito');
        this.loadOrders();
      },
      error: () => {
        this.toastr.error('Error al cancelar la orden', 'Error');
      }
    });
    this.subscriptions.push(sub);
  }

  getStatusClass(status: OrderStatus | string): string {
    return OrderStatusColors[status as OrderStatus] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: OrderStatus | string): string {
    return OrderStatusLabels[status as OrderStatus] || status;
  }
}