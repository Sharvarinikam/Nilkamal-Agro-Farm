import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderData {
  name: string;
  phone: string;
  email: string;
  city?: string;
  variety: string;
  qty: number;
  message?: string;
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
    return this.http.post<EmailResponse>(`${this.apiUrl}/send-order`, orderData);
  }
}
