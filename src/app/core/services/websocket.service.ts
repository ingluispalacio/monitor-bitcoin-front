import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, takeUntil, filter, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { EventType } from '../enums/event-type.enum';
import { WebSocketEvent } from '../models/websocket-event.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private clientSocket$!: WebSocketSubject<any>;
  private adminSocket$!: WebSocketSubject<any>;
  private destroy$ = new Subject<void>();
  
  // Subjects para centralizar los eventos y que varios componentes puedan escuchar
  private clientEvents$ = new Subject<WebSocketEvent>();
  private adminEvents$ = new Subject<WebSocketEvent>();

  constructor(private authService: AuthService) {}

  /**
   * Conexión para Clientes (Precios y estados de sus propias órdenes)
   */
  connectClient(): void {
    if (this.clientSocket$ && !this.clientSocket$.closed) return;

    const token = this.authService.getToken();
    // Se envía por Query Param como espera tu JwtSecurityContextRepository.java
    const url = `${environment.wsBaseUrl}/client?token=${token}`;
    
    console.log('🔌 Intentando conectar WS Cliente...');
    
    this.clientSocket$ = webSocket({
      url: url,
      openObserver: {
        next: () => console.log('✅ WebSocket client Conectado con éxito')
      },
      // Esto asegura que si el server se cae, el socket se limpie correctamente
      closeObserver: {
        next: () => console.log('🔴 WS Cliente cerrado')
      }
    });

    this.clientSocket$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        // Casteo explícito a WebSocketEvent para evitar errores de tipo
        this.clientEvents$.next(data as WebSocketEvent);
      },
      error: (err) => {
        console.error('❌ Error WebSocket Cliente:', err);
        // Reintento automático tras 5 segundos
        setTimeout(() => this.connectClient(), 5000);
      }
    });
  }

  /**
   * Conexión para Administradores (Flujo total de órdenes)
   */
  connectAdmin(): void {
    if (this.adminSocket$ && !this.adminSocket$.closed) return;

    const token = this.authService.getToken();
    const url = `${environment.wsBaseUrl}/admin?token=${token}`;
    
    console.log('🔌 Intentando conectar WS Admin...');
    this.adminSocket$ = webSocket({
      url: url,
      openObserver: {
        next: () => console.log('✅ WebSocket Admin Conectado con éxito')
      }
    });

    this.adminSocket$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        console.log('📦 Mensaje recibido en Admin:', data); // Cambiado de error a log
        this.adminEvents$.next(data as WebSocketEvent);
      },
      error: (err) => {
        console.error('❌ Error WebSocket Admin:', err);
        setTimeout(() => this.connectAdmin(), 5000);
      }
    });
  }

  // --- ESCUCHADORES PARA COMPONENTES ---

  /** * Usado por MyOrdersComponent y ClientDashboard 
   * Resuelve el error: La propiedad 'onClientEvent' no existe
   */
  onClientEvent(): Observable<WebSocketEvent> {
    return this.clientEvents$.asObservable();
  }

  /** Usado por el panel de administración */
  onAdminEvent(): Observable<WebSocketEvent> {
    return this.adminEvents$.asObservable();
  }

  /** Escuchador especializado en precios */
  onPriceUpdates(): Observable<number> {
    return this.clientEvents$.pipe(
      filter(event => event.type === EventType.PRICE_UPDATE),
      map(event => event.data as number)
    );
  }

  /** Escuchador para actividad general de órdenes (Admin) */
  onOrderActivity(): Observable<WebSocketEvent> {
    return this.adminEvents$.pipe(
      filter(event => event.type.toString().includes('ORDER'))
    );
  }

  /** Envío de mensajes desde el Front al Back (si fuera necesario) */
  sendAdminAction(action: WebSocketEvent): void {
    if (this.adminSocket$ && !this.adminSocket$.closed) {
      this.adminSocket$.next(action);
    }
  }
  onNewOrders(): Observable<WebSocketEvent> {
    return this.adminEvents$.pipe(
      filter(event => event.type === EventType.ORDER_CREATED)
    );
  }

 
  disconnect(): void {
    console.log('🔌 Desconectando WebSockets...');
    this.destroy$.next();
    this.destroy$.complete();
    if (this.clientSocket$) this.clientSocket$.complete();
    if (this.adminSocket$) this.adminSocket$.complete();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}