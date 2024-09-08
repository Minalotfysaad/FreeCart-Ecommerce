import { CartService } from './../../core/services/cart.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICart } from '../../core/interfaces/icart';
import { log } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  //Injections
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);

  //Properties
  cartDetails: ICart = {} as ICart;
  getLoggedUserCartSub!: Subscription;
  removeSpecificProductFromCartSub!: Subscription;
  updateCartProductQuantity!: Subscription;
  clearUserCartSub!: Subscription;

  ngOnInit(): void {
    this.getLoggedUserCartSub = this._CartService
      .getLoggedUserCart()
      .subscribe({
        next: (response) => {
          this.cartDetails = response.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  removeFromCart(id: string) {
    this.removeSpecificProductFromCartSub = this._CartService
      .removeSpecificProductFromCart(id)
      .subscribe({
        next: (response) => {
          this._ToastrService.success('Item removed from cart', 'FreshCart');
          console.log(response);
          this.cartDetails = response.data;
          this._CartService.getCartCount(response.numOfCartItems);
        },
      });
  }

  updateCart(id: string, newCount: number) {
    this.updateCartProductQuantity = this._CartService
      .updateCartProductQuantity(id, newCount)
      .subscribe({
        next: (response) => {
          this._ToastrService.success('Item quantity updated', 'FreshCart');
          this.cartDetails = response.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  clearCart() {
    this.clearUserCartSub = this._CartService.clearUserCart().subscribe({
      next: (response) => {
        console.log(response);
        if (response.message === 'success') {
          this._ToastrService.success('Cart cleared successfully', 'FreshCart');
          this.cartDetails.products = [];
          this._CartService.getCartCount(response.numOfCartItems);
        }
      },
      error: (err) => {
        this._ToastrService.error(err.error.message, 'FreshCart');
      },
    });
  }
  ngOnDestroy(): void {
    this.getLoggedUserCartSub?.unsubscribe();
    this.removeSpecificProductFromCartSub?.unsubscribe();
    this.updateCartProductQuantity?.unsubscribe();
    this.clearUserCartSub?.unsubscribe();
  }
}
