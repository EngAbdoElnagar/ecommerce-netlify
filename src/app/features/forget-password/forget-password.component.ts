import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { SafeToastrService } from '../../core/services/safe-toastr/safe-toastr.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(SafeToastrService);

  isLoading = signal(false);

  step = signal<number>(1);

  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  code: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  Password: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  ]);

  rePassword: FormControl = new FormControl('', [Validators.required]);

  sendResetCode(): void {
    if (this.email.valid) {
      this.isLoading.set(true);
      const data = {
        email: this.email.value,
      };

      this.authService.forgotPassword(data).subscribe({
        next: (res) => {
          this.toastrService.success(res.message);
          this.isLoading.set(false);
          if (res.statusMsg === 'success') {
            this.step.set(2);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
        },
      });
    } else {
      this.email.markAllAsTouched();
    }
  }

  submitEmail(e: Event): void {
    e.preventDefault();

    this.sendResetCode();
  }

  submitCode(e: Event): void {
    e.preventDefault();

    if (this.code.valid) {
      this.isLoading.set(true);
      const data = {
        resetCode: this.code.value,
      };
      this.authService.verifyResetCode(data).subscribe({
        next: (res) => {
          this.toastrService.success(res.status);
          this.isLoading.set(false);
          if (res.status === 'Success') {
            this.step.set(3);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
        },
      });
    } else {
      this.code.markAllAsTouched();
    }
  }

  submitPassword(e: Event): void {
    e.preventDefault();

    this.Password.markAsTouched();
    this.rePassword.markAsTouched();
    this.confirmPassword();

    if (this.Password.valid && this.rePassword.valid) {
      this.isLoading.set(true);
      const data = {
        email: this.email.value,
        newPassword: this.Password.value,
      };
      this.authService.resetPassword(data).subscribe({
        next: (res) => {
          this.toastrService.success('Chaning Password');
          this.isLoading.set(false);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
        },
      });
    }
  }

  resendCode(e: Event) {
    e.preventDefault();
    this.sendResetCode();
  }

  changeEmail(e: Event): void {
    e.preventDefault();
    this.step.set(1);
  }

  confirmPassword() {
    const password = this.Password.value;
    const rePassword = this.rePassword.value;

    if (rePassword !== password && rePassword !== '') {
      this.rePassword.setErrors({ mismatch: true });
    } else if (rePassword === password && rePassword !== '') {
      this.rePassword.setErrors(null);
    }
  }
}
