import { Component, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { IProducts } from '../../../core/models/IProducts/IProducts.interface';
import { CartService } from '../../../core/services/cart/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { SafeToastrService } from '../../../core/services/safe-toastr/safe-toastr.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-shared-card',
  imports: [NgClass, RouterLink, TranslatePipe],
  templateUrl: './shared-card.component.html',
  styleUrl: './shared-card.component.css',
})
export class SharedCardComponent implements OnInit {
  data = input.required<IProducts>();
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(SafeToastrService);
  private readonly wishlistService = inject(WishlistService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);

  loadingId = signal<string | null>(null);
  successId = signal<string>('');

  wishlistLoadingId = signal<string | null>(null);
  wishlistIds = signal<string[]>([]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (this.authService.isLogged()) {
        this.loadUserWishlist();
      }
    }
  }

  addProduct(id: string) {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('freshToken')) {
        this.loadingId.set(id);
        this.successId.set('');
        this.cartService.addProductToCart(id).subscribe({
          next: (res) => {
            this.toastr.success(res.message);
            this.cartService.numberOfCartItems.set(res.numOfCartItems);
            this.loadingId.set(null);
            this.successId.set(id);
            setTimeout(() => {
              this.successId.set('');
            }, 1500);
          },
          error: (err) => {
            this.loadingId.set(null);
            setTimeout(() => {
              this.successId.set('');
            }, 1500);
          },
        });
      } else {
        this.toastr.warning('login First');
      }
    }
  }

  addWishlist(id: string): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('freshToken')) {
        this.wishlistLoadingId.set(id);
        this.wishlistService.addProductToWishlist(id).subscribe({
          next: (res) => {
            this.toastr.success(res.message);
            this.wishlistLoadingId.set(null);
            this.wishlistIds.update((ids) => [...ids, id]);
            this.cartService.numberOfWishItems.set(this.wishlistIds().length);
          },
          error: (err) => {
            this.wishlistLoadingId.set(null);
          },
        });
      } else {
        this.toastr.warning('Login First');
      }
    }
  }

  removeFormWishlist(id: string): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('freshToken')) {
        this.wishlistLoadingId.set(id);
        this.wishlistService.removeProductFromWishlist(id).subscribe({
          next: (res) => {
            this.toastr.success(res.message);
            this.wishlistLoadingId.set(null);
            this.wishlistIds.update((ids) => ids.filter((itemId) => itemId !== id));
            this.cartService.numberOfWishItems.set(this.wishlistIds().length);
          },
          error: (err) => {
            this.wishlistLoadingId.set(null);
          },
        });
      } else {
        this.toastr.warning('Login First');
      }
    }
  }

  loadUserWishlist(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        const ids = res.data.map((item: any) => item._id);
        this.wishlistIds.set(ids);
        this.cartService.numberOfWishItems.set(res.data.length);
      },
      error: (err) => {
        this.cartService.numberOfWishItems.set(0);
      },
    });
  }

  wishlistSuccess(): boolean {
    return this.wishlistIds().includes(this.data()._id);
  }

  wishlistLoading(): boolean {
    return this.wishlistLoadingId() === this.data()._id;
  }

  protected readonly Math = Math;
}
