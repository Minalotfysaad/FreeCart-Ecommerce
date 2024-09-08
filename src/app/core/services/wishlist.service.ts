import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly _HttpClient = inject(HttpClient);
  myHeaders: any = { token: localStorage.getItem('userToken') };
  wishlistCount: number = 0;
  addProducttoWishlist(id: string): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/wishlist`,
      { productId: id },
      { headers: this.myHeaders }
    );
  }

  getLoggedUserWishlist(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/wishlist`, {
      headers: this.myHeaders,
    });
  }

  removeProductFromWishlist(id: string): Observable<any> {
    return this._HttpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${id}`,
      {
        headers: this.myHeaders,
      }
    );
  }

  getCartCount(count: number): void {
    this.wishlistCount = count;
  }
}
