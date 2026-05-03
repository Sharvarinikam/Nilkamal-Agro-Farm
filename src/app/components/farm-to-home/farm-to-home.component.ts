import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-farm-to-home',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="f2h" id="farm-to-home">
      <div class="f2h__container">
        <div class="f2h__header">
          <span class="subheading reveal-el">{{ 'FARM_TO_HOME.TITLE' | translate }}</span>
          <h2 class="section-title reveal-el" [innerHTML]="'FARM_TO_HOME.MAIN_TITLE' | translate"></h2>
          <div class="ornament reveal-el"><div class="ornament__diamond"></div></div>
        </div>

        <div class="f2h__process">
          <div class="f2h__step" *ngFor="let step of steps; let i = index; let last = last">
            <div class="f2h__step-visual">
              <div class="f2h__step-circle">
                <span>{{ step.icon }}</span>
              </div>
              <div class="f2h__step-connector" *ngIf="!last"></div>
            </div>
            <div class="f2h__step-content">
              <span class="f2h__step-num">{{ (i + 1).toString().padStart(2, '0') }}</span>
              <h3>{{ 'FARM_TO_HOME.STEP' + (i + 1) + '_TITLE' | translate }}</h3>
              <p>{{ 'FARM_TO_HOME.STEP' + (i + 1) + '_DESC' | translate }}</p>
              <span class="f2h__step-time">{{ 'FARM_TO_HOME.STEP' + (i + 1) + '_TIME' | translate }}</span>
            </div>
          </div>
        </div>

        <div class="f2h__cta reveal-el">
          <p>{{ 'FARM_TO_HOME.CTA_TEXT' | translate }}</p>
          <a href="#contact" class="btn-royal"><span>{{ 'FARM_TO_HOME.ORDER_FRESH' | translate }}</span></a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .f2h {
      position: relative;
      padding: clamp(80px, 10vh, 140px) clamp(20px, 5vw, 80px);
      background: linear-gradient(180deg, #FFFDF7, #FDF5E6, #FAF0DC);

      &__container {
        max-width: 960px;
        margin: 0 auto;
      }

      &__header {
        text-align: center;
        margin-bottom: clamp(50px, 6vh, 80px);
      }

      &__process {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      &__step {
        display: flex;
        gap: clamp(20px, 4vw, 40px);
        padding-bottom: 48px;
      }

      &__step-visual {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
      }

      &__step-circle {
        width: 64px;
        height: 64px;
        border: 2px solid rgba(196, 155, 50, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        background: #FFFDF7;
        flex-shrink: 0;
        transition: all 0.3s;

        &:hover {
          border-color: #C49B32;
          background: rgba(196, 155, 50, 0.08);
          transform: scale(1.1);
        }

        @media (max-width: 576px) { width: 48px; height: 48px; font-size: 1.3rem; }
      }

      &__step-connector {
        width: 1px;
        flex: 1;
        min-height: 40px;
        background: linear-gradient(180deg, rgba(196, 155, 50, 0.3), rgba(196, 155, 50, 0.08));
      }

      &__step-content {
        flex: 1;
        padding-top: 8px;
      }

      &__step-num {
        font-family: 'Playfair Display', serif;
        font-size: 0.75rem;
        font-weight: 700;
        color: #C49B32;
        letter-spacing: 0.15em;
        display: block;
        margin-bottom: 6px;
      }

      &__step-content h3 {
        font-family: 'Playfair Display', serif;
        font-size: clamp(1.1rem, 2vw, 1.4rem);
        font-weight: 700;
        color: #3B2314;
        margin-bottom: 8px;
      }

      &__step-content p {
        font-size: 0.92rem;
        color: #7A6A5E;
        line-height: 1.75;
        margin-bottom: 8px;
      }

      &__step-time {
        font-family: 'Jost', sans-serif;
        font-size: 0.72rem;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #C49B32;
        opacity: 0.7;
      }

      &__cta {
        text-align: center;
        padding: clamp(32px, 5vw, 56px);
        border: 1px solid rgba(196, 155, 50, 0.2);
        background: rgba(196, 155, 50, 0.03);
        margin-top: 20px;

        p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          font-style: italic;
          color: #5C4A3E;
          margin-bottom: 24px;
        }
      }
    }
  `]
})
export class FarmToHomeComponent implements AfterViewInit {
  steps = [
    { icon: '🌅', title: 'Dawn Harvest', desc: 'Our farmers hand-pick only the finest mangoes at first light, when the fruit is coolest and freshest.', time: '5:00 AM' },
    { icon: '🔍', title: 'Royal Selection', desc: 'Each mango is individually inspected, graded by size, colour, and aroma. Only the top 20% earn the Nilkamal Farms seal.', time: '7:00 AM' },
    { icon: '🧺', title: 'Traditional Wrapping', desc: 'Wrapped lovingly in soft tissue paper and nestled in hay-lined boxes — the way our grandmother used to pack them.', time: '9:00 AM' },
    { icon: '🚛', title: 'Cold Chain Dispatch', desc: 'Temperature-controlled transport from Ratnagiri to major cities. We never break the cold chain.', time: '11:00 AM' },
    { icon: '🏠', title: 'Doorstep Delivery', desc: 'Delivered to your home with a freshness guarantee, a handwritten note from our family, and recipe suggestions.', time: 'Next Day' },
  ];

  constructor(private scroll: ScrollAnimationService) {}

  ngAfterViewInit(): void {
    this.scroll.revealElements('.f2h .reveal-el');
    this.scroll.staggerReveal('.f2h__process', '.f2h__step', 0.15);
  }
}
