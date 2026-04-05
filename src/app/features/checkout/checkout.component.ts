import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { ICart } from '../../core/models/ICart/icart.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  private readonly fb = inject(FormBuilder);

  flag = signal<string>('cash');
  isLoading = signal(false);
  cartDetails = signal<ICart>({} as ICart);

  checkOut: FormGroup = this.fb.group({
    shippingAddress: this.fb.group({
      details: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    }),
  });

  cartId = signal<string>('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getCartId();
      this.getCartData();
    }

    this.flag.set('cash');
  }

  setPaymentMethod(method: string): void {
    this.flag.set(method);
  }
  getCartId(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      params.get('id');
      console.log(params.get('id'));
      this.cartId.set(params.get('id')!);
    });
  }

  getCartData() {
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

  submitForm() {
    if (this.checkOut.valid) {
      const method = this.checkOut.value.paymentMethod;

      if (this.flag() === 'cash') {
        this.cartService.createCashOrder(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.router.navigate(['/allorders']);
              this.cartService.numberOfCartItems.set(0);
            }
          },
        });
      } else {
        this.cartService.createVisaOrder(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              window.open(res.session.url, '_self');
              this.cartService.numberOfCartItems.set(0);
            }
          },
        });
      }
    } else {
      this.checkOut.markAllAsTouched();
    }
  }
}
