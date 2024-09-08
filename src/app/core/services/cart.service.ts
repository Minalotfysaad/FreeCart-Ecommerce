import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _HttpClient = inject(HttpClient);
  myHeaders: any = { token: localStorage.getItem('userToken') };
  cartCount: number = 0;
  addProdcutToCart(id: string): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/cart`,
      { productId: id },
      { headers: this.myHeaders }
    );
  }

  getLoggedUserCart(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/cart`, {
      headers: this.myHeaders,
    });
  }

  removeSpecificProductFromCart(id: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`, {
      headers: this.myHeaders,
    });
  }

  updateCartProductQuantity(id: string, newCount: number): Observable<any> {
    return this._HttpClient.put(
      `${environment.baseUrl}/api/v1/cart/${id}`,
      { count: newCount },
      { headers: this.myHeaders }
    );
  }
  clearUserCart(): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart`, {
      headers: this.myHeaders,
    });
  }

  getCartCount(count: number): void {
    this.cartCount = count;
  }
}
