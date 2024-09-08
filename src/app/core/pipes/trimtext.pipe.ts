import { join } from 'node:path';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimtext',
  standalone: true,
})
export class TrimtextPipe implements PipeTransform {
  transform(text: string, limit: number): unknown {
    return text.split(' ', limit).join(' ') + '...';
  }
}
