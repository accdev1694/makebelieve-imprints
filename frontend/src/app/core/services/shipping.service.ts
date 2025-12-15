import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ShippingMethod, Address, CartItem } from '../../models';

interface ShippingRatesRequest {
  items: { productId: string; quantity: number }[];
  destination: Partial<Address>;
}

interface ShippingCountry {
  code: string;
  name: string;
  zone: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shipping`;

  /**
   * Get available shipping methods based on cart items and destination
   */
  getShippingRates(items: CartItem[], destination: Partial<Address>): Observable<ShippingMethod[]> {
    const request: ShippingRatesRequest = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      destination: {
        country: destination.country,
        zipCode: destination.zipCode,
        city: destination.city,
        state: destination.state,
      },
    };

    return this.http
      .post<{ success: boolean; data: ShippingMethod[] }>(`${this.apiUrl}/rates`, request)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error fetching shipping rates:', error);
          // Return mock rates as fallback
          return of(this.getMockShippingRates(destination.country === 'GB'));
        })
      );
  }

  /**
   * Get list of countries that support shipping
   */
  getShippingCountries(): Observable<ShippingCountry[]> {
    return this.http
      .get<{ success: boolean; data: ShippingCountry[] }>(`${this.apiUrl}/countries`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error fetching countries:', error);
          return of(this.getDefaultCountries());
        })
      );
  }

  /**
   * Track a shipment by tracking number
   */
  trackShipment(trackingNumber: string): Observable<any> {
    return this.http
      .get<{ success: boolean; data: any }>(`${this.apiUrl}/track/${trackingNumber}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error tracking shipment:', error);
          return of(null);
        })
      );
  }

  /**
   * Check if destination is international (non-UK)
   */
  isInternational(country: string): boolean {
    return !!country && country !== 'GB';
  }

  /**
   * Get mock shipping rates for development/fallback
   */
  private getMockShippingRates(isUK: boolean): ShippingMethod[] {
    if (isUK) {
      return [
        {
          id: 'RM_48',
          name: 'Royal Mail Tracked 48',
          description: 'Tracked delivery in 2-3 working days',
          price: 3.35,
          estimatedDays: '2-3 working days',
        },
        {
          id: 'RM_24',
          name: 'Royal Mail Tracked 24',
          description: 'Tracked next day delivery',
          price: 5.65,
          estimatedDays: '1 working day',
        },
        {
          id: 'RM_SD_1PM',
          name: 'Special Delivery by 1pm',
          description: 'Guaranteed delivery by 1pm next working day',
          price: 8.25,
          estimatedDays: 'Next day by 1pm',
        },
      ];
    }

    return [
      {
        id: 'RM_INTL_STANDARD',
        name: 'Royal Mail International Standard',
        description: 'Untracked international delivery in 5-7 working days',
        price: 8.5,
        estimatedDays: '5-7 working days',
      },
      {
        id: 'RM_INTL_TRACKED',
        name: 'Royal Mail International Tracked',
        description: 'Tracked international delivery in 3-5 working days',
        price: 15.5,
        estimatedDays: '3-5 working days',
      },
      {
        id: 'RM_INTL_SIGNED',
        name: 'Royal Mail International Tracked & Signed',
        description: 'Tracked and signed international delivery',
        price: 18.95,
        estimatedDays: '3-5 working days',
      },
    ];
  }

  /**
   * Get default list of shipping countries
   */
  private getDefaultCountries(): ShippingCountry[] {
    return [
      { code: 'GB', name: 'United Kingdom', zone: 'UK' },
      { code: 'IE', name: 'Ireland', zone: 'Europe' },
      { code: 'FR', name: 'France', zone: 'Europe' },
      { code: 'DE', name: 'Germany', zone: 'Europe' },
      { code: 'ES', name: 'Spain', zone: 'Europe' },
      { code: 'IT', name: 'Italy', zone: 'Europe' },
      { code: 'NL', name: 'Netherlands', zone: 'Europe' },
      { code: 'BE', name: 'Belgium', zone: 'Europe' },
      { code: 'US', name: 'United States', zone: 'World Zone 1' },
      { code: 'CA', name: 'Canada', zone: 'World Zone 1' },
      { code: 'AU', name: 'Australia', zone: 'World Zone 2' },
      { code: 'NZ', name: 'New Zealand', zone: 'World Zone 2' },
      { code: 'JP', name: 'Japan', zone: 'World Zone 2' },
      { code: 'SG', name: 'Singapore', zone: 'World Zone 2' },
    ];
  }
}
