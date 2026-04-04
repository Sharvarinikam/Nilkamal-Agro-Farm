import {
  Component, Output, EventEmitter, AfterViewInit,
  ElementRef, ViewChild, OnDestroy
} from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="loader" #loaderWrapper>
      <div class="loader__bg"></div>
      <div class="loader__content">
        <div class="loader__mango-wrapper">
          <!-- SVG Mango Lifecycle -->
          <svg #mangoSvg class="loader__mango" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Seed -->
            <g class="stage stage-seed">
              <ellipse cx="100" cy="120" rx="14" ry="22" fill="#8B6914" stroke="#5C4A10" stroke-width="1"/>
              <ellipse cx="100" cy="120" rx="10" ry="18" fill="#A07D1A" opacity="0.5"/>
            </g>
            <!-- Sprout from seed -->
            <g class="stage stage-sprout" opacity="0">
              <ellipse cx="100" cy="130" rx="12" ry="18" fill="#8B6914"/>
              <path d="M100 112 Q98 95 92 80" stroke="#4A7C3A" stroke-width="3" fill="none" stroke-linecap="round"/>
              <ellipse cx="89" cy="78" rx="10" ry="6" fill="#6B9E3A" transform="rotate(-25 89 78)"/>
            </g>
            <!-- Growing plant -->
            <g class="stage stage-plant" opacity="0">
              <rect x="97" y="90" width="6" height="50" rx="3" fill="#5C8A3C"/>
              <ellipse cx="82" cy="88" rx="16" ry="9" fill="#4A7C3A" transform="rotate(-20 82 88)"/>
              <ellipse cx="118" cy="95" rx="14" ry="8" fill="#5C9E4A" transform="rotate(15 118 95)"/>
              <ellipse cx="88" cy="75" rx="13" ry="7" fill="#6BAE5A" transform="rotate(-30 88 75)"/>
            </g>
            <!-- Full mango fruit -->
            <g class="stage stage-mango" opacity="0">
              <defs>
                <radialGradient id="mangoGrad" cx="40%" cy="35%">
                  <stop offset="0%" stop-color="#FFD700"/>
                  <stop offset="45%" stop-color="#F5A623"/>
                  <stop offset="100%" stop-color="#E8910C"/>
                </radialGradient>
              </defs>
              <path d="M100 55 Q135 60 145 100 Q148 135 120 155 Q100 165 80 155 Q52 135 55 100 Q60 60 100 55Z"
                    fill="url(#mangoGrad)" stroke="#D4892A" stroke-width="1.5"/>
              <path d="M100 55 Q103 45 108 42" stroke="#4A7C3A" stroke-width="3" fill="none" stroke-linecap="round"/>
              <ellipse cx="112" cy="40" rx="12" ry="7" fill="#4A7C3A" transform="rotate(25 112 40)"/>
              <ellipse cx="85" cy="85" rx="20" ry="12" fill="rgba(255,255,255,0.15)" transform="rotate(-20 85 85)"/>
            </g>
          </svg>

          <!-- Glow ring -->
          <div class="loader__glow" #glow></div>
        </div>

        <div class="loader__text">
          <div class="loader__brand" #brandText>
            <span class="loader__brand-nikam">Nikam</span>
            <span class="loader__brand-farms">Farms</span>
          </div>
          <div class="loader__tagline" #tagline>Royal Heritage Mangoes</div>
        </div>

        <div class="loader__progress">
          <div class="loader__progress-bar" #progressBar></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loader {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;

      &__bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(160deg, #1A0F05 0%, #2D1810 30%, #3B2314 60%, #1A0F05 100%);

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(196, 155, 50, 0.08) 0%, transparent 60%);
        }
      }

      &__content {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 32px;
      }

      &__mango-wrapper {
        position: relative;
        width: 180px;
        height: 180px;
      }

      &__mango {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 2;
        filter: drop-shadow(0 4px 20px rgba(245, 166, 35, 0.3));
      }

      &__glow {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120px;
        height: 120px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245, 166, 35, 0.25) 0%, transparent 70%);
        z-index: 1;
      }

      &__text {
        text-align: center;
      }

      &__brand {
        opacity: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1;
      }

      &__brand-nikam {
        font-family: 'Playfair Display', serif;
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 800;
        background: linear-gradient(135deg, #C49B32, #FFD700, #E8C868, #C49B32);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 0.08em;
      }

      &__brand-farms {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(1.2rem, 3vw, 1.8rem);
        font-weight: 300;
        color: #D4A854;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        margin-top: 4px;
      }

      &__tagline {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(0.85rem, 1.8vw, 1.1rem);
        font-style: italic;
        color: rgba(212, 168, 84, 0.6);
        letter-spacing: 0.1em;
        margin-top: 12px;
        opacity: 0;
      }

      &__progress {
        width: 200px;
        height: 2px;
        background: rgba(196, 155, 50, 0.15);
        border-radius: 1px;
        overflow: hidden;
      }

      &__progress-bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #C49B32, #FFD700);
        border-radius: 1px;
      }
    }
  `]
})
export class LoaderComponent implements AfterViewInit, OnDestroy {
  @Output() loadingComplete = new EventEmitter<void>();
  @ViewChild('loaderWrapper') loaderWrapper!: ElementRef<HTMLElement>;
  @ViewChild('mangoSvg') mangoSvg!: ElementRef<SVGElement>;
  @ViewChild('glow') glow!: ElementRef<HTMLElement>;
  @ViewChild('brandText') brandText!: ElementRef<HTMLElement>;
  @ViewChild('tagline') tagline!: ElementRef<HTMLElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLElement>;

  private timeline!: gsap.core.Timeline;

  ngAfterViewInit(): void {
    this.playAnimation();
  }

  private playAnimation(): void {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(this.loaderWrapper.nativeElement, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => this.loadingComplete.emit(),
        });
      },
    });
    this.timeline = tl;

    const stages = this.mangoSvg.nativeElement.querySelectorAll('.stage');

    // Progress bar
    tl.to(this.progressBar.nativeElement, { width: '100%', duration: 3.8, ease: 'power1.inOut' }, 0);

    // Stage 1: Seed visible, glow
    tl.to(this.glow.nativeElement, { scale: 1.3, opacity: 0.8, duration: 0.5, ease: 'power2.out' }, 0.2);

    // Stage 2: Seed fades, sprout appears
    tl.to(stages[0], { opacity: 0, duration: 0.3 }, 0.7)
      .to(stages[1], { opacity: 1, duration: 0.4 }, 0.8)
      .to(this.glow.nativeElement, { scale: 1.5, duration: 0.4 }, 0.8);

    // Stage 3: Sprout → plant
    tl.to(stages[1], { opacity: 0, duration: 0.3 }, 1.5)
      .to(stages[2], { opacity: 1, duration: 0.4 }, 1.6)
      .to(this.glow.nativeElement, { scale: 1.8, duration: 0.4 }, 1.6);

    // Stage 4: Plant → mango
    tl.to(stages[2], { opacity: 0, duration: 0.3 }, 2.3)
      .to(stages[3], { opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, 2.4)
      .to(this.glow.nativeElement, {
        scale: 2.5,
        background: 'radial-gradient(circle, rgba(245, 166, 35, 0.4) 0%, transparent 70%)',
        duration: 0.6,
      }, 2.4);

    // Reveal brand name
    tl.to(this.brandText.nativeElement, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, 2.8)
    .fromTo(this.brandText.nativeElement, { y: 20 }, { y: 0, duration: 0.8 }, 2.8);

    // Reveal tagline
    tl.to(this.tagline.nativeElement, {
      opacity: 1, duration: 0.6, ease: 'power2.out'
    }, 3.2);

    // Final pulse
    tl.to(this.glow.nativeElement, {
      scale: 3, opacity: 0, duration: 0.5
    }, 3.6);
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
  }
}
