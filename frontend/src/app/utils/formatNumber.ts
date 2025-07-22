import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true,
})
export class FormatNumber implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value == null || value === '') {
      return '0';
    }

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
      return '0';
    }

    return num.toLocaleString('en-US');
  }
}
