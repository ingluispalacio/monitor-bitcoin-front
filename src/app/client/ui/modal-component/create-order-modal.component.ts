import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { CryptoPrice, CryptoService } from '../../data-access/services/crypto.service';


@Component({
  selector: 'app-create-order-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-order-modal.component.html',
})
export class CreateOrderModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() orderCreated = new EventEmitter<void>();

  amount: number = 0;
  bitcoinPrice: CryptoPrice | null = null;
  submitting = false;
  private priceSub: Subscription | null = null;
fullname: string | null;

  

  constructor(
    private orderService: OrderService,
    private cryptoService: CryptoService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.fullname = this.authService.getFullname();
  }

  ngOnInit(): void {
    // Suscribirse al precio en tiempo real para el cálculo
    this.priceSub = this.cryptoService.price$.subscribe(price => {
      this.bitcoinPrice = price;
    });
  }

  ngOnDestroy(): void {
    this.priceSub?.unsubscribe();
  }

  get totalInvestment(): number {
    return (this.amount || 0) * (this.bitcoinPrice?.priceUsd || 0);
  }

  confirmOrder(): void {
    if (this.amount <= 0) {
      this.toastr.warning('Por favor, ingrese una cantidad válida');
      return;
    }

    this.submitting = true;
    
    const orderData = {
      amount: this.amount,
      price: this.bitcoinPrice?.priceUsd,
      total: this.totalInvestment,
      cryptoName: 'Bitcoin',
      clientName: this.fullname || 'Cliente Anónimo'
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.toastr.success('✅ Orden generada. Esperando aprobación del admin.', 'Éxito');
        this.orderCreated.emit();
        this.closeModal();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Error al procesar la compra');
        this.submitting = false;
      }
    });
  }

  closeModal(): void {
    this.amount = 0;
    this.submitting = false;
    this.close.emit();
  }
}