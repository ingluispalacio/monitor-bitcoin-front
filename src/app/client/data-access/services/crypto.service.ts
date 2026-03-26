import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { WebSocketService } from '../../../core/services/websocket.service';
import { ApiResponse } from '../../../core/models/api-response.interface';

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  priceUsd: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  timestamp: Date;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private apiUrl = `${environment.apiBaseUrl}/crypto`;
  private priceSubject = new BehaviorSubject<CryptoPrice | null>(null);
  public price$ = this.priceSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private wsService: WebSocketService // Inyectamos el servicio que ya tienes
  ) {
    // 💡 IMPORTANTE: Ya no llamamos a initializePriceUpdates() (polling HTTP)
    // En su lugar, escuchamos el WebSocket
    this.listenToPriceUpdates();
  }

  /**
   * REEMPLAZO DEL POLLING:
   * Escucha los eventos PRICE_UPDATE del backend a través del WebSocketService.
   */
  private listenToPriceUpdates(): void {
    this.wsService.onPriceUpdates().subscribe({
      next: (priceData: any) => {
        // Si el backend envía el DTO completo que planeamos:
        console.log('📈 Precio recibido por WS:', priceData);
        if (priceData && typeof priceData === 'object') {
          this.priceSubject.next({
            symbol: priceData.symbol || 'BTC',
            name: priceData.name || 'Bitcoin',
            price: priceData.price,
            priceUsd: priceData.price,
            change24h: priceData.change24h || 0,
            marketCap: priceData.marketCap || 0,
            volume24h: priceData.volume24h || 0,
            timestamp: new Date(priceData.timestamp || Date.now()),
            lastUpdated: new Date()
          });
        } 
        // Si el backend solo envía el número directamente:
        else if (typeof priceData === 'number') {
          const current = this.priceSubject.value;
          this.priceSubject.next({
            ...current,
            symbol: 'BTC',
            name: 'Bitcoin',
            price: priceData,
            priceUsd: priceData,
            lastUpdated: new Date()
          } as CryptoPrice);
        }
      },
      error: (err) => console.error('Error en el flujo de precios WS:', err)
    });
  }

  // ================= API Calls (Solo para datos históricos o estáticos) =================

  private handleResponse<T>(observable: Observable<ApiResponse<T>>): Observable<T> {
    return observable.pipe(
      map(response => {
        if (!response.success) {
          this.toastr.error(response.message);
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(error => {
        const message = error?.error?.message || error.message || 'Error obteniendo datos';
        this.toastr.error(message);
        return throwError(() => error);
      })
    );
  }

  // Este podrías usarlo solo una vez al cargar la app si el backend lo soporta,
  // de lo contrario, el primer precio llegará a los 5 segundos por WS.
  getPriceHistory(symbol: string, days: number = 30): Observable<any[]> {
    return this.handleResponse(
      this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${symbol}/history?days=${days}`)
    );
  }

  getCurrentPrice(): CryptoPrice | null {
    return this.priceSubject.value;
  }
}