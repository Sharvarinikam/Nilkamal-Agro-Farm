import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <section class="contact" id="contact">
      <div class="contact__container">
        <div class="contact__left">
          <span class="subheading reveal-el">{{ 'CONTACT.TITLE' | translate }}</span>
          <h2 class="section-title reveal-el" [innerHTML]="'CONTACT.MAIN_TITLE' | translate"></h2>
          <div class="ornament reveal-el"><div class="ornament__diamond"></div></div>
          <div class="contact__info reveal-el">
            <div class="contact__info-item"><span class="contact__info-icon">📍</span><div><strong>{{ 'CONTACT.FARM_ADDRESS' | translate }}</strong><p>{{ 'CONTACT.FARM_ADDRESS_TEXT' | translate }}</p></div></div>
            <div class="contact__info-item"><span class="contact__info-icon">📞</span><div><strong>{{ 'CONTACT.PHONE' | translate }}</strong><p>+91 98765 43210</p></div></div>
            <div class="contact__info-item"><span class="contact__info-icon">✉️</span><div><strong>{{ 'CONTACT.EMAIL' | translate }}</strong><p>orders&#64;nikamagrofarms.com</p></div></div>
            <div class="contact__info-item"><span class="contact__info-icon">🕐</span><div><strong>{{ 'CONTACT.SEASON' | translate }}</strong><p>{{ 'CONTACT.SEASON_TEXT' | translate }}</p></div></div>
          </div>
        </div>
        <div class="contact__right reveal-el">
          <div class="contact__form-wrapper">
            <h3 class="contact__form-title">{{ 'CONTACT.FORM_TITLE' | translate }}</h3>
            <p class="contact__form-sub">{{ 'CONTACT.FORM_SUB' | translate }}</p>
            <div class="contact__form">
              <div class="contact__field"><label>{{ 'CONTACT.FULL_NAME' | translate }}</label><input type="text" placeholder="{{ 'CONTACT.PHONE_PLACEHOLDER' | translate }}" [(ngModel)]="form.name"></div>
              <div class="contact__field"><label>{{ 'CONTACT.PHONE_NUMBER' | translate }}</label><input type="tel" placeholder="{{ 'CONTACT.PHONE_PLACEHOLDER2' | translate }}" [(ngModel)]="form.phone"></div>
              <div class="contact__field"><label>{{ 'CONTACT.CITY' | translate }}</label><input type="text" placeholder="{{ 'CONTACT.CITY_PLACEHOLDER' | translate }}" [(ngModel)]="form.city"></div>
              <div class="contact__field"><label>{{ 'CONTACT.VARIETY_PREF' | translate }}</label>
                <select [(ngModel)]="form.variety"><option value="">{{ 'CONTACT.SELECT_VARIETY' | translate }}</option><option value="alphonso">{{ 'CONTACT.ALPHONSO' | translate }}</option><option value="kesar">{{ 'CONTACT.KESAR_OPT' | translate }}</option><option value="devgad">{{ 'CONTACT.DEVGAD' | translate }}</option><option value="mixed">{{ 'CONTACT.MIXED' | translate }}</option></select>
              </div>
              <div class="contact__field contact__field--full"><label>{{ 'CONTACT.QUANTITY' | translate }}</label>
                <div class="contact__qty"><button (click)="adjustQty(-1)" class="contact__qty-btn">−</button><span class="contact__qty-val">{{ form.qty }}</span><button (click)="adjustQty(1)" class="contact__qty-btn">+</button></div>
              </div>
              <div class="contact__field contact__field--full"><label>{{ 'CONTACT.SPECIAL_REQUESTS' | translate }}</label><textarea rows="3" placeholder="{{ 'CONTACT.SPECIAL_PLACEHOLDER' | translate }}" [(ngModel)]="form.message"></textarea></div>
              <button class="btn-royal contact__submit" (click)="onSubmit()" [disabled]="submitted"><span>{{ submitted ? ('CONTACT.PROCESSING' | translate) : ('CONTACT.SUBMIT_ORDER' | translate) }}</span></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact{position:relative;padding:clamp(80px,10vh,140px) clamp(20px,5vw,80px);background:linear-gradient(180deg,#FAF0DC,#FDF5E6,#FFFDF7)}
    .contact__container{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(40px,6vw,80px);align-items:start}
    @media(max-width:1024px){.contact__container{grid-template-columns:1fr}}
    .contact__info{display:flex;flex-direction:column;gap:24px;margin-top:20px}
    .contact__info-item{display:flex;gap:16px;align-items:flex-start}
    .contact__info-item strong{display:block;font-family:'Playfair Display',serif;font-size:.95rem;color:#3B2314;margin-bottom:2px}
    .contact__info-item p{font-size:.88rem;color:#7A6A5E;line-height:1.6;margin:0}
    .contact__info-icon{font-size:1.3rem;flex-shrink:0;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:rgba(196,155,50,.08);border:1px solid rgba(196,155,50,.15)}
    .contact__form-wrapper{padding:clamp(28px,4vw,48px);background:linear-gradient(135deg,#2D1810,#3B2314,#2D1810);border:1px solid rgba(196,155,50,.2)}
    .contact__form-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#FFD700;margin-bottom:6px}
    .contact__form-sub{font-family:'Cormorant Garamond',serif;font-size:.95rem;font-style:italic;color:rgba(253,245,230,.5);margin-bottom:28px}
    .contact__form{display:grid;grid-template-columns:1fr 1fr;gap:18px}
    @media(max-width:576px){.contact__form{grid-template-columns:1fr}}
    .contact__field{display:flex;flex-direction:column;gap:6px}
    .contact__field--full{grid-column:1/-1}
    .contact__field label{font-family:'Jost',sans-serif;font-size:.72rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(253,245,230,.4)}
    .contact__field input,.contact__field select,.contact__field textarea{background:rgba(253,245,230,.05);border:1px solid rgba(196,155,50,.15);padding:12px 16px;font-family:'Jost',sans-serif;font-size:.9rem;color:#FDF5E6;outline:none;transition:border-color .3s;border-radius:0}
    .contact__field input::placeholder,.contact__field textarea::placeholder{color:rgba(253,245,230,.2)}
    .contact__field input:focus,.contact__field select:focus,.contact__field textarea:focus{border-color:#C49B32}
    .contact__field select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%23C49B32'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}
    .contact__field select option{background:#2D1810;color:#FDF5E6}
    .contact__field textarea{resize:vertical;min-height:80px}
    .contact__qty{display:flex;align-items:center;border:1px solid rgba(196,155,50,.15);width:fit-content}
    .contact__qty-btn{width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#C49B32;background:rgba(196,155,50,.05);transition:background .2s}
    .contact__qty-btn:hover{background:rgba(196,155,50,.15)}
    .contact__qty-val{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#FFD700;min-width:50px;text-align:center}
    .contact__submit{grid-column:1/-1;width:100%;justify-content:center;margin-top:8px}
  `]
})
export class ContactComponent implements AfterViewInit {
  form = { name: '', phone: '', city: '', variety: '', qty: 2, message: '' };
  submitted = false;
  constructor(private scroll: ScrollAnimationService) {}
  ngAfterViewInit(): void { this.scroll.revealElements('.contact .reveal-el'); }
  adjustQty(delta: number): void { this.form.qty = Math.max(1, Math.min(50, this.form.qty + delta)); }
  onSubmit(): void {
    if (!this.form.name || !this.form.phone || !this.form.city || !this.form.variety) { alert('Please fill in all required fields'); return; }
    this.submitted = true;
    const summary = `Thank you for your order, ${this.form.name}!\n\nOrder Details:\n• Variety: ${this.form.variety}\n• Quantity: ${this.form.qty} dozen(s)\n• City: ${this.form.city}\n${this.form.message ? '• Notes: ' + this.form.message : ''}\n\nOur team will contact you within 24 hours.\n\nNikam Agro Farms`;
    setTimeout(() => { this.submitted = false; alert(summary); }, 2000);
  }
}
