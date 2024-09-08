import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  //Injections:
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);

  // Properties:
  ActivatedRouteSub!: Subscription;
  getSepcificProductSub!: Subscription;
  addToCartSub!: Subscription;
  detailsProduct: IProduct | null = null;

  ngOnInit(): void {
    this.ActivatedRouteSub = this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        let idProduct = p.get('id');
        this.getSepcificProductSub = this._ProductsService
          .getSepcificProduct(idProduct)
          .subscribe({
            next: (response) => {
              this.detailsProduct = response.data;
            },
            error: (err) => {
              console.log(err);
            },
          });
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
    this.ActivatedRouteSub?.unsubscribe();
    this.getSepcificProductSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
  }

  // Details Slider Options:
  customOptionsDetails: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-arrow-left-long"></i>',
      '<i class="fa-solid fa-arrow-right-long"></i>',
    ],
    items: 1,
    nav: true,
  };
}
