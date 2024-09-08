import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit, OnDestroy {
  //Injections
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _OrdersService = inject(OrdersService);

  //Properties
  isLoading: boolean = false;
  ActivatedRouteSub!: Subscription;
  checkoutSessionSub!: Subscription;
  idCart!: string | null;

  ngOnInit(): void {
    this.ActivatedRouteSub = this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        this.idCart = p.get('id');
        console.log(this.idCart);
      },
    });
  }

  //Order Form
  orderForm = this._FormBuilder.group({
    details: [null, [Validators.required]],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
    ],
    city: [null, [Validators.required]],
  });

  orderSubmit() {
    if (this.orderForm.valid) {
      this._OrdersService
        .checkoutSession(this.idCart!, this.orderForm.value)
        .subscribe({
          next: (response) => {
            console.log(response);
            if(response.status == 'success'){
              window.open(response.session.url, '_self');
            }

          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.ActivatedRouteSub?.unsubscribe();
    this.checkoutSessionSub?.unsubscribe();
  }
}
