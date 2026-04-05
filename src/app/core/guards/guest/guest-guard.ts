import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const guestGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const toastr = inject(ToastrService);
  const pLATFORM_ID = inject(PLATFORM_ID);

  if (isPlatformBrowser(pLATFORM_ID)) {
    if (localStorage.getItem("freshToken")) {
      toastr.info("You are already logged in");
      return router.parseUrl("/");
    } else {
      return true;
    }
  } else {
    return true;
  }
};
