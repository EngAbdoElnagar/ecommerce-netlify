import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { SafeToastrService } from '../../core/services/safe-toastr/safe-toastr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(SafeToastrService);
  private readonly router = inject(Router);

  isLoading = signal(false);

  changePassword: FormGroup = this.fb.group(
    {
      currentPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', [Validators.required]],
    },
    { validators: [this.confirmPassword] },
  );

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    const rePasswordControl = group.get('rePassword');

    if (!rePasswordControl) return null;

    if (rePassword !== password && rePassword !== '') {
      rePasswordControl.setErrors({ ...rePasswordControl.errors, mismatch: true });
      return { mismatch: true };
    } else {
      const errors = rePasswordControl.errors;
      if (errors) {
        delete errors['mismatch'];
        rePasswordControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  }

  submitForm(event: Event) {
    event.preventDefault();
    if (this.changePassword.valid) {
      const formData = this.changePassword.value;
      this.isLoading.set(true);
      console.log(this.changePassword.value);
      this.authService.updateLoggedUserPassword(formData).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.toastr.success('change pass success');
          this.authService.signOut();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toastr.error('fail');
        },
      });
    } else {
      this.changePassword.markAllAsTouched();
    }
  }
}
