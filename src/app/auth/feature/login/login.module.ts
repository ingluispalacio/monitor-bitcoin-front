import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './login.routing';
import { LoginPage } from './login.page';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LoginPage
  ]
})
export class LoginModule {}