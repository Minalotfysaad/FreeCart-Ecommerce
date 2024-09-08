import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ICategory } from '../../core/interfaces/icategory';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  // Injections
  _CategoriesService = inject(CategoriesService);

  //Properties
  categoriesList: ICategory[] = [];
  getAllCategoriesSub!: Subscription;

  ngOnInit(): void {
    this.getAllCategoriesSub = this._CategoriesService
      .getAllCategories()
      .subscribe({
        next: (response) => {
          this.categoriesList = response.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.getAllCategoriesSub?.unsubscribe();
  }
}
