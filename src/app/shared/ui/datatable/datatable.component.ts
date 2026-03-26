import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'status';
  sortable?: boolean;
  width?: string;
  formatter?: (value: any, row?: any) => string;
}

export interface ActionButton {
  label: string;
  icon: string; // Bootstrap icon class (e.g., 'bi-pencil', 'bi-trash')
  action: string;
  class?: string; // Tailwind classes
  condition?: (row: any) => boolean;
}

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {
  protected readonly Math = Math;
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] = [];
  @Input() actions: ActionButton[] = [];
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() showPagination: boolean = true;
  @Input() searchEnabled: boolean = true;
  @Input() title?: string;

  @Output() actionClicked = new EventEmitter<{ action: string; row: any }>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();

  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredData: any[] = [];
  paginatedData: any[] = [];

  ngOnInit(): void {
    this.updateData();
  }

  ngOnChanges(): void {
    this.updateData();
  }

  private updateData(): void {
    this.filteredData = this.filterData();
    this.updatePaginatedData();
  }

  private filterData(): any[] {
    if (!this.searchTerm) {
      return [...this.data];
    }

    return this.data.filter(item =>
      JSON.stringify(item).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  private updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.updateData();
    this.searchChanged.emit(this.searchTerm);
  }

  onSort(column: ColumnConfig): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.sortChanged.emit({ column: column.key, direction: this.sortDirection });
  }

  onActionClick(action: string, row: any): void {
    this.actionClicked.emit({ action, row });
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.pageChanged.emit(page);
      this.updatePaginatedData();
    }
  }

  getTotalPages(): number {
    return this.totalItems
      ? Math.ceil(this.totalItems / this.pageSize)
      : Math.ceil(this.filteredData.length / this.pageSize);
  }

  getDisplayValue(column: ColumnConfig, row: any): string {
    const value = this.getNestedValue(row, column.key);

    if (column.formatter) {
      return column.formatter(value, row);
    }

    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      case 'boolean':
        return value ? 'Sí' : 'No';
      case 'number':
        return value ? value.toFixed(2) : '0';
      default:
        return value || '-';
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  getSortArrow(column: ColumnConfig): string {
    if (this.sortColumn !== column.key) return '';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }
}
