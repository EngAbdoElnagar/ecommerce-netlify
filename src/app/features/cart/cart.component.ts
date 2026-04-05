import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../core/models/ICart/icart.interface';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, LoadingComponent, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  logged = computed(() => this.authService.isLogged());
  isLoading = signal(false);
  updatingItemId = signal<string>('');
  cartDetails = signal<ICart>({} as ICart);
  isModalOpen = signal(false);
  itemToDeleteId = signal<string>('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getCartData();
    }
  }

  getCartData() {
    if (localStorage.getItem('freshToken')) {
      this.isLoading.set(true);
      this.cartService.getLoggedUserCart().subscribe({
        next: (res) => {
          this.cartDetails.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
        },
      });
    }
  }

  confirmDelete(id: string, productName: string): void {
    Swal.fire({
      html: `
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>

          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-2">Remove Item?</h3>

          <p class="text-gray-500 text-sm leading-relaxed">
              Remove <span class="font-semibold text-gray-700">"${productName}"</span> from your cart?
            </p>
        </div>
      `,

      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',

      buttonsStyling: false,

      customClass: {
        popup: 'rounded-3xl p-8 shadow-xl border border-gray-100',
        actions: 'flex justify-center gap-4 mt-8 w-full px-6',
        confirmButton:
          'order-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all flex-1',
        cancelButton:
          'order-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all flex-1',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeItem(id);
      }
    });
  }

  removeItem(id: string): void {
    this.updatingItemId.set(id);
    this.cartService.removeCartItem(id).subscribe({
      next: (res) => {
        this.cartService.numberOfCartItems.set(res.numOfCartItems);
        this.cartDetails.set(res.data);
        this.updatingItemId.set('');
      },
      error: (err) => {
        this.updatingItemId.set('');
      },
    });
  }

  update(id: string, count: number): void {
    this.updatingItemId.set(id);
    this.cartService.ubdateCount(id, count).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.updatingItemId.set('');
      },
      error: (err) => {
        this.updatingItemId.set('');
      },
    });
  }

  confirmClearCart(): void {
    Swal.fire({
      html: `
      <div class="flex flex-col items-center">
        <div class="w-20 h-20 bg-[#FFF1F0] rounded-full flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-[#FF3548]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        
        
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Clear Your Cart?</h3>

        <p class="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            All items will be removed from your cart. This action cannot be undone.
          </p>
      </div>
    `,

      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes, Clear All',
      cancelButtonText: 'Keep Shopping',

      buttonsStyling: false,

      customClass: {
        popup: 'rounded-3xl p-8 shadow-2xl border border-gray-50',
        actions: 'flex justify-center gap-4 mt-10 w-full px-4',
        confirmButton:
          'order-2 whitespace-nowrap bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-red-500/20 flex-1',
        cancelButton:
          'order-1 whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all flex-1',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.clearAllItems();
      }
    });
  }

  clearAllItems(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        this.successDeleted();
        this.cartDetails.set(res.data);
        this.cartService.numberOfCartItems.set(0);
      },
    });
  }
  successDeleted(): void {
    Swal.fire({
      html: `
      <div class="flex flex-col items-center p-2">
        <div class="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h3 class="text-xl font-bold text-[#111827] mb-1">Cart Cleared!</h3>
        <p class="text-[#6B7280] text-sm">Your cart is now empty.</p>
      </div>
    `,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonText: 'Continue Shopping',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-none overflow-hidden',
        confirmButton:
          'w-full bg-[#16A34A] text-white py-3.5 px-8 rounded-xl font-bold text-base hover:bg-[#15803D] transition-all mt-2',
        timerProgressBar: 'bg-[#22C55E]',
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer || result.isConfirmed) {
      }
    });
  }
}
