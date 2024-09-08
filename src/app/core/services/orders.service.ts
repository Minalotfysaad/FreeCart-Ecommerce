import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  //Injections
  private readonly _HttpClient = inject(HttpClient);

  //Properties
  myHeaders: any = { token: localStorage.getItem('userToken') };

  checkoutSession(idCart: string, shipDetails: any): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${idCart}?url=${environment.serverUrl}`,
      {
        shippingAddress: shipDetails,
      },
      {
        headers: this.myHeaders,
      }
    );
  }
}
