import { isPlatformBrowser, NgClass } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { IProducts } from '../../core/models/IProducts/IProducts.interface';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ProductsService } from '../../core/services/products/products.service';
import { SafeToastrService } from '../../core/services/safe-toastr/safe-toastr.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { SharedCardComponent } from '../../shared/components/shared-card/shared-card.component';
import { CartService } from './../../core/services/cart/cart.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-delails',
  imports: [NgClass, SectionTitleComponent, SharedCardComponent, TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-delails.component.html',
  styleUrl: './product-delails.component.css',
})
export class ProductDelailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly categoryService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(SafeToastrService);
  private readonly wishlistService = inject(WishlistService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  isLoading = signal(false);
  loadingId = signal<string | null>(null);
  successId = signal<string>('');
  updatingItemId = signal<string>('');
  productDetails = signal<IProducts>({} as IProducts);
  productList = signal<IProducts[]>([]);
  maxAvailable = signal<number>(0);
  count = signal<number>(1);
  wishlistLoadingId = signal<string | null>(null);
  wishlistIds = signal<string[]>([]);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getProductDetalis(id);
      }
    });
    register();
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('freshToken')) {
        this.loadUserWishlist();
      }
    }
  }

  getProductDetalis(id: string): void {
    this.isLoading.set(true);
    this.productsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        this.productDetails.set(res.data);
        this.maxAvailable.set(res.data.quantity);
        this.count.set(1);
        this.isLoading.set(false);
        this.getProductsCategory(this.productDetails().category._id);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }

  getProductsCategory(id: string) {
    this.categoryService.getProductsByCategory(id).subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
    });
  }

  swiperConfig: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: true,
    loop: true,
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 4 },
    },
  };

  addProduct(id: string) {
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

  increment() {
    this.count.update((value) => (value < this.maxAvailable() ? value + 1 : value));
  }

  decrement() {
    this.count.update((value) => (value > 1 ? value - 1 : value));
  }

  updateCount(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);

    if (value < 1) {
      this.count.set(1);
    } else if (value > this.maxAvailable()) {
      this.count.set(this.maxAvailable());
    } else {
      this.count.set(value);
    }
  }

  activeTab: string = 'details';

  setActiveTab(tab: string) {
    this.activeTab = tab;
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
    return this.wishlistIds().includes(this.productDetails()._id);
  }

  wishlistLoading(): boolean {
    return this.wishlistLoadingId() === this.productDetails()._id;
  }
}
