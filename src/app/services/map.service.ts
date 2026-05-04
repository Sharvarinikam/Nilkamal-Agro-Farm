import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formatted?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

  constructor(private http: HttpClient) {}

  /**
   * Get user's current location using browser geolocation.
   * Pass custom PositionOptions to override defaults (e.g. for faster initial load).
   */
  getCurrentLocation(options?: Partial<PositionOptions>): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        reject(new Error('Geolocation requires HTTPS in production environments.'));
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000 // 1 minute — fresh enough, fast enough
      };

      navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            let errorMessage = 'Unable to retrieve location.';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable. Please check your device settings.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out. Please try again.';
                break;
              default:
                errorMessage = `Location error: ${error.message}`;
            }
            reject(new Error(errorMessage));
          },
          { ...defaultOptions, ...options }
      );
    });
  }

  /**
   * Convert coordinates to a formatted address using reverse geocoding.
   */
  reverseGeocode(coordinates: Coordinates): Observable<Address> {
    const url = `${this.NOMINATIM_URL}/reverse`;
    const params = {
      format: 'json',
      lat: coordinates.lat.toString(),
      lon: coordinates.lng.toString(),
      addressdetails: '1',
      zoom: '18',
      'accept-language': 'en',
      extratags: '1',
      namedetails: '1',
      polygon_geojson: '0'
    };

    return this.http.get<any>(url, { params }).pipe(
        map(response => {
          if (response && response.address) {
            const addr = response.address;
            return {
              street: this.formatStreetAddress(addr),
              city: addr.city || addr.town || addr.village || addr.suburb,
              state: addr.state || addr.county,
              country: addr.country,
              postalCode: addr.postcode,
              formatted: this.buildStructuredAddress(addr) || response.display_name
            } as Address;
          }
          return { formatted: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}` };
        }),
        catchError(() => {
          return of({ formatted: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}` });
        })
    );
  }

  /**
   * Search for locations by address string.
   */
  searchAddress(query: string): Observable<{ coordinates: Coordinates; address: Address }[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }

    const url = `${this.NOMINATIM_URL}/search`;
    const params = {
      format: 'json',
      q: query.trim(),
      addressdetails: '1',
      limit: '5',
      countrycodes: 'in',
      'accept-language': 'en',
      extratags: '1',
      namedetails: '1'
    };

    return this.http.get<any[]>(url, { params }).pipe(
        map(results => {
          if (!Array.isArray(results)) return [];
          return results.map(item => ({
            coordinates: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
            address: {
              street: this.formatStreetAddress(item.address),
              city: item.address?.city || item.address?.town || item.address?.village,
              state: item.address?.state,
              country: item.address?.country,
              postalCode: item.address?.postcode,
              formatted: this.buildStructuredAddress(item.address) || item.display_name || `${item.lat}, ${item.lon}`
            } as Address
          }));
        }),
        catchError(() => of([]))
    );
  }

  private formatStreetAddress(address: any): string {
    if (!address) return '';
    const parts: string[] = [];
    if (address.house_number) parts.push(address.house_number);
    if (address.building)     parts.push(address.building);
    if (address.apartment)    parts.push(`Apt ${address.apartment}`);
    if (address.floor)        parts.push(`Floor ${address.floor}`);
    if (address.unit)         parts.push(`Unit ${address.unit}`);
    if (address.road)         parts.push(address.road);
    if (address.street)       parts.push(address.street);
    if (address.pedestrian)   parts.push(address.pedestrian);
    if (address.footway)      parts.push(address.footway);
    if (address.suburb)       parts.push(address.suburb);
    if (address.neighbourhood) parts.push(address.neighbourhood);
    if (address.district)     parts.push(address.district);
    return parts.join(', ');
  }

  /**
   * Build a detailed, hierarchical address string from OSM address components.
   * Always preferred over raw display_name.
   */
  buildStructuredAddress(address: any): string {
    if (!address) return '';
    const parts: string[] = [];

    // 1. Unit / flat / floor / building
    const unitParts: string[] = [];
    if (address.apartment)    unitParts.push(`Apt ${address.apartment}`);
    if (address.unit)         unitParts.push(`Unit ${address.unit}`);
    if (address.floor)        unitParts.push(`Floor ${address.floor}`);
    if (address.house_number) unitParts.push(address.house_number);
    if (address.building)     unitParts.push(address.building);
    if (unitParts.length)     parts.push(unitParts.join(', '));

    // 2. Street / road
    const streetParts: string[] = [];
    if (address.road)        streetParts.push(address.road);
    if (address.street)      streetParts.push(address.street);
    if (address.pedestrian)  streetParts.push(address.pedestrian);
    if (address.footway)     streetParts.push(address.footway);
    if (streetParts.length)  parts.push(streetParts.join(', '));

    // 3. Micro-locality (colony, sector, block, phase)
    const localityParts: string[] = [];
    if (address.residential)   localityParts.push(address.residential);
    if (address.neighbourhood) localityParts.push(address.neighbourhood);
    if (address.quarter)       localityParts.push(address.quarter);
    if (address.hamlet)        localityParts.push(address.hamlet);
    if (address.locality)      localityParts.push(address.locality);
    if (localityParts.length)  parts.push(localityParts.join(', '));

    // 4. Suburb / area / district
    const areaParts: string[] = [];
    if (address.suburb)      areaParts.push(address.suburb);
    if (address.subdistrict) areaParts.push(address.subdistrict);
    if (address.district)    areaParts.push(address.district);
    if (address.borough)     areaParts.push(address.borough);
    if (areaParts.length)    parts.push(areaParts.join(', '));

    // 5. Landmark / POI
    const poiParts: string[] = [];
    if (address.amenity) poiParts.push(address.amenity);
    if (address.shop)    poiParts.push(address.shop);
    if (address.tourism) poiParts.push(address.tourism);
    if (address.place)   poiParts.push(address.place);
    if (poiParts.length) parts.push(poiParts.join(', '));

    // 6. City / town / village
    const cityVal = address.city || address.town || address.village
        || address.city_district || address.municipality;
    if (cityVal) parts.push(cityVal);

    // 7. County / tehsil (critical for Indian addresses)
    if (address.county) parts.push(address.county);

    // 8. State
    if (address.state) parts.push(address.state);

    // 9. Postal code
    const pincode = address.postcode || address.postal_code || address.zip;
    if (pincode) parts.push(pincode);

    // 10. Country
    if (address.country) parts.push(address.country);

    return parts.filter(Boolean).join(', ');
  }

  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371;
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  isWithinIndia(coordinates: Coordinates): boolean {
    return coordinates.lat >= 6.5 && coordinates.lat <= 37.5 &&
        coordinates.lng >= 68.0 && coordinates.lng <= 97.5;
  }
}