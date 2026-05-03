import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="test" id="testimonials">
      <div class="test__container">
        <div class="test__header">
          <span class="subheading reveal-el">{{ 'TESTIMONIALS.TITLE' | translate }}</span>
          <h2 class="section-title reveal-el" style="color:#FDF5E6" [innerHTML]="'TESTIMONIALS.MAIN_TITLE' | translate"></h2>
          <div class="ornament reveal-el"><div class="ornament__diamond"></div></div>
        </div>

        <div class="test__grid">
          <div class="test__card" *ngFor="let t of testimonials; let i = index">
            <div class="test__card-quote">"</div>
            <p class="test__card-text">{{ 'TESTIMONIALS.REVIEW' + (i + 1) | translate }}</p>
            <div class="test__card-divider"></div>
            <div class="test__card-author">
              <div class="test__card-avatar">{{ t.initials }}</div>
              <div>
                <strong>{{ t.name }}</strong>
                <span>{{ t.location }}</span>
              </div>
            </div>
            <div class="test__card-stars">
              <span *ngFor="let s of [1,2,3,4,5]">★</span>
            </div>
          </div>
        </div>

        <!-- Social proof strip -->
        <div class="test__proof reveal-el">
          <div class="test__proof-item" *ngFor="let p of proofs">
            <span class="test__proof-num">{{ p.value }}</span>
            <span class="test__proof-label">{{ 'TESTIMONIALS.' + p.labelKey | translate }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .test {
      position: relative;
      padding: clamp(80px, 10vh, 140px) clamp(20px, 5vw, 80px);
      background: linear-gradient(180deg, #1A0F05, #2D1810, #251510);

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
        gap: 24px;

        @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 576px) { grid-template-columns: 1fr; }
      }

      &__card {
        position: relative;
        padding: clamp(28px, 3vw, 40px);
        background: rgba(253, 245, 230, 0.02);
        border: 1px solid rgba(196, 155, 50, 0.1);
        transition: all 0.4s;

        &:hover {
          border-color: rgba(196, 155, 50, 0.3);
          background: rgba(253, 245, 230, 0.04);
          transform: translateY(-4px);
        }
      }

      &__card-quote {
        font-family: 'Playfair Display', serif;
        font-size: 4rem;
        font-weight: 800;
        line-height: 1;
        background: linear-gradient(135deg, #C49B32, #FFD700);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: -10px;
      }

      &__card-text {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.1rem;
        font-style: italic;
        color: rgba(253, 245, 230, 0.7);
        line-height: 1.8;
        margin-bottom: 20px;
      }

      &__card-divider {
        width: 40px;
        height: 1px;
        background: rgba(196, 155, 50, 0.3);
        margin-bottom: 16px;
      }

      &__card-author {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;

        strong {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          color: #FDF5E6;
        }

        span {
          font-size: 0.75rem;
          color: rgba(196, 155, 50, 0.6);
          letter-spacing: 0.08em;
        }
      }

      &__card-avatar {
        width: 40px;
        height: 40px;
        border: 1px solid rgba(196, 155, 50, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Playfair Display', serif;
        font-size: 0.85rem;
        font-weight: 700;
        color: #C49B32;
        background: rgba(196, 155, 50, 0.05);
        flex-shrink: 0;
      }

      &__card-stars {
        display: flex;
        gap: 3px;

        span {
          font-size: 0.8rem;
          color: #C49B32;
        }
      }

      &__proof {
        display: flex;
        justify-content: center;
        gap: 0;
        margin-top: clamp(50px, 6vh, 80px);
        border: 1px solid rgba(196, 155, 50, 0.12);
      }

      &__proof-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: clamp(20px, 3vw, 32px);
        border-right: 1px solid rgba(196, 155, 50, 0.12);

        &:last-child { border-right: none; }

        @media (max-width: 576px) { padding: 16px 8px; }
      }

      &__proof-num {
        font-family: 'Playfair Display', serif;
        font-size: clamp(1.6rem, 3vw, 2.4rem);
        font-weight: 700;
        background: linear-gradient(135deg, #C49B32, #FFD700);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      &__proof-label {
        font-family: 'Jost', sans-serif;
        font-size: clamp(0.6rem, 1vw, 0.75rem);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(253, 245, 230, 0.4);
        text-align: center;
        margin-top: 4px;
      }
    }
  `]
})
export class TestimonialsComponent implements AfterViewInit {
  testimonials = [
    {
      text: 'The moment I opened the box, the aroma transported me straight to my grandmother\'s village in Konkan. These are not just mangoes — they are memories wrapped in gold.',
      name: 'Priya Deshmukh',
      initials: 'PD',
      location: 'Mumbai, Maharashtra'
    },
    {
      text: 'I have tasted Alphonso from many farms, but Nilkamal Farms is in a league of its own. The texture is like custard, the sweetness perfectly balanced. Truly the king of fruits.',
      name: 'Rajesh Kulkarni',
      initials: 'RK',
      location: 'Pune, Maharashtra'
    },
    {
      text: 'We ordered for our daughter\'s wedding. Every guest asked where we got these magnificent mangoes. The presentation, the freshness — absolutely impeccable service.',
      name: 'Sunita & Anil Joshi',
      initials: 'SJ',
      location: 'Thane, Maharashtra'
    },
    {
      text: 'As a chef, I am particular about ingredients. These Alphonsos have a depth of flavour — honeyed, floral, with a hint of saffron — that elevates every dessert I create with them.',
      name: 'Chef Vikas Mehta',
      initials: 'VM',
      location: 'Thane, Maharashtra'
    },
    {
      text: 'Three seasons running, we order exclusively from Nilkamal Farms. The consistency is remarkable. Every single mango is perfect. Our family won\'t accept anything else now.',
      name: 'Deepak Nair',
      initials: 'DN',
      location: 'Thane, Maharashtra'
    },
    {
      text: 'I sent a box to my parents in the US. They called in tears — said it tasted exactly like the mangoes from their childhood. Thank you for keeping this tradition alive.',
      name: 'Anita Patil',
      initials: 'AP',
      location: 'Thane, Maharashtra'
    },
  ];

  proofs = [
    { value: '15,000+', labelKey: 'HAPPY_FAMILIES' },
    { value: '4.9★', labelKey: 'AVERAGE_RATING' },
    { value: '98%', labelKey: 'REPEAT_CUSTOMERS' },
    { value: '12', labelKey: 'STATES_DELIVERED' },
  ];

  constructor(private scroll: ScrollAnimationService) {}

  ngAfterViewInit(): void {
    this.scroll.revealElements('.test .reveal-el');
    this.scroll.staggerReveal('.test__grid', '.test__card', 0.12);
  }
}
