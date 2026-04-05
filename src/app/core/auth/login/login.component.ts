import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { SafeToastrService } from '../../services/safe-toastr/safe-toastr.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly toastr = inject(SafeToastrService);

  isLoading = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ],
    ],
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      console.log(this.loginForm.value);
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === 'success') {
            this.isLoading.set(false);
            localStorage.setItem('freshToken', res.token);
            localStorage.setItem('freshUser', JSON.stringify(res.user));
            this.authService.currentUser.set(res.user);
            this.authService.isLogged.set(true);
            this.router.navigate(['/']);
            this.getCartData();
            this.toastr.success('Login successful');
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  getCartData() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.data);
        this.cartService.numberOfCartItems.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
