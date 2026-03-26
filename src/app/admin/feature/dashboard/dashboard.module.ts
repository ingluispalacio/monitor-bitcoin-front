import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardPage } from './dashboard.page';
import { RouterModule } from '@angular/router';
import { routes } from './dashboard.routing';

// UI compartida
import { ConfirmationDialogComponent } from '../../../shared/ui/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminDashboardPage, // standalone
    ConfirmationDialogComponent
  ]
})
export class DashboardModule {}