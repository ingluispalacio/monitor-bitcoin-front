import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminFeatureTogglePage } from './feature-toggle.page';
import { routes } from './feature-toggle.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AdminFeatureTogglePage
  ]
})
export class FeatureToggleModule {}