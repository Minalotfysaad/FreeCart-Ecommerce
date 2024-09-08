import { Component, inject, OnInit } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { CategoriesSliderComponent } from "../categories-slider/categories-slider.component";
import { MainSliderComponent } from "../main-slider/main-slider.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductsComponent, CategoriesSliderComponent, MainSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

}
