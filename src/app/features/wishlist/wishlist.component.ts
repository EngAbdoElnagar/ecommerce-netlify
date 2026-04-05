import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProducts } from '../../core/models/IProducts/IProducts.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { SafeToastrService } from '../../core/services/safe-toastr/safe-toastr.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, NgClass, LoadingComponent, TranslatePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  public readonly cartService = inject(CartService);
  private readonly toastr = inject(SafeToastrService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  wishlistItems = signal<IProducts[]>([]);
  isLoading = signal(false);
  loadingId = signal<string | null>(null);
  successId = signal<string>('');
  isAddedToCart = signal(false);
  wishlistIds = signal<string[]>([]);
  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getWishlist();
    }
  }

  getWishlist(): void {
    this.isLoading.set(true);
    if (localStorage.getItem('freshToken')) {
      this.wishlistService.getLoggedUserWishlist().subscribe({
        next: (res) => {
          this.wishlistItems.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
        },
      });
    }
  }

  addProduct(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.loadingId.set(id);
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.cartService.numberOfCartItems.set(res.numOfCartItems);
          this.loadingId.set(null);
          this.isAddedToCart.set(true);
        },
        error: (err) => {
          this.loadingId.set(null);
        },
      });
    } else {
      this.toastr.warning('Login First');
    }
  }

  removeFormWishlist(id: string): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('freshToken')) {
        this.wishlistService.removeProductFromWishlist(id).subscribe({
          next: (res) => {
            this.toastr.success(res.message);
            this.wishlistItems.update((items) => items.filter((product) => product._id !== id));
            this.cartService.numberOfWishItems.set(this.wishlistIds().length);
          },
        });
      } else {
        this.toastr.warning('Login First');
      }
    }
  }
}
