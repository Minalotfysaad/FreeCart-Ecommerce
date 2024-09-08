import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';
import { IWishlist } from '../../core/interfaces/iwishlist';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit, OnDestroy {
  //Injections
  private readonly _WishlistService = inject(WishlistService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _CartService = inject(CartService);

  //Properties
  getLoggedUserWishlistSub!: Subscription;
  removeFromWishlistSub!: Subscription;
  addToCartSub!: Subscription;
  wishList: IWishlist[] = [];

  ngOnInit(): void {
    this.getLoggedUserWishlistSub = this._WishlistService
      .getLoggedUserWishlist()
      .subscribe({
        next: (response) => {
          console.log(response);
          this.wishList = response.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  removeFromWishlist(id: string) {
    this.removeFromWishlistSub = this._WishlistService.removeProductFromWishlist(id).subscribe({
      next: (response) => {
        this._ToastrService.success('Item removed from wishlist', 'FreshCart');
        this._WishlistService.getLoggedUserWishlist().subscribe({
          next: (response) => {
            this.wishList = response.data;
            this._WishlistService.getCartCount(response.count);
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  addToCart(id: string) {
    this.addToCartSub = this._CartService.addProdcutToCart(id).subscribe({
      next: (response) => {
        console.log(response);
        this._ToastrService.success(response.message, 'FreshCart');
        this._CartService.getCartCount(response.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnDestroy(): void {
    this.getLoggedUserWishlistSub?.unsubscribe();
    this.removeFromWishlistSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
  }
}
