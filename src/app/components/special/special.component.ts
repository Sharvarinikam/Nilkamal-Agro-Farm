import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-special',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="special" id="special">
      <div class="special__container">
        <div class="special__header">
          <span class="subheading reveal-el">{{ 'SPECIAL.TITLE' | translate }}</span>
          <h2 class="section-title reveal-el" [innerHTML]="'SPECIAL.MAIN_TITLE' | translate"></h2>
          <div class="ornament reveal-el"><div class="ornament__diamond"></div></div>
        </div>

        <div class="special__grid">
          <div class="special__card" *ngFor="let item of features; let i = index">
            <div class="special__card-number">{{ (i + 1).toString().padStart(2, '0') }}</div>
            <div class="special__card-icon">{{ item.icon }}</div>
            <h3 class="special__card-title">{{ 'SPECIAL.FEATURE' + (i + 1) + '_TITLE' | translate }}</h3>
            <p class="special__card-text">{{ 'SPECIAL.FEATURE' + (i + 1) + '_DESC' | translate }}</p>
            <div class="special__card-accent"></div>
          </div>
        </div>

        <!-- Royal guarantee banner -->
        <div class="special__guarantee reveal-el">
          <div class="special__guarantee-inner">
            <span class="special__guarantee-icon">👑</span>
            <div>
              <h4>{{ 'SPECIAL.ROYAL_PROMISE' | translate }}</h4>
              <p>{{ 'SPECIAL.ROYAL_PROMISE_DESC' | translate }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .special {
      position: relative;
      padding: clamp(80px, 10vh, 140px) clamp(20px, 5vw, 80px);
      background: linear-gradient(180deg, #FAF0DC 0%, #FDF5E6 50%, #FFFDF7 100%);

      &__container {
        max-width: 1280px;
        margin: 0 auto;
      }

      &__header {
        text-align: center;
        margin-bottom: clamp(50px, 6vh, 80px);
      }

      &__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0;

        @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 576px) { grid-template-columns: 1fr; }
      }

      &__card {
        position: relative;
        padding: clamp(32px, 4vw, 48px);
        border: 1px solid rgba(196, 155, 50, 0.12);
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        overflow: hidden;

        &:hover {
          background: rgba(196, 155, 50, 0.04);
          border-color: rgba(196, 155, 50, 0.3);

          .special__card-accent {
            transform: scaleX(1);
          }
        }
      }

      &__card-number {
        font-family: 'Playfair Display', serif;
        font-size: 3.5rem;
        font-weight: 800;
        color: rgba(196, 155, 50, 0.08);
        line-height: 1;
        margin-bottom: 12px;
      }

      &__card-icon {
        font-size: 2rem;
        margin-bottom: 16px;
      }

      &__card-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.2rem;
        font-weight: 700;
        color: #3B2314;
        margin-bottom: 10px;
      }

      &__card-text {
        font-size: 0.9rem;
        color: #7A6A5E;
        line-height: 1.75;
      }

      &__card-accent {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #C49B32, #F5A623);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      &__guarantee {
        margin-top: clamp(50px, 6vh, 80px);
      }

      &__guarantee-inner {
        display: flex;
        align-items: center;
        gap: 24px;
        padding: clamp(28px, 4vw, 48px);
        background: linear-gradient(135deg, #2D1810, #3B2314);
        border: 1px solid rgba(196, 155, 50, 0.2);
        color: #FDF5E6;

        @media (max-width: 576px) {
          flex-direction: column;
          text-align: center;
        }
      }

      &__guarantee-icon {
        font-size: 3rem;
        flex-shrink: 0;
      }

      &__guarantee-inner h4 {
        font-family: 'Playfair Display', serif;
        font-size: 1.3rem;
        color: #FFD700;
        margin-bottom: 8px;
      }

      &__guarantee-inner p {
        font-size: 0.95rem;
        color: rgba(253, 245, 230, 0.6);
        line-height: 1.7;
      }
    }
  `]
})
export class SpecialComponent implements AfterViewInit {
  features = [
    { icon: '🚫', title: 'No Chemicals', desc: 'We never use pesticides or artificial ripening. Pure, natural cultivation methods our ancestors trusted.' },
    { icon: '☀️', title: 'Naturally Ripened', desc: 'Each mango ripens naturally on the tree, developing its signature creamy texture and sweetness.' },
    { icon: '💛', title: 'Love in Every Box', desc: 'We include handwritten notes, recipe cards, and our family\'s story. Every box is a gift from our home to yours.' },
    { icon: '🧬', title: 'Heritage Genetics', desc: 'Our trees descend from saplings selected seventy years ago for exceptional sweetness and aroma.' },
  ];

  constructor(private scroll: ScrollAnimationService) {}

  ngAfterViewInit(): void {
    this.scroll.revealElements('.special .reveal-el');
    this.scroll.staggerReveal('.special__grid', '.special__card');
  }
}
