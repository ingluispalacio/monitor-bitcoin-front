import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './my-orders.routing';
import { MyOrdersPage } from './my-orders.page';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MyOrdersPage
  ]
})
export class MyOrdersModule {}