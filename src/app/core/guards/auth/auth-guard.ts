import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const toastr = inject(ToastrService);
  const pLATFORM_ID = inject(PLATFORM_ID);

  if (isPlatformBrowser(pLATFORM_ID)) {
    if (localStorage.getItem("freshToken")) {
    return true;
    } else {
      toastr.error("you need to be logged in to access this page");
      return router.parseUrl("/login")
    }
  } else {
    return true;
  }

};
