import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../../core/services/websocket.service';
import { ToastrService } from 'ngx-toastr';
import { OrderTableComponent } from '../../ui/order-table/order-table.component';
import { Order } from '../../../core/models/order.model';
import { OrderStats } from '../../../core/models/order-stats.interface';
import { OrderService } from '../../../core/services/order.service';


@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderTableComponent],
  templateUrl: './orders.page.html'
})
export class AdminOrdersPage implements OnInit, OnDestroy {
  orders: Order[] = [];
  stats: OrderStats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };;
  loading: boolean = true;
  statusFilter: string = 'PENDING';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private orderService: OrderService,
    private wsService: WebSocketService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadStats();
    this.setupWebSocket();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadOrders(): void {
    this.loading = true;
    const obs = this.statusFilter 
      ? this.orderService.getPendingOrders()
      : this.orderService.getAllOrders();
    
    obs.subscribe({
      next: (orders) => {
        this.orders = orders.data || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadStats(): void {
    this.orderService.getOrderStats().subscribe({
      next: (stats) => this.stats = stats.data
    });
  }

  setupWebSocket(): void {
    this.wsService.connectAdmin();
    
    this.subscriptions.push(
      this.wsService.onNewOrders().subscribe(() => {
        this.loadOrders();
        this.loadStats();
        this.toastr.info('Nueva orden recibida', 'Actualización');
      })
    );
  }

  applyFilter(): void {
    this.loadOrders();
  }

  refreshOrders(): void {
    this.loadOrders();
    this.loadStats();
  }

  approveOrder(orderId: string): void {
    this.orderService.approveOrder(orderId).subscribe({
      next: () => {
        this.toastr.success('Orden aprobada exitosamente');
        this.loadOrders();
        this.loadStats();
      }
    });
  }

  rejectOrder(orderId: string): void {
    this.orderService.rejectOrder(orderId).subscribe({
      next: () => {
        this.toastr.success('Orden rechazada');
        this.loadOrders();
        this.loadStats();
      }
    });
  }
}