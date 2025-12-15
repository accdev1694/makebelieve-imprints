import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number, currencySymbol: string = '$', decimalPlaces: number = 2): string {
    if (value == null || isNaN(value)) {
      return '';
    }
    return `${currencySymbol}${value.toFixed(decimalPlaces)}`;
  }
}
