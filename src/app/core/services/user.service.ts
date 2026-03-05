import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'; // Cambiamos map por tap
import { User } from '../models/user.model';
import { API_CONFIG } from '../constants/app.constants';
import { ApiResponse } from '../models/api-response.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${API_CONFIG.BASE_URL}/users`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  /**
   * Ahora devuelve Observable<ApiResponse<T>> en lugar de Observable<T>
   */
  private handleResponse<T>(observable: Observable<ApiResponse<T>>): Observable<ApiResponse<T>> {
    return observable.pipe(
      tap(response => {
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

//   private handleResponse2<T>(observable: Observable<ApiResponse<T>>): Observable<ApiResponse<T>> {
//   return observable.pipe(
//     map((response) : ApiResponse<T> => {
//       // Si la respuesta YA es un array o no tiene la propiedad 'data', 
//       // la envolvemos manualmente para que el resto de tu app no rompa.
     
//       return response as ApiResponse<T>;
//     }),
//     tap(response => {
//       console.log('Respuesta procesada:', response);
//       if (!response.success) {
//         this.toastr.error(response.message || 'Operación fallida');
//       }
//     }),
//     catchError(error => {
//       this.toastr.error(error?.error?.message || error.message || 'Error');
//       return throwError(() => error);
//     })
//   );
// }

  // Todos los retornos ahora incluyen ApiResponse<>
  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.handleResponse(
      this.http.get<ApiResponse<User[]>>(this.apiUrl)
    );
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.handleResponse(
      this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`)
    );
  }

  createUser(user: User): Observable<ApiResponse<User>> {
    return this.handleResponse(
      this.http.post<ApiResponse<User>>(this.apiUrl, user)
    );
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.handleResponse(
      this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
    );
  }
  updateUser(id: string, user: User): Observable<ApiResponse<User>> {
    return this.handleResponse(
      this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user)
    );
  }
}