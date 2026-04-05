import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { SafeToastrService } from '../../services/safe-toastr/safe-toastr.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Reqest
  
  // const toastrService = inject(ToastrService); 
  const toastrService = inject(SafeToastrService); 
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(catchError((err) => {

    if (isPlatformBrowser(platformId)) {
      // toastrService.error(err.error.message);
      
    }
    // toastrService.error(err.error.message);
    
    return throwError( ()=>err )
  }) ); // Res
};
