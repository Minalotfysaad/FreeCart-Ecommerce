import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TrimtextPipe } from '../../core/pipes/trimtext.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, TrimtextPipe, SearchPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  // Injections
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  readonly _WishlistService = inject(WishlistService);

  //Inputs
  @Input() limit!: number | null;
  @Input() searchTerm: string = '';

  //Properties
  productsList: IProduct[] = [];
  getAllProductsSub!: Subscription;
  addToCartSub!: Subscription;
  addProducttoWishlistSub!: Subscription;

  //Getters
  get displayedProducts() {
    return this.limit
      ? this.productsList.slice(0, this.limit)
      : this.productsList;
  }

  ngOnInit(): void {
    this.getAllProductsSub = this._ProductsService.getAllProducts().subscribe({
      next: (response) => {
        this.productsList = response.data;
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

  addToWishlist(id: string) {
    this.addProducttoWishlistSub = this._WishlistService
      .addProducttoWishlist(id)
      .subscribe({
        next: (response) => {
          console.log(response);
          this._ToastrService.success(response.message, 'FreshCart');
          this._WishlistService.getCartCount(response.data.length);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.getAllProductsSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
    this.addProducttoWishlistSub?.unsubscribe();
  }
}
