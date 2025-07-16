import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nairaFormat',
  standalone: true,
})
export class NairaFormat implements PipeTransform {
  transform(value: number | null | undefined, isFree?: boolean): string {
    if (isFree || value === 0 || value == null) {
      return 'Free';
    }

    if (isNaN(value)) {
      return 'Free';
    }

    return `₦${value.toLocaleString()}`;
  }
}
