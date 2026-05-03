import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-varieties',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="varieties" id="varieties">
      <div class="varieties__container">
        <div class="varieties__header">
          <span class="subheading reveal-el">{{ 'VARIETIES.TITLE' | translate }}</span>
          <h2 class="section-title reveal-el" style="color: #FDF5E6" [innerHTML]="'VARIETIES.MAIN_TITLE' | translate"></h2>
          <p class="section-subtitle reveal-el" style="color: rgba(253,245,230,0.5); margin: 0 auto;">{{ 'VARIETIES.SUBTITLE' | translate }}</p>
          <div class="ornament reveal-el"><div class="ornament__diamond"></div></div>
        </div>
        <div class="varieties__showcase">
          <div class="varieties__card" *ngFor="let mango of varieties; let i = index" [class.varieties__card--featured]="i === 0">
            <div class="varieties__card-visual">
              <div class="varieties__card-emoji">{{ mango.emoji }}</div>
              <div class="varieties__card-badge" *ngIf="mango.badge">{{ mango.badge }}</div>
            </div>
            <div class="varieties__card-body">
              <h3>{{ 'VARIETIES.KESAR_NAME' | translate }}</h3>
              <em class="varieties__card-origin">{{ 'VARIETIES.KESAR_ORIGIN' | translate }}</em>
              <p>{{ 'VARIETIES.KESAR_DESC' | translate }}</p>
              <div class="varieties__card-meta">
                <div class="varieties__card-meta-item"><span class="label">{{ 'VARIETIES.SWEETNESS' | translate }}</span><div class="varieties__bar"><div class="varieties__bar-fill" [style.width.%]="mango.sweetness"></div></div></div>
                <div class="varieties__card-meta-item"><span class="label">{{ 'VARIETIES.AROMA' | translate }}</span><div class="varieties__bar"><div class="varieties__bar-fill" [style.width.%]="mango.aroma"></div></div></div>
                <div class="varieties__card-meta-item"><span class="label">{{ 'VARIETIES.FIBRE' | translate }}</span><div class="varieties__bar"><div class="varieties__bar-fill" [style.width.%]="mango.fibre"></div></div></div>
              </div>
              <div class="varieties__card-price"><span class="varieties__card-from">{{ 'VARIETIES.FROM' | translate }}</span><span class="varieties__card-amount">₹{{ mango.price }}</span><span class="varieties__card-unit">{{ 'VARIETIES.PER_DOZEN' | translate }}</span></div>
              <button class="btn-royal varieties__card-btn" (click)="preOrder(mango)"><span>{{ 'VARIETIES.PRE_ORDER_NOW' | translate }}</span></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .varieties{position:relative;padding:clamp(80px,10vh,140px) clamp(20px,5vw,80px);background:linear-gradient(180deg,#1A0F05,#2D1810,#1A0F05)}
    .varieties__container{max-width:1280px;margin:0 auto}
    .varieties__header{text-align:center;margin-bottom:clamp(50px,6vh,80px)}
    .varieties__showcase{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
    @media(max-width:576px){.varieties__showcase{grid-template-columns:1fr}}
    .varieties__card{background:rgba(253,245,230,.03);border:1px solid rgba(196,155,50,.12);transition:all .5s;overflow:hidden}
    .varieties__card:hover{border-color:rgba(196,155,50,.4);background:rgba(253,245,230,.06);transform:translateY(-4px)}
    .varieties__card--featured{border-color:rgba(196,155,50,.3);background:rgba(196,155,50,.05)}
    .varieties__card-visual{position:relative;height:180px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(196,155,50,.05),rgba(245,166,35,.08))}
    .varieties__card-emoji{font-size:5rem;filter:drop-shadow(0 8px 20px rgba(0,0,0,.3))}
    .varieties__card-badge{position:absolute;top:16px;right:16px;font-family:'Jost',sans-serif;font-size:.65rem;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:#1A0F05;background:linear-gradient(135deg,#C49B32,#FFD700);padding:4px 12px}
    .varieties__card-body{padding:28px}
    .varieties__card-body h3{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#FDF5E6;margin-bottom:4px}
    .varieties__card-origin{font-family:'Cormorant Garamond',serif;font-size:.9rem;color:#C49B32;display:block;margin-bottom:12px}
    .varieties__card-body p{font-size:.9rem;color:rgba(253,245,230,.5);line-height:1.7;margin-bottom:20px}
    .varieties__card-meta{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
    .varieties__card-meta-item{display:flex;align-items:center;gap:12px}
    .varieties__card-meta-item .label{font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(253,245,230,.4);width:70px;flex-shrink:0}
    .varieties__bar{flex:1;height:4px;background:rgba(253,245,230,.08);border-radius:2px;overflow:hidden}
    .varieties__bar-fill{height:100%;background:linear-gradient(90deg,#C49B32,#F5A623);border-radius:2px;transition:width 1s ease-out}
    .varieties__card-price{display:flex;align-items:baseline;gap:6px;margin-bottom:20px}
    .varieties__card-from{font-size:.75rem;color:rgba(253,245,230,.4);text-transform:uppercase;letter-spacing:.1em}
    .varieties__card-amount{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:#FFD700}
    .varieties__card-unit{font-size:.85rem;color:rgba(253,245,230,.4)}
    .varieties__card-btn{width:100%;justify-content:center}
  `]
})
export class VarietiesComponent implements AfterViewInit {
  varieties = [
    // {name:'Alphonso Hapus',emoji:'🥭',origin:'Ratnagiri, Maharashtra',description:'The undisputed King of Mangoes. Rich saffron flesh, zero fibre, intoxicating aroma. Our signature heritage variety.',sweetness:95,aroma:98,fibre:10,price:'1,200',badge:'Crown Jewel'},
    {name:'Kesar',emoji:'🥭',origin:'Junagadh, Gujarat',description:'Named after saffron for its deep orange pulp. Intensely sweet with a hint of citrus and floral notes.',sweetness:90,aroma:85,fibre:15,price:'800',badge:null},
    // {name:'Devgad Hapus',emoji:'🥭',origin:'Devgad, Maharashtra',description:"Slightly tangier cousin of the Ratnagiri Alphonso. Firmer flesh, excellent for cutting. A connoisseur's choice.",sweetness:88,aroma:92,fibre:12,price:'1,000',badge:'Limited'},
  ];
  constructor(private scroll: ScrollAnimationService) {}
  ngAfterViewInit(): void { this.scroll.revealElements('.varieties .reveal-el'); this.scroll.staggerReveal('.varieties__showcase', '.varieties__card', 0.2); }
  preOrder(mango: any): void {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const ta = document.querySelector('textarea') as HTMLTextAreaElement;
        if (ta) { ta.focus(); ta.value = `I would like to pre-order ${mango.name} mangoes.`; }
      }, 800);
    }
  }
}
