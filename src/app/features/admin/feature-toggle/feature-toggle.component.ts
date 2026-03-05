import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

interface FeatureToggle {
  id?: string;
  moduleName: string;
  active: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-admin-feature-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./feature-toggle.component.html",
  styles: [`
    :host {
      display: block;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class AdminFeatureToggleComponent implements OnInit, OnDestroy {
  features: FeatureToggle[] = [];
  loading = true;
  togglingFeature: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFeatures();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadFeatures(): void {
    this.loading = true;
    const featuresSub = this.adminService.getAllFeatures().subscribe({
      next: (features) => {
        // Crear features por defecto si no existen
        const defaultFeatures = [
          { moduleName: 'PURCHASES', active: true, description: 'Permitir creación de órdenes' }
        ];

        this.features = features.length > 0 ? features : defaultFeatures;
        this.loading = false;
        this.toastr.info('Características cargadas correctamente', 'Sistema');
      },
      error: () => {
        this.loading = false;
        // Crear features por defecto en caso de error
        this.features = [
          { moduleName: 'PURCHASES', active: true, description: 'Permitir creación de órdenes' }
        ];
        this.toastr.error('Error al cargar características del servidor', 'Error');
      }
    });
    this.subscriptions.push(featuresSub);
  }

  toggleFeature(moduleName: string): void {
    const feature = this.features.find(f => f.moduleName === moduleName);
    if (!feature) return;

    if (feature.active) {
      this.deactivateFeature(moduleName);
    } else {
      this.activateFeature(moduleName);
    }
  }

  activateFeature(moduleName: string): void {
    this.togglingFeature = moduleName;
    this.toastr.info(`Activando ${this.getFeatureLabel(moduleName)}...`, 'Procesando');

    const activateSub = this.adminService.activateFeature(moduleName).subscribe({
      next: (updatedFeature) => {
        const feature = this.features.find(f => f.moduleName === moduleName);
        if (feature) {
          feature.active = true;
          feature.updatedAt = updatedFeature.updatedAt;
        }
        this.togglingFeature = null;
        this.toastr.success(
          `✅ ${this.getFeatureLabel(moduleName)} activado correctamente`,
          'Éxito',
          { timeOut: 3000 }
        );
      },
      error: () => {
        this.togglingFeature = null;
        this.toastr.error(
          `Error al activar ${this.getFeatureLabel(moduleName)}`,
          'Error'
        );
      }
    });

    this.subscriptions.push(activateSub);
  }

  deactivateFeature(moduleName: string): void {
    this.togglingFeature = moduleName;
    this.toastr.info(`Desactivando ${this.getFeatureLabel(moduleName)}...`, 'Procesando');

    const deactivateSub = this.adminService.deactivateFeature(moduleName).subscribe({
      next: (updatedFeature) => {
        const feature = this.features.find(f => f.moduleName === moduleName);
        if (feature) {
          feature.active = false;
          feature.updatedAt = updatedFeature.updatedAt;
        }
        this.togglingFeature = null;
        this.toastr.success(
          `❌ ${this.getFeatureLabel(moduleName)} desactivado correctamente`,
          'Éxito',
          { timeOut: 3000 }
        );
      },
      error: () => {
        this.togglingFeature = null;
        this.toastr.error(
          `Error al desactivar ${this.getFeatureLabel(moduleName)}`,
          'Error'
        );
      }
    });

    this.subscriptions.push(deactivateSub);
  }

  getActiveCount(): number {
    return this.features.filter(f => f.active).length;
  }

  getFeatureIcon(moduleName: string): string {
    const icons: Record<string, string> = {
      'PURCHASES': 'bi bi-cart-fill',
      'APPROVALS': 'bi bi-check-square-fill',
      'PAYMENTS': 'bi bi-credit-card-fill',
      'ANALYTICS': 'bi bi-graph-up-arrow'
    };
    return icons[moduleName] || 'bi bi-gear-fill';
  }

  getFeatureLabel(moduleName: string): string {
    const labels: Record<string, string> = {
      'PURCHASES': 'Módulo de Compras',
      'APPROVALS': 'Sistema de Aprobaciones',
      'PAYMENTS': 'Procesamiento de Pagos',
      'ANALYTICS': 'Analítica y Reportes'
    };
    return labels[moduleName] || moduleName;
  }

  getFeatureDescription(moduleName: string): string {
    const descriptions: Record<string, string> = {
      'PURCHASES': 'Permite a los clientes crear órdenes de compra',
      'APPROVALS': 'Habilita el flujo de aprobación administrativo',
      'PAYMENTS': 'Procesa pagos y transacciones financieras',
      'ANALYTICS': 'Muestra estadísticas y reportes del sistema'
    };
    return descriptions[moduleName] || 'Característica del sistema';
  }
}