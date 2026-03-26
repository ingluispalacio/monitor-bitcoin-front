import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { ClientLayoutComponent } from './layout/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/feature/login/login.page').then((m) => m.LoginPage),
      },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
    ],
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'CLIENT' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./client/feature/dashboard/dashboard.page').then(
            (m) => m.ClientDashboardPage,
          ),
      },
      {
        path: 'create-order',
        loadComponent: () =>
          import('./client/feature/create-order/create-order.page').then(
            (m) => m.CreateOrderPage,
          ),
      },
      {
        path: 'my-orders',
        loadComponent: () =>
          import('./client/feature/my-orders/my-orders.page').then(
            (m) => m.MyOrdersPage,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ADMIN' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/feature/dashboard/dashboard.page').then(
            (m) => m.AdminDashboardPage,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/feature/orders/orders.page').then(
            (m) => m.AdminOrdersPage,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/feature/users/users.page').then(
            (m) => m.AdminUsersPage,
          ),
      },
      {
        path: 'features',
        loadComponent: () =>
          import('./admin/feature/feature-toggle/feature-toggle.page').then(
            (m) => m.AdminFeatureTogglePage,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
