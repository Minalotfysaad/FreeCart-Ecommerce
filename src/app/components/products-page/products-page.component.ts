import { Component } from '@angular/core';
import { ProductsComponent } from "../products/products.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductsComponent, FormsModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent {

  searchTerm: string = '';

}
