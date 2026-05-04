import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderData {
  name: string;
  phone: string;
  email: string;
  address?: string;
  variety: string;
  qty: number;
  message?: string;
  location?: { coordinates: any; address: any };
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  sendOrder(orderData: OrderData): Observable<EmailResponse> {
    // Add map link and snapshot to order data
    const enrichedData = {
      ...orderData,
      mapLink: this.generateMapLink(orderData.location),
      mapSnapshot: this.generateMapSnapshot(orderData.location)
    };
    
    return this.http.post<EmailResponse>(`${this.apiUrl}/send-order`, enrichedData);
  }

  private generateMapLink(location?: { coordinates: any; address: any }): string {
    if (!location || !location.coordinates) return '';
    
    const { lat, lng } = location.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}&z=16`;
  }

  private generateMapSnapshot(location?: { coordinates: any; address: any }): string {
    if (!location || !location.coordinates) return '';
    
    const { lat, lng } = location.coordinates;
    const address = location.address?.formatted || 'Selected Location';
    
    return `📍 ${address}\n🗺️ View on map: https://www.google.com/maps?q=${lat},${lng}&z=16\n📊 Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}
