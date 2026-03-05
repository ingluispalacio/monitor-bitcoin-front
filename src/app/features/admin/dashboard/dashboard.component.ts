import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { Order } from '../../../core/models/order.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { WebSocketEvent } from '../../../core/models/websocket-event.model';
import { EventType } from '../../../core/enums/event-type.enum';

interface LiveEvent {
  type: string;
  clientName: string;
  amount: number;
  status: string;
  timestamp: Date;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  pendingOrders: Order[] = [];
  liveEvents: LiveEvent[] = [];
  loading = true;
  wsConnected = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private orderService: OrderService,
    private wsService: WebSocketService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupWebSocket();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Asegúrate de importar esto

  // ... dentro de tu clase AdminDashboardComponent

  async loadInitialData(): Promise<void> {
    this.loading = true;
    try {
      // Convertimos el Observable a Promesa para usar await
      const response = await firstValueFrom(
        this.orderService.getPendingOrders(),
      );

      let rawData: any[] = [];

      // Lógica de extracción flexible (si viene array directo o envuelto en .data)
      if (Array.isArray(response)) {
        rawData = response;
      } else if (response && Array.isArray((response as any).data)) {
        rawData = (response as any).data;
      }

      // Mapeo y limpieza de datos para asegurar que la UI no rompa
      this.pendingOrders = rawData.map((order) => ({
        ...order,
        // Aseguramos que el ID sea string para evitar errores en el HTML (slice/etc)
        id: order.id ? order.id.toString() : '',
        // Si necesitas algún campo calculado como el ejemplo de usuarios, hazlo aquí
        clientName: order.clientName || 'Usuario Desconocido',
      }));

      // Opcional: Notificación de éxito
      // this.toastr.success('Órdenes sincronizadas');
    } catch (error) {
      console.error('❌ Error cargando órdenes pendientes:', error);
      this.toastr.error('No se pudieron cargar las órdenes');
    } finally {
      this.loading = false;
    }
  }

  private setupWebSocket(): void {
    this.wsService.connectAdmin();

    const wsSub = this.wsService
      .onAdminEvent()
      .subscribe((event: WebSocketEvent) => {
        console.log('📦 Evento Recibido del WS:', event);

        // 1. Refrescar la tabla de la izquierda (Órdenes Pendientes)
        this.loadInitialData();

        // 2. Procesar el Feed (Columna derecha)
        if (!event.data) return;

        try {
          const orderData =
            typeof event.data === 'string'
              ? JSON.parse(event.data)
              : event.data;

          const newEvent: LiveEvent = {
            type: event.type, // ORDER_CREATED, ORDER_APPROVED, etc.
            clientName: orderData.clientName || 'Sistema',
            amount: orderData.amount || 0,
            status: orderData.status || 'UNKNOWN', // IMPORTANTE: Aquí debe venir APPROVED/REJECTED
            timestamp: new Date(),
          };

          console.log('🔔 Agregando al Feed:', newEvent);
          this.addLiveEvent(newEvent);
        } catch (e) {
          console.error('❌ Error al procesar datos del evento WS', e);
        }
      });

    this.subscriptions.push(wsSub);
  }

  private addLiveEvent(event: LiveEvent): void {
    // Creamos un nuevo array con el nuevo evento al principio y limitamos a 10
    this.liveEvents = [event, ...this.liveEvents].slice(0, 10);
    console.log('✅ Feed actualizado (nueva referencia):', this.liveEvents);
  }

  approveOrder(orderId: string): void {
    this.orderService.approveOrder(orderId).subscribe({
      next: () => {
        this.toastr.success('Orden Aprobada');
        this.loadInitialData();
      },
    });
  }

  rejectOrder(orderId: string): void {
    if (!confirm('¿Rechazar esta orden?')) return;
    this.orderService.rejectOrder(orderId).subscribe({
      next: () => {
        this.toastr.error('Orden Rechazada');
        this.loadInitialData();
      },
    });
  }
}
