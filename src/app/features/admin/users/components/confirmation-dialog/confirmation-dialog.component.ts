import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent {
  isOpen = true; 
  @Input() data!: ConfirmationData;
  @Output() closed = new EventEmitter<boolean>();

  

  getIcon(): string {
    switch (this.data.type) {
      case 'danger': return 'bi-exclamation-triangle-fill';
      case 'warning': return 'bi-exclamation-circle-fill';
      case 'info': return 'bi-info-circle-fill';
      case 'success': return 'bi-check-circle-fill';
      default: return 'bi-question-circle-fill';
    }
  }

  getIconColor(): string {
    switch (this.data.type) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-600';
    }
  }

  getTitleClass(): string {
    switch (this.data.type) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-800';
    }
  }

  getConfirmButtonClass(): string {
    switch (this.data.type) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'info': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'success': return 'bg-green-600 hover:bg-green-700 text-white';
      default: return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  }

  onConfirm(): void {
    this.isOpen = false;
    this.closed.emit(true);  // ✅ Emitir true
  }

  onCancel(): void {
    this.isOpen = false;
    this.closed.emit(false); // ✅ Emitir false
  }
}