import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="confirmation-overlay" [class.confirmation-overlay--visible]="isVisible" (click)="closeOnOverlay($event)">
      <div class="confirmation-popup" [class.confirmation-popup--visible]="isVisible">
        <button class="confirmation__close" (click)="close()" aria-label="Close">
          <span class="confirmation__close-line"></span>
          <span class="confirmation__close-line"></span>
        </button>
        
        <div class="confirmation__content">
          <div class="confirmation__icon">✅</div>
          <h2>{{ 'CONFIRMATION.TITLE' | translate }}</h2>
          <p>{{ 'CONFIRMATION.MESSAGE' | translate }}</p>
          <div class="confirmation__details">
            <p><strong>{{ 'CONFIRMATION.ORDER_RECEIVED' | translate }}</strong></p>
            <p>{{ 'CONFIRMATION.EMAIL_SENT' | translate }}</p>
            <p>{{ 'CONFIRMATION.CONTACT_SOON' | translate }}</p>
          </div>
          <button class="btn-royal confirmation__btn" (click)="close()">
            {{ 'CONFIRMATION.CLOSE_BUTTON' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      padding: 20px;
    }

    .confirmation-overlay--visible {
      opacity: 1;
      visibility: visible;
    }

    .confirmation-popup {
      background: linear-gradient(135deg, #2D1810, #3B2314, #2D1810);
      border: 2px solid rgba(196, 155, 50, 0.3);
      border-radius: 16px;
      max-width: 400px;
      width: 100%;
      position: relative;
      transform: scale(0.8) translateY(20px);
      transition: all 0.3s ease;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }

    .confirmation-popup--visible {
      transform: scale(1) translateY(0);
    }

    .confirmation__close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: transparent;
      border: none;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
    }

    .confirmation__close-line {
      position: absolute;
      width: 20px;
      height: 2px;
      background: rgba(253, 245, 230, 0.6);
      transition: all 0.3s;
      border-radius: 1px;
    }

    .confirmation__close-line:nth-child(1) {
      transform: rotate(45deg);
    }

    .confirmation__close-line:nth-child(2) {
      transform: rotate(-45deg);
    }

    .confirmation__close:hover .confirmation__close-line {
      background: #FDF5E6;
    }

    .confirmation__content {
      padding: 40px 32px 32px;
      text-align: center;
    }

    .confirmation__icon {
      font-size: 4rem;
      margin-bottom: 20px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }

    .confirmation__content h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #FFD700;
      margin-bottom: 16px;
      letter-spacing: 0.04em;
    }

    .confirmation__content p {
      font-family: 'Jost', sans-serif;
      font-size: 1rem;
      color: rgba(253, 245, 230, 0.8);
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .confirmation__details {
      background: rgba(253, 245, 230, 0.05);
      border: 1px solid rgba(196, 155, 50, 0.2);
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }

    .confirmation__details p {
      margin-bottom: 8px;
      font-size: 0.9rem;
    }

    .confirmation__details p:last-child {
      margin-bottom: 0;
    }

    .confirmation__details strong {
      color: #FDF5E6;
      font-weight: 600;
    }

    .confirmation__btn {
      width: 100%;
      padding: 14px 24px;
      font-family: 'Jost', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 8px;
    }

    @media (max-width: 480px) {
      .confirmation__content {
        padding: 32px 24px 24px;
      }

      .confirmation__icon {
        font-size: 3rem;
        margin-bottom: 16px;
      }

      .confirmation__content h2 {
        font-size: 1.5rem;
      }

      .confirmation__content p {
        font-size: 0.9rem;
      }

      .confirmation__details {
        padding: 16px;
        margin: 20px 0;
      }
    }
  `]
})
export class ConfirmationPopupComponent {
  isVisible = false;

  @Input() set show(value: boolean) {
    this.isVisible = value;
    if (value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.isVisible = false;
    document.body.style.overflow = '';
    this.closed.emit();
  }

  closeOnOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
