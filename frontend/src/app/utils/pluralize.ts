import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralize',
  standalone: true,
})
export class Pluralize implements PipeTransform {
  transform(count: number, singular: string, plural?: string): string {
    if (typeof count !== 'number') {
      return '';
    }

    const word = count === 1 ? singular : plural || `${singular}s`;
    return `${count} ${word}`;
  }
}
