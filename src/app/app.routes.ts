import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { ClientLayoutComponent } from './layout/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ClientDashboardComponent } from './features/client/dashboard/dashboard.component';
import { CreateOrderComponent } from './features/client/create-order/create-order.component';
import { MyOrdersComponent } from './features/client/my-orders/my-orders.component';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AdminOrdersComponent } from './features/admin/orders/orders.component';
import { AdminUsersComponent } from './features/admin/users/users.component';
import { AdminFeatureToggleComponent } from './features/admin/feature-toggle/feature-toggle.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: '/login', pathMatch: 'full' }
    ]
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'CLIENT' },
    children: [
      { path: 'dashboard', component: ClientDashboardComponent },
      { path: 'create-order', component: CreateOrderComponent },
      { path: 'my-orders', component: MyOrdersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ADMIN' },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'features', component: AdminFeatureToggleComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];