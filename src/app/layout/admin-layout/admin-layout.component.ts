import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true, 
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
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