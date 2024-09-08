import { Component, inject } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { Subscription } from 'rxjs';
import { log } from 'console';
import { IBrand } from '../../core/interfaces/ibrand';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent {
  // Injections
  _CategoriesService = inject(BrandsService);

  //Properties
  BrandsList: IBrand[] = [];
  getAllBrandsSub!: Subscription;

  ngOnInit(): void {
    this.getAllBrandsSub = this._CategoriesService.getAllBrands().subscribe({
      next: (response) => {
        this.BrandsList = response.data;
        console.log(response.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnDestroy(): void {
    this.getAllBrandsSub?.unsubscribe();
  }
}
