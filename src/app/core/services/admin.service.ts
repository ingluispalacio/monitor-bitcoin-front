import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, CreateUserRequest } from '../models/user.model';
import { FeatureToggle } from '../models/feature-toggle.model';
import { AdminDashboardStats } from '../../features/admin/models/dashboard-stats.interface';
import { ApiResponse } from '../models/api-response.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  // ================== Helper Universal ==================

  private handleResponse<T>(observable: Observable<ApiResponse<T>>): Observable<T> {
    return observable.pipe(
      map(response => {
        if (!response.success) {
          this.toastr.error(response.message);
          throw new Error(response.message);
        }

        if (response.message) {
          this.toastr.success(response.message);
        }

        return response.data;
      }),
      catchError(error => {
        const errorMessage =
          error?.error?.message ||
          error.message ||
          'Error inesperado';

        this.toastr.error(errorMessage);
        return throwError(() => error);
      })
    );
  }

  // ================== FEATURE TOGGLES ==================

  getAllFeatures(): Observable<FeatureToggle[]> {
    return this.handleResponse(
      this.http.get<ApiResponse<FeatureToggle[]>>(`${this.apiUrl}/features`)
    );
  }

  isFeatureActive(moduleName: string): Observable<boolean> {
    return this.handleResponse(
      this.http.get<ApiResponse<boolean>>(
        `${this.apiUrl}/features/module/${moduleName}/active`
      )
    );
  }

  activateFeature(moduleName: string): Observable<FeatureToggle> {
    return this.handleResponse(
      this.http.put<ApiResponse<FeatureToggle>>(
        `${this.apiUrl}/features/${moduleName}/activate`,
        {}
      )
    );
  }

  deactivateFeature(moduleName: string): Observable<FeatureToggle> {
    return this.handleResponse(
      this.http.put<ApiResponse<FeatureToggle>>(
        `${this.apiUrl}/features/${moduleName}/deactivate`,
        {}
      )
    );
  }

  createFeature(feature: FeatureToggle): Observable<FeatureToggle> {
    return this.handleResponse(
      this.http.post<ApiResponse<FeatureToggle>>(
        `${this.apiUrl}/features`,
        feature
      )
    );
  }

  // ================== USUARIOS ==================

  getAllUsers(): Observable<User[]> {
    return this.handleResponse(
      this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`)
    );
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.handleResponse(
      this.http.post<ApiResponse<User>>(`${this.apiUrl}/users`, user)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.handleResponse(
      this.http.delete<ApiResponse<void>>(`${this.apiUrl}/users/${id}`)
    );
  }

  // ================== DASHBOARD ==================

  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.handleResponse(
      this.http.get<ApiResponse<AdminDashboardStats>>(
        `${this.apiUrl}/admin/dashboard/stats`
      )
    );
  }
}