import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { OrderService } from '../../../core/services/order.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { Order } from '../../../core/models/order.model';
import { WebSocketEvent } from '../../../core/models/websocket-event.model';
import { EventType } from '../../../core/enums/event-type.enum';
import { firstValueFrom, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CreateOrderModalComponent } from '../../ui/modal-component/create-order-modal.component';
import { CryptoPrice, CryptoService } from '../../data-access/services/crypto.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CreateOrderModalComponent],
  templateUrl: './dashboard.page.html',
})
export class ClientDashboardPage implements OnInit, OnDestroy {
  bitcoinPrice: CryptoPrice | null = null;
  loading: boolean = false;
  purchasesEnabled = true;
  recentOrders: Order[] = [];
  isModalOpen = false;
  orderStats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private cryptoService: CryptoService,
    private orderService: OrderService,
    private adminService: AdminService,
    private wsService: WebSocketService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupWebSocket();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private loadInitialData(): void {
    this.loadOrders();
    this.checkPurchasesEnabled();

    // Mantenemos la carga inicial de precios por HTTP o BehaviorSubject
    const priceSub = this.cryptoService.price$.subscribe((price) => {
      if (price) this.bitcoinPrice = price;
    });
    this.subscriptions.push(priceSub);
  }

  private checkPurchasesEnabled(): void {
    const purchaseSub = this.adminService
      .getAllFeatures() // Esta función debe llamar al endpoint que devuelve el JSON que mostraste
      .subscribe({
        next: (features: any[]) => {
          // Buscamos el módulo CRYPTO_MONITOR en el array 'data'
          const monitorFeature = features.find(
            (f) => f.moduleName === 'CRYPTO_MONITOR',
          );

          // Si el módulo existe y 'active' es true, habilitamos compras.
          // En tu JSON de ejemplo es false, por lo tanto purchasesEnabled será false.
          this.purchasesEnabled = !!(monitorFeature && monitorFeature.active);

          console.log(
            `🛠️ Módulo ${monitorFeature?.moduleName}: ${this.purchasesEnabled ? 'ACTIVO' : 'BLOQUEADO'}`,
          );
        },
        error: (err) => {
          // Por seguridad, si falla la API de toggles, bloqueamos la compra
          this.purchasesEnabled = false;
          this.toastr.warning(
            'No se pudo verificar el estado del sistema de compras.',
          );
        },
      });
    this.subscriptions.push(purchaseSub);
  }
  // 2. MODIFICACIÓN DEL MÉTODO DE COMPRA
  goToCreateOrder(): void {
    if (this.purchasesEnabled) {
      this.isModalOpen = true; // Abre el modal en lugar de navegar
    } else {
      this.toastr.error(
        'El mercado de compras está cerrado actualmente.',
        'Sistema Bloqueado',
      );
    }
  }

  // 3. ACTUALIZACIÓN DE DATOS (Se llama al cerrar el modal con éxito)
  refreshData(): void {
    // Recargamos órdenes y estadísticas
    this.loadOrders();

    // El precio se actualiza solo por el BehaviorSubject del CryptoService,
    // pero podemos forzar una comprobación del feature toggle aquí también
    this.checkPurchasesEnabled();

    console.log('Dashboard sincronizado tras nueva orden.');
  }
  private setupWebSocket(): void {
    this.wsService.connectClient();

    const wsSub = this.wsService
      .onClientEvent()
      .subscribe((event: WebSocketEvent) => {
        console.log('🔔 Evento WebSocket recibido en Dashboard:', event);
        // Manejo de Órdenes (Se mantiene igual)
        if (
          event.type === EventType.ORDER_STATUS_UPDATED ||
          event.type === EventType.ORDER_APPROVED ||
          event.type === EventType.ORDER_REJECTED
        ) {
          this.loadOrders();
          this.toastr.info('Estado de tu orden actualizado', 'Notificación');
        }

        // Manejo de Precio - SOLUCIÓN AL ERROR DE TIPO
        if (event.type === EventType.PRICE_UPDATE) {
          const priceData = event.data as any;
          const newPriceValue = Number(priceData.price);

          if (this.bitcoinPrice) {
            // Opción A: Actualizamos solo el precio sobre el objeto existente para no perder los otros campos
            this.bitcoinPrice = {
              ...this.bitcoinPrice,
              price: newPriceValue,
              priceUsd: newPriceValue, // Asumimos 1:1 para el dashboard
              lastUpdated: new Date(),
            };
          } else {
            // Opción B: Si es la primera vez que llega y no hay datos previos,
            // casteamos como 'any' y luego a CryptoPrice para saltar la restricción de campos faltantes
            this.bitcoinPrice = {
              symbol: 'BTC',
              name: 'Bitcoin',
              price: newPriceValue,
              priceUsd: newPriceValue,
              change24h: 0,
              marketCap: 0,
              volume24h: 0,
              timestamp: new Date(),
              lastUpdated: new Date(),
            } as CryptoPrice;
          }
        }
      });

    this.subscriptions.push(wsSub);
  }

  private updateOrderStats(orders: Order[]): void {
    this.orderStats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      approved: orders.filter((o) => o.status === 'APPROVED').length,
      rejected: orders.filter((o) => o.status === 'REJECTED').length,
    };
  }

  private loadPrices(): void {
    const priceSub = this.cryptoService.price$.subscribe((price) => {
      if (price) {
        this.bitcoinPrice = price;
      }
    });
    this.subscriptions.push(priceSub);
  }

  

  async loadOrders(): Promise<void> {
      this.loading = true;
      try {
        const response = await firstValueFrom(this.orderService.getMyOrders());
  
        let rawData: any[] = [];
        
        if (Array.isArray(response)) {
          rawData = response;
        } else if (response && Array.isArray(response.data)) {
          rawData = response.data;
        }
  
        this.recentOrders = rawData.slice(0, 5);
        this.updateOrderStats(rawData);
        this.toastr.success('Ordenes cargadas correctamente');
      } catch (error) {
        console.error('Error cargando ordenes:', error);
        this.toastr.error('Error al cargar las ordenes');
      } finally {
        this.loading = false;
      }
    }

  // goToCreateOrder(): void {
  //   this.router.navigate(['/client/create-order']);
  // }

  // refreshData(): void {
  //   this.loadPrices();
  //   this.loadOrders();
  //   this.toastr.success('Datos actualizados', 'Éxito');
  // }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}
