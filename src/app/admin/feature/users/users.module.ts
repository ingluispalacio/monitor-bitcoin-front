import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { routes } from './users.routing';
import { AdminUsersPage } from './users.page';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminUsersPage
  ]
})
export class UsersModule {}