import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          if (error.status === 401) {
            errorMessage = 'No autorizado';
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            errorMessage = 'Acceso denegado';
          } else if (error.status === 404) {
            errorMessage = 'Recurso no encontrado';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor';
          } else {
            errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
          }
        }
        
        this.toastr.error(errorMessage, 'Error');
        return throwError(() => error);
      })
    );
  }
}