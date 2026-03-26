import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './create-order.routing';
import { CreateOrderPage } from './create-order.page';


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CreateOrderPage
  ]
})
export class CreateOrderModule {}