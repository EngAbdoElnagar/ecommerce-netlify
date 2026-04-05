import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SafeToastrService } from '../../services/safe-toastr/safe-toastr.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(SafeToastrService);

  isLoading = signal(false);
  accountExists = signal<boolean>(false);

  registerForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    },
    { validators: [this.confirmPassword] },
  );

  submitForm(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.toastr.success('Account created successfully');
          if (res.message === 'success') {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.error?.message === 'Account Already Exists') {
            this.accountExists.set(true);
          } else {
            this.accountExists.set(false);
          }
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (rePassword !== password && rePassword !== '') {
      group.get('rePassword')?.setErrors({ mismatch: true });

      return { mismatch: true };
    }
    return null;
  }
}
