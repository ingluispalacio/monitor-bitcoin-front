import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet], 
  templateUrl: './client-layout.component.html'
})
export class ClientLayoutComponent {
  fullname: string | null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.fullname = this.authService.getFullname();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}