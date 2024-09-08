import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/iproduct';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(productList: IProduct[], searchTerm: string): IProduct[] {
    return productList.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
