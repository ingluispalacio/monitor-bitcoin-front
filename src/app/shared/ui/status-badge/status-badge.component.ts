import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus, OrderStatusLabels, OrderStatusColors } from '../../../core/enums/order-status.enum';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getStatusClass()" class="badge">
      {{ getStatusLabel() }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status!: OrderStatus;

  getStatusClass(): string {
    return OrderStatusColors[this.status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(): string {
    return OrderStatusLabels[this.status] || this.status;
  }
}