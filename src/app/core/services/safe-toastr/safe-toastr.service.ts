import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SafeToastrService {
  private platformId = inject(PLATFORM_ID);
  private toastr = isPlatformBrowser(this.platformId) ? inject(ToastrService) : null;

  success(message?: string, title?: string, override?: any) {
    this.toastr?.success(message, title, override);
  }

  error(message?: string, title?: string, override?: any) {
    this.toastr?.error(message, title, override);
  }

  warning(message?: string, title?: string, override?: any) {
    this.toastr?.warning(message, title, override);
  }

  info(message?: string, title?: string, override?: any) {
    this.toastr?.info(message, title, override);
  }

  clear() {
    this.toastr?.clear();
  }
}
