import { Component, computed, inject, OnInit, PLATFORM_ID, Signal, signal } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../../core/services/myTranslate/my-translate.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly translateService = inject(TranslateService);
  private readonly myTranslateService = inject(MyTranslateService);

  searchTerm: string = '';

  logged = computed(() => this.authService.isLogged());
  user = computed(() => this.authService.currentUser());
  cartItemsNumber: Signal<number> = computed(() => this.cartService.numberOfCartItems());

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('freshToken')) {
        this.authService.isLogged.set(true);
        this.getCartData();
        this.getWishData();
      }
    }

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  changeLanguage(lang: string): void {
    localStorage.setItem('lang', lang);
    this.translateService.use(lang);
    this.myTranslateService.changeDirection();
  }

  wishItemsNumber: Signal<number> = computed(() => this.cartService.numberOfWishItems());

  getCartData() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.numberOfCartItems.set(res.numOfCartItems);
      },
    });
  }
  getWishData() {
    this.cartService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.cartService.numberOfWishItems.set(res.data.length);
      },
    });
  }

  logOut(): void {
    this.authService.signOut();
    this.cartService.numberOfCartItems.set(0);
    this.cartService.numberOfWishItems.set(0);
  }

  onSearch(e: Event) {
    e.preventDefault();

    if (!this.searchTerm.trim()) return;

    this.router.navigate(['/search'], {
      queryParams: {
        keyword: this.searchTerm.trim(),
        page: 1,
      },
    });

    this.searchTerm = '';
  }
}
