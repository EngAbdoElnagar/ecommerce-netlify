import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  numberOfCartItems: WritableSignal<number> = signal(0);
  numberOfWishItems: WritableSignal<number> = signal(0);

  createCashOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/orders/${cartId}`, data);
  }

  createVisaOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `/api/v1/orders/checkout-session/${cartId}?url=${environment.url}`,
      data,
    );
  }

  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v2/cart`, {
      productId: id,
    });
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v2/cart`);
  }

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/wishlist`);
  }

  removeCartItem(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart/${id}`);
  }

  ubdateCount(id: string, newCount: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/api/v2/cart/${id}`, { count: newCount });
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart`);
  }
}
