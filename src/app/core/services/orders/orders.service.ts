import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient);

  createCashOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/orders/${cartId}`, data);
  }

  createVisaOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `/api/v1/orders/checkout-session/${cartId}?url=${environment.url}`,
      data,
    );
  }

  getUserOrders(orderId: string) {
    return this.httpClient.get(environment.baseUrl + `/api/v1/orders/user/${orderId}`);
  }
}
