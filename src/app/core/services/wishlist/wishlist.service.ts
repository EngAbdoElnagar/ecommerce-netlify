import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);

  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/wishlist`, {
      productId: id,
    });
  }

  removeProductFromWishlist(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v1/wishlist/${id}`);
  }

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/wishlist`);
  }
}
