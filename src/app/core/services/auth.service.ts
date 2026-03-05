import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { UserRole } from '../enums/user-role.enum';
import { LoginResponse } from '../../features/auth/models/login-response.interface';
import { LoginRequest } from '../../features/auth/models/login-request.interface';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.interface';
import { ToastrService } from 'ngx-toastr'; // 👈 ejemplo con ngx-toastr

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loadUserFromToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {

    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/login`,
      credentials
    ).pipe(

      map(response => {

        if (!response.success) {
          this.toastr.error(response.message);
          throw new Error(response.message);
        }

        const data = response.data;

        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('fullname', data.fullName);

        this.loadUserFromToken();

        this.toastr.success(response.message);

        return data;
      }),

      catchError(error => {

        const errorMessage =
          error?.error?.message ||
          error.message ||
          'Error al iniciar sesión';

        this.toastr.error(errorMessage);

        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): UserRole | null {
    return localStorage.getItem('role') as UserRole | null;
  }

  getFullname(): string | null {
    return localStorage.getItem('fullname');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  isAdmin(): boolean {
    return this.getUserRole() === UserRole.ADMIN;
  }

  isClient(): boolean {
    return this.getUserRole() === UserRole.CLIENT;
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.currentUserSubject.next(decodedToken);
    }
  }
}