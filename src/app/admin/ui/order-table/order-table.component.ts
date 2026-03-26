import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderStatus } from '../../../core/enums/order-status.enum';
import { StatusBadgeComponent } from '../../../shared/ui/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';
import { Order } from '../../../core/models/order.model';


@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    StatusBadgeComponent, 
    LoadingSpinnerComponent
  ],
  templateUrl: './order-table.component.html'
})
export class OrderTableComponent implements OnInit {
  @Input() orders: Order[] = [];
  @Input() loading: boolean = false;
  @Input() showFilters: boolean = true;
  @Input() pageSize: number = 10;
  
  @Output() onApprove = new EventEmitter<string>();
  @Output() onReject = new EventEmitter<string>();
  @Output() onView = new EventEmitter<string>();
  @Output() onFilterChange = new EventEmitter<any>();

  // Paginación
  currentPage: number = 1;
  totalPages: number = 1;
  paginatedOrders: Order[] = [];

  // Búsqueda y filtros
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  sortColumn: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Estado de selección
  selectedOrders: Set<string> = new Set();
  selectAll: boolean = false;

  // Opciones para filtros
  statusOptions = Object.values(OrderStatus);
  dateOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'custom', label: 'Personalizado' }
  ];

  // Para filtro personalizado
  showDatePicker: boolean = false;
  startDate: string = '';
  endDate: string = '';

  ngOnInit(): void {
    this.calculatePagination();
  }

  // ========== PAGINACIÓN ==========
  calculatePagination(): void {
    const filteredOrders = this.filterOrders();
    this.totalPages = Math.ceil(filteredOrders.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
    
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedOrders = filteredOrders.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  // ========== FILTROS ==========
  filterOrders(): Order[] {
    let filtered = [...this.orders];

    // Filtro por búsqueda (cliente o ID)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.clientName.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (this.statusFilter) {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    // Filtro por fecha
    if (this.dateFilter && this.dateFilter !== 'custom') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        
        switch(this.dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    } else if (this.dateFilter === 'custom' && this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59);
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue: any = a[this.sortColumn as keyof Order];
      let bValue: any = b[this.sortColumn as keyof Order];
      
      if (this.sortColumn === 'total' || this.sortColumn === 'amount' || this.sortColumn === 'price') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (this.sortColumn === 'createdAt' || this.sortColumn === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.calculatePagination();
    this.onFilterChange.emit({
      search: this.searchTerm,
      status: this.statusFilter,
      date: this.dateFilter,
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.dateFilter = '';
    this.startDate = '';
    this.endDate = '';
    this.showDatePicker = false;
    this.currentPage = 1;
    this.calculatePagination();
    this.onFilterChange.emit({ reset: true });
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.calculatePagination();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  // ========== SELECCIÓN ==========
  toggleSelectAll(): void {
    if (this.selectAll) {
      this.paginatedOrders.forEach(order => this.selectedOrders.add(order.id));
    } else {
      this.selectedOrders.clear();
    }
  }

  toggleSelect(orderId: string): void {
    if (this.selectedOrders.has(orderId)) {
      this.selectedOrders.delete(orderId);
    } else {
      this.selectedOrders.add(orderId);
    }
    this.selectAll = this.paginatedOrders.every(order => 
      this.selectedOrders.has(order.id)
    );
  }

  isSelected(orderId: string): boolean {
    return this.selectedOrders.has(orderId);
  }

  clearSelection(): void {
    this.selectedOrders.clear();
    this.selectAll = false;
  }

  // ========== ACCIONES ==========
  approveOrder(orderId: string): void {
    this.onApprove.emit(orderId);
  }

  rejectOrder(orderId: string): void {
    this.onReject.emit(orderId);
  }

  viewOrder(orderId: string): void {
    this.onView.emit(orderId);
  }

  approveSelected(): void {
    this.selectedOrders.forEach(orderId => {
      this.onApprove.emit(orderId);
    });
    this.clearSelection();
  }

  rejectSelected(): void {
    this.selectedOrders.forEach(orderId => {
      this.onReject.emit(orderId);
    });
    this.clearSelection();
  }

  // ========== UTILIDADES ==========
  getTotalValue(): number {
    return this.paginatedOrders.reduce((sum, order) => sum + order.total, 0);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  }
}