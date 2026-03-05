import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_CONFIG } from '../constants/app.constants';
import { ApiResponse } from '../models/api-response.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private apiUrl = API_CONFIG.BASE_URL;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  getCurrentPrice(): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.apiUrl}/prices/bitcoin`)
      .pipe(
        map(response => {
          if (!response.success) {
            this.toastr.error(response.message);
            throw new Error(response.message);
          }

          return response.data;
        }),
        catchError(error => {
          const message =
            error?.error?.message ||
            error.message ||
            'Error obteniendo el precio';

          this.toastr.error(message);
          return throwError(() => error);
        })
      );
  }
}