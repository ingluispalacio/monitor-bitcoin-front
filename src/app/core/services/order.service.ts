import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.interface';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../models/order.model';
import { OrderStats } from '../models/order-stats.interface';
import { OrderFilter } from '../models/order-filter.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiBaseUrl}/orders`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  // ================= Helper Universal =================

 private handleResponse<T>(observable: Observable<ApiResponse<T>>): Observable<ApiResponse<T>> {
    return observable.pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        const message =
          error?.error?.message ||
          error.message ||
          'Error en la operación';

        this.toastr.error(message);
        return throwError(() => error);
      })
    );
  }

  // ================= Cliente =================

  createOrder(orderData: any): Observable<ApiResponse<Order>> {
    return this.handleResponse(
      this.http.post<ApiResponse<Order>>(`${this.apiUrl}`, orderData)
    );
  }

  getMyOrders(): Observable<ApiResponse<Order[]>> {
    return this.handleResponse(
      this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/my-orders`)
    );
  }

  cancelOrder(id: string): Observable<ApiResponse<Order>> {
    return this.handleResponse(
      this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${id}/cancel`, {})
    );
  }

  // ================= Admin =================

  getAllOrders(): Observable<ApiResponse<Order[]>> {
    return this.handleResponse(
      this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}`)
    );
  }

  getPendingOrders(): Observable<ApiResponse<Order[]>> {
    return this.handleResponse(
      this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/pending`)
    );
  }

  approveOrder(id: string): Observable<ApiResponse<Order>> {
    return this.handleResponse(
      this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${id}/approve`, {})
    );
  }

  rejectOrder(id: string): Observable<ApiResponse<Order>> {
    return this.handleResponse(
      this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${id}/reject`, {})
    );
  }

  // ================= General =================

  getOrderById(id: string): Observable<ApiResponse<Order>> {
    return this.handleResponse(
      this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${id}`)
    );
  }

  filterOrders(filter: OrderFilter): Observable<ApiResponse<Order[]>> {
    return this.handleResponse(
      this.http.post<ApiResponse<Order[]>>(`${this.apiUrl}/filter`, filter)
    );
  }

  getOrderStats(): Observable<ApiResponse<OrderStats>> {
    return this.handleResponse(
      this.http.get<ApiResponse<OrderStats>>(`${this.apiUrl}/stats`)
    );
  }
}