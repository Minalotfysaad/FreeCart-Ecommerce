import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss',
})
export class NavBlankComponent implements OnInit, OnDestroy {
  //Injections
  readonly _AuthService = inject(AuthService); //Public to be read in template
  readonly _CartService = inject(CartService);
  readonly _WishlistService = inject(WishlistService);

  //Properties
  getLoggedUserCartSub!: Subscription;
  getLoggedUserWishlistSub!: Subscription;

  ngOnInit(): void {
    this.getLoggedUserCartSub = this._CartService.getLoggedUserCart().subscribe({
      next: (response) => {
        this._CartService.getCartCount(response.numOfCartItems);
      },
    });

    this.getLoggedUserWishlistSub = this._WishlistService.getLoggedUserWishlist().subscribe({
      next: (response) => {
        this._WishlistService.getCartCount(response.count);
      },
    })
  }

  ngOnDestroy(): void {
    this.getLoggedUserCartSub?.unsubscribe();
    this.getLoggedUserWishlistSub?.unsubscribe();
  }
}
