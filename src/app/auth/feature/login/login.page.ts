import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../data-access/models/login-request.interface';
import { UserRole } from '../../../core/enums/user-role.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html'
})
export class LoginPage {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(): void {
    this.loading = true;
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastr.success(`¡Bienvenido ${response.fullName}!`, 'Login exitoso');
        
        if (response.role === UserRole.ADMIN) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/client/dashboard']);
        }
      },
      error: () => {
        this.loading = false;
        // El error ya es manejado por el interceptor
      }
    });
  }
}