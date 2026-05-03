import {
  Component, HostListener, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <nav class="nav" [class.nav--scrolled]="isScrolled" [class.nav--open]="menuOpen">
      <div class="nav__inner">
        <a href="#" class="nav__logo">
          <span class="nav__logo-icon">🥭</span>
          <div class="nav__logo-text">
            <span class="nav__logo-name">Nilkamal Agro</span>
            <span class="nav__logo-sub">Farms</span>
          </div>
        </a>

        <button class="nav__toggle" (click)="menuOpen = !menuOpen"
                [attr.aria-label]="menuOpen ? 'Close menu' : 'Open menu'">
          <span class="nav__toggle-line"></span>
          <span class="nav__toggle-line"></span>
          <span class="nav__toggle-line"></span>
        </button>

        <ul class="nav__links" [class.nav__links--open]="menuOpen">
          <li *ngFor="let link of links">
            <a [href]="'#' + link.id" class="nav__link" (click)="menuOpen = false">
              {{ 'NAV.' + link.key | translate }}
            </a>
          </li>
          <li>
            <a href="#contact" class="nav__cta" (click)="menuOpen = false">
              {{ 'ORDER_NOW' | translate }}
            </a>
          </li>
          <li>
            <button class="nav__lang-switch" (click)="switchLanguage()" [attr.aria-label]="'Switch language'">
              <span class="nav__lang-icon">{{ currentLang === 'en' ? 'आ' : 'A' }}</span>
              <span class="nav__lang-text">{{ currentLang === 'en' ? 'मराठी' : 'English' }}</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 20px 0;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

      &--scrolled {
        padding: 10px 0;
        background: rgba(26, 15, 5, 0.92);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(196, 155, 50, 0.15);
      }

      &__inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 clamp(20px, 4vw, 60px);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &__logo {
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1001;
      }

      &__logo-icon {
        font-size: 1.8rem;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        
        @media (max-width: 480px) {
          font-size: 1.5rem;
        }
      }

      &__logo-text {
        display: flex;
        flex-direction: column;
        line-height: 1;
      }

      &__logo-name {
        font-family: 'Playfair Display', serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #FFD700;
        letter-spacing: 0.04em;
        
        @media (max-width: 480px) {
          font-size: 1.2rem;
        }
      }

      &__logo-sub {
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.7rem;
        color: rgba(212, 168, 84, 0.7);
        letter-spacing: 0.35em;
        text-transform: uppercase;
        
        @media (max-width: 480px) {
          font-size: 0.6rem;
        }
      }

      &__toggle {
        display: none;
        flex-direction: column;
        gap: 5px;
        padding: 8px;
        z-index: 1001;

        @media (max-width: 768px) { 
          display: flex; 
        }
        
        @media (max-width: 480px) {
          padding: 6px;
        }
      }

      &__toggle-line {
        width: 24px;
        height: 2px;
        background: #D4A854;
        transition: all 0.3s;
        border-radius: 1px;
      }

      &--open &__toggle-line {
        &:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        &:nth-child(2) { opacity: 0; }
        &:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
      }

      &__links {
        display: flex;
        align-items: center;
        gap: 32px;
        list-style: none;

        @media (max-width: 768px) {
          position: fixed;
          inset: 0;
          background: rgba(26, 15, 5, 0.97);
          flex-direction: column;
          justify-content: center;
          gap: 28px;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

          &--open { transform: translateX(0); }
        }
      }

      &__link {
        font-family: 'Jost', sans-serif;
        font-size: 0.85rem;
        font-weight: 400;
        color: rgba(253, 245, 230, 0.75);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        transition: color 0.3s;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #C49B32;
          transition: width 0.3s;
        }

        &:hover {
          color: #FFD700;
          &::after { width: 100%; }
        }

        @media (max-width: 768px) {
          font-size: 1.1rem;
          letter-spacing: 0.15em;
        }
      }

      &__cta {
        font-family: 'Jost', sans-serif;
        font-size: 0.8rem;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #1A0F05;
        background: linear-gradient(135deg, #C49B32, #FFD700);
        padding: 10px 28px;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(196, 155, 50, 0.4);
        }
      }

      &__lang-switch {
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: 'Jost', sans-serif;
        font-size: 0.75rem;
        font-weight: 500;
        color: rgba(253, 245, 230, 0.75);
        background: transparent;
        border: 1px solid rgba(196, 155, 50, 0.3);
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: rgba(196, 155, 50, 0.6);
          color: #FFD700;
          background: rgba(196, 155, 50, 0.1);
        }
      }

      &__lang-icon {
        font-size: 1rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: rgba(196, 155, 50, 0.2);
        border-radius: 50%;
      }

      &__lang-text {
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  menuOpen = false;
  currentLang = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  switchLanguage(): void {
    const newLang = this.currentLang === 'en' ? 'mr' : 'en';
    this.currentLang = newLang;
    this.translate.use(newLang);
  }

  links = [
    { id: 'about', key: 'ABOUT' },
    { id: 'journey', key: 'JOURNEY' },
    { id: 'varieties', key: 'VARIETIES' },
    { id: 'farm-to-home', key: 'FARM' },
    { id: 'testimonials', key: 'TESTIMONIALS' }
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }
}
