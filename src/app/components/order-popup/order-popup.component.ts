import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { EmailService, OrderData } from '../../services/email.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { MapModalComponent } from '../map-modal/map-modal.component';

@Component({
  selector: 'app-order-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TranslateModule, MapModalComponent],
  template: `
    <div class="order-popup-overlay" [class.active]="isVisible" (click)="closeOnOverlay($event)">
      <div class="order-popup" [class.active]="isVisible">
        <button class="order-popup__close" (click)="closePopup()" aria-label="Close">
          <span>×</span>
        </button>
        
        <div class="order-popup__header">
          <div class="order-popup__emoji">🥭</div>
          <h2>{{ 'POPUP.TITLE' | translate }}</h2>
          <p>{{ 'POPUP.SUBTITLE' | translate }}</p>
        </div>

        <form class="order-popup__form" (ngSubmit)="onSubmit()">
          <div class="order-popup__fields">
            <div class="order-popup__row">
              <div class="order-popup__field">
                <label>{{ 'POPUP.FULL_NAME' | translate }} <span class="required">*</span></label>
                <input 
                  type="text" 
                  [(ngModel)]="form.name" 
                  name="name" 
                  required
                  placeholder="John Doe"
                >
              </div>

              <div class="order-popup__field">
                <label>{{ 'POPUP.PHONE' | translate }} <span class="required">*</span></label>
                <input 
                  type="tel" 
                  [(ngModel)]="form.phone" 
                  name="phone" 
                  required
                  placeholder="+91 98765 43210"
                >
              </div>
            </div>

            <div class="order-popup__row">
              <div class="order-popup__field">
                <label>{{ 'POPUP.EMAIL' | translate }} <span class="required">*</span></label>
                <input 
                  type="email" 
                  [(ngModel)]="form.email" 
                  name="email"
                  required
                  placeholder="john@example.com"
                >
              </div>

              <div class="order-popup__field">
                <label>{{ 'POPUP.ADDRESS' | translate }}</label>
                <div class="order-popup__address-group">
                  <input 
                    type="text" 
                    [(ngModel)]="form.address" 
                    name="address" 
                    placeholder="Enter your complete delivery address"
                    class="order-popup__address-input"
                  >
                  <button type="button" class="order-popup__map-btn" (click)="openMapModal()">
                    <span>🗺️</span> Select on Map
                  </button>
                </div>
              </div>
            </div>

            <div class="order-popup__row">
              <div class="order-popup__field">
                <label>{{ 'POPUP.VARIETY' | translate }} <span class="required">*</span></label>
                <select [(ngModel)]="form.variety" name="variety" required>
                  <option value="">{{ 'POPUP.SELECT_VARIETY' | translate }}</option>
                  <option value="alphonso">{{ 'POPUP.ALPHONSO' | translate }}</option>
                  <option value="kesar">{{ 'POPUP.KESAR' | translate }}</option>
                  <option value="devgad">{{ 'POPUP.DEVGAD' | translate }}</option>
                  <option value="mixed">{{ 'POPUP.MIXED' | translate }}</option>
                </select>
              </div>

              <div class="order-popup__quantity">
                <label>{{ 'POPUP.QUANTITY' | translate }}</label>
                <div class="order-popup__qty-control">
                  <button type="button" (click)="adjustQty(-1)" class="qty-btn">−</button>
                  <span class="qty-value">{{ form.qty }} {{ 'POPUP.DOZEN' | translate }}</span>
                  <button type="button" (click)="adjustQty(1)" class="qty-btn">+</button>
                </div>
              </div>
            </div>

            <div class="order-popup__field order-popup__field--full">
              <label>{{ 'POPUP.MESSAGE' | translate }}</label>
              <textarea 
                [(ngModel)]="form.message" 
                name="message"
                rows="1"
                placeholder="Any special delivery instructions..."
              ></textarea>
            </div>
          </div>

          <div class="order-popup__actions">
            <button type="submit" class="btn-royal" [disabled]="isSubmitting">
              <span *ngIf="!isSubmitting">{{ 'POPUP.SUBMIT_ORDER' | translate }}</span>
              <span *ngIf="isSubmitting">{{ 'POPUP.PROCESSING' | translate }}</span>
            </button>
            <button type="button" class="btn-secondary" (click)="closePopup()">
              {{ 'POPUP.MAYBE_LATER' | translate }}
            </button>
          </div>
        </form>
      </div>

    <app-map-modal 
      [visible]="showMapModal" 
      (closed)="onMapModalClosed()" 
      (locationSelected)="onLocationSelected($event)">
    </app-map-modal>
    </div>
  `,
  styles: [`
    .order-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
    }

    .order-popup-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .order-popup {
      background: linear-gradient(135deg, #2D1810, #3B2314, #2D1810);
      border: 2px solid rgba(196, 155, 50, 0.3);
      border-radius: 16px;
      max-width: 600px;
      width: 95%;
      height: 85vh;
      overflow: hidden;
      position: relative;
      transform: scale(0.8) translateY(20px);
      transition: all 0.3s ease;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
    }

    .order-popup.active {
      transform: scale(1) translateY(0);
    }

    .order-popup__close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(196, 155, 50, 0.1);
      border: 1px solid rgba(196, 155, 50, 0.2);
      border-radius: 50%;
      color: #FDF5E6;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 1;
    }

    .order-popup__close:hover {
      background: rgba(196, 155, 50, 0.2);
      border-color: rgba(196, 155, 50, 0.4);
      transform: scale(1.1);
    }

    .order-popup__header {
      text-align: center;
      padding: 20px 24px 16px;
      border-bottom: 1px solid rgba(196, 155, 50, 0.1);
      flex-shrink: 0;
    }

    .order-popup__emoji {
      font-size: 3rem;
      margin-bottom: 16px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }

    .order-popup__header h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #FFD700;
      margin: 0 0 8px 0;
    }

    .order-popup__header p {
      color: rgba(253, 245, 230, 0.7);
      margin: 0;
      font-size: 0.95rem;
    }

    .order-popup__form {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .order-popup__fields {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
      overflow: hidden;
      order: 1;
    }

    .order-popup__row {
      display: flex;
      gap: 16px;
    }

    .order-popup__row .order-popup__field {
      flex: 1;
    }

    .order-popup__field--full {
      width: 100%;
    }

    .order-popup__field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .order-popup__field label {
      font-family: 'Jost', sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(253, 245, 230, 0.6);
    }

    .required {
      color: #ff4444;
      font-weight: 700;
      margin-left: 2px;
    }

    .order-popup__field input,
    .order-popup__field select,
    .order-popup__field textarea {
      background: rgba(253, 245, 230, 0.05);
      border: 1px solid rgba(196, 155, 50, 0.2);
      padding: 12px 16px;
      font-family: 'Jost', sans-serif;
      font-size: 0.9rem;
      color: #FDF5E6;
      border-radius: 8px;
      outline: none;
      transition: all 0.2s ease;
    }

    .order-popup__field select {
      background-color: rgba(253, 245, 230, 0.05);
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FDF5E6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 40px;
    }

    .order-popup__field select option {
      background: #2D1810;
      color: #FDF5E6;
      padding: 8px;
    }

    .order-popup__field input:focus,
    .order-popup__field select:focus,
    .order-popup__field textarea:focus {
      border-color: #C49B32;
      background: rgba(253, 245, 230, 0.08);
    }

    .order-popup__field input::placeholder,
    .order-popup__field textarea::placeholder {
      color: rgba(253, 245, 230, 0.3);
    }

    .order-popup__address-group {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .order-popup__address-input {
      flex: 1;
    }

    .order-popup__map-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 12px;
      background: rgba(196, 155, 50, 0.1);
      border: 1px solid rgba(196, 155, 50, 0.3);
      border-radius: 8px;
      color: #FFD700;
      font-family: 'Jost', sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .order-popup__map-btn:hover {
      background: rgba(196, 155, 50, 0.2);
      border-color: #C49B32;
    }

    .order-popup__quantity {
      display: flex;
      flex-direction: column;
    }

    .order-popup__qty-control {
      display: flex;
      align-items: center;
      gap: 42px;
      width: 270px;
      background: rgba(253, 245, 230, 0.05);
      border: 1px solid rgba(196, 155, 50, 0.2);
      border-radius: 8px;
      padding: 6px;
    }

    .qty-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: rgba(196, 155, 50, 0.1);
      border: 1px solid rgba(196, 155, 50, 0.2);
      border-radius: 6px;
      color: #FDF5E6;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .qty-btn:hover {
      background: rgba(196, 155, 50, 0.2);
      border-color: rgba(196, 155, 50, 0.4);
    }

    .qty-value {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: #FFD700;
      min-width: 100px;
      text-align: center;
    }

    .order-popup__actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 16px;
      flex-shrink: 0;
      order: 2;
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid rgba(196, 155, 50, 0.3);
      color: rgba(253, 245, 230, 0.7);
      padding: 14px 24px;
      font-family: 'Jost', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-secondary:hover {
      background: rgba(196, 155, 50, 0.1);
      border-color: rgba(196, 155, 50, 0.5);
      color: #FDF5E6;
    }

    @media (max-width: 640px) {
      .order-popup {
        width: 95%;
        margin: 20px;
      }

      .order-popup__header {
        padding: 24px 20px 20px;
      }

      .order-popup__form {
        padding: 20px;
      }

      .order-popup__row {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class OrderPopupComponent implements OnInit, OnDestroy {
  isVisible = false;
  isSubmitting = false;
  showMapModal = false;
  private timer: any;
  private readonly POPUP_DELAY = 15000; // 15 seconds

  form = {
    name: '',
    phone: '',
    email: '',
    address: '',
    variety: 'mixed',
    qty: 2,
    message: ''
  };

  constructor(private emailService: EmailService, private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    // Start timer to show popup after 30 seconds
    this.timer = setTimeout(() => {
      this.showPopup();
    }, this.POPUP_DELAY);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  showPopup(): void {
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
  }

  closePopup(): void {
    this.isVisible = false;
    document.body.style.overflow = '';
  }

  closeOnOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closePopup();
    }
  }

  adjustQty(delta: number): void {
    this.form.qty = Math.max(1, Math.min(50, this.form.qty + delta));
  }

  onSubmit(): void {
    if (!this.form.name || !this.form.phone || !this.form.email || !this.form.variety) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;

    const orderData: OrderData = {
      name: this.form.name,
      phone: this.form.phone,
      email: this.form.email,
      address: this.form.address,
      variety: this.form.variety,
      qty: this.form.qty,
      message: this.form.message
    };

    this.emailService.sendOrder(orderData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.resetForm();
          this.closePopup();
          this.confirmationService.showConfirmation();
        } else {
          alert('Failed to submit order. Please try again or call us directly.');
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error submitting order:', error);
        alert('Network error. Please try again or call us directly at +91 98765 43210.');
      }
    });
  }

  private resetForm(): void {
    this.form = {
      name: '',
      phone: '',
      email: '',
      address: '',
      variety: '',
      qty: 2,
      message: ''
    };
  }

  openMapModal(): void {
    this.showMapModal = true;
  }

  onMapModalClosed(): void {
    this.showMapModal = false;
  }

  onLocationSelected(location: { coordinates: any; address: any }): void {
    this.form.address = location.address.formatted || '';
    this.showMapModal = false;
  }
}
