import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-varieties',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
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
          <div class="varieties__card" *ngFor="let mango of varieties; let i = index" [class.varieties__card--featured]="i === 0" [class.varieties__card--out-of-stock]="mango.outOfStock">
            <div class="varieties__card-visual">
              <div class="varieties__card-emoji">{{ mango.emoji }}</div>
              <div class="varieties__card-badge" *ngIf="mango.badge" [class.varieties__card-badge--out-of-stock]="mango.outOfStock">{{ mango.badge }}</div>
            </div>
            <div class="varieties__card-body">
              <h3>{{ mango.name }}</h3>
              <em class="varieties__card-origin">{{ mango.origin }}</em>
              <p>{{ mango.description }}</p>
              <div class="varieties__card-meta">
                <div class="varieties__card-meta-item"><span class="label">{{ 'VARIETIES.SWEETNESS' | translate }}</span><div class="varieties__bar"><div class="varieties__bar-fill" [style.width.%]="mango.sweetness"></div></div></div>
                <div class="varieties__card-meta-item"><span class="label">{{ 'VARIETIES.AROMA' | translate }}</span><div class="varieties__bar"><div class="varieties__bar-fill" [style.width.%]="mango.aroma"></div></div></div>
                <div class="varieties__card-meta-item"><span class="label">{{ 'VARIETIES.FIBRE' | translate }}</span><div class="varieties__bar"><div class="varieties__bar-fill" [style.width.%]="mango.fibre"></div></div></div>
              </div>
              <div class="varieties__card-price"><span class="varieties__card-from">{{ 'VARIETIES.FROM' | translate }}</span><span class="varieties__card-amount">₹{{ mango.price }}</span><span class="varieties__card-unit">{{ 'VARIETIES.PER_DOZEN' | translate }}</span></div>
                            <button class="btn-royal varieties__card-btn" (click)="preOrder(mango)" [disabled]="mango.outOfStock">
                <span *ngIf="!mango.outOfStock">{{ 'VARIETIES.PRE_ORDER_NOW' | translate }}</span>
                <span *ngIf="mango.outOfStock">Out of Stock</span>
              </button>
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
    @media(max-width:768px){.varieties__showcase{grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}}
    @media(max-width:576px){.varieties__showcase{grid-template-columns:1fr;gap:16px}}
    @media(max-width:480px){.varieties__showcase{gap:12px}}
    .varieties__card{background:rgba(253,245,230,.03);border:1px solid rgba(196,155,50,.12);transition:all .5s;overflow:hidden}
    .varieties__card:hover{border-color:rgba(196,155,50,.4);background:rgba(253,245,230,.06);transform:translateY(-4px)}
    .varieties__card--featured{border-color:rgba(196,155,50,.3);background:rgba(196,155,50,.05)}
    .varieties__card-visual{position:relative;height:180px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(196,155,50,.05),rgba(245,166,35,.08))}
    @media(max-width:576px){.varieties__card-visual{height:140px}}
    @media(max-width:480px){.varieties__card-visual{height:120px}}
    .varieties__card-emoji{font-size:5rem;filter:drop-shadow(0 8px 20px rgba(0,0,0,.3))}
    @media(max-width:768px){.varieties__card-emoji{font-size:4rem}}
    @media(max-width:576px){.varieties__card-emoji{font-size:3.5rem}}
    @media(max-width:480px){.varieties__card-emoji{font-size:3rem}}
    .varieties__card-badge{position:absolute;top:16px;right:16px;font-family:'Jost',sans-serif;font-size:.65rem;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:#1A0F05;background:linear-gradient(135deg,#C49B32,#FFD700);padding:4px 12px}
    @media(max-width:576px){.varieties__card-badge{top:12px;right:12px;font-size:.6rem;padding:3px 8px}}
    .varieties__card-body{padding:28px}
    @media(max-width:768px){.varieties__card-body{padding:24px}}
    @media(max-width:576px){.varieties__card-body{padding:20px}}
    @media(max-width:480px){.varieties__card-body{padding:16px}}
    .varieties__card-body h3{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#FDF5E6;margin-bottom:4px}
    @media(max-width:768px){.varieties__card-body h3{font-size:1.3rem}}
    @media(max-width:576px){.varieties__card-body h3{font-size:1.2rem}}
    @media(max-width:480px){.varieties__card-body h3{font-size:1.1rem}}
    .varieties__card-origin{font-family:'Cormorant Garamond',serif;font-size:.9rem;color:#C49B32;display:block;margin-bottom:12px}
    @media(max-width:576px){.varieties__card-origin{font-size:.8rem}}
    @media(max-width:480px){.varieties__card-origin{font-size:.75rem}}
    .varieties__card-body p{font-size:.9rem;color:rgba(253,245,230,.5);line-height:1.7;margin-bottom:20px}
    @media(max-width:768px){.varieties__card-body p{font-size:.85rem;margin-bottom:16px}}
    @media(max-width:576px){.varieties__card-body p{font-size:.8rem;margin-bottom:14px}}
    @media(max-width:480px){.varieties__card-body p{font-size:.75rem;margin-bottom:12px}}
    .varieties__card-meta{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
    @media(max-width:576px){.varieties__card-meta{gap:8px;margin-bottom:16px}}
    @media(max-width:480px){.varieties__card-meta{gap:6px;margin-bottom:12px}}
    .varieties__card-meta-item{display:flex;align-items:center;gap:12px}
    @media(max-width:576px){.varieties__card-meta-item{gap:10px}}
    @media(max-width:480px){.varieties__card-meta-item{gap:8px}}
    .varieties__card-meta-item .label{font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(253,245,230,.4);width:70px;flex-shrink:0}
    @media(max-width:576px){.varieties__card-meta-item .label{font-size:.65rem;width:60px}}
    @media(max-width:480px){.varieties__card-meta-item .label{font-size:.6rem;width:55px}}
    .varieties__bar{flex:1;height:4px;background:rgba(253,245,230,.08);border-radius:2px;overflow:hidden}
    @media(max-width:480px){.varieties__bar{height:3px}}
    .varieties__bar-fill{height:100%;background:linear-gradient(90deg,#C49B32,#F5A623);border-radius:2px;transition:width 1s ease-out}
    .varieties__card-price{display:flex;align-items:baseline;gap:6px;margin-bottom:20px}
    @media(max-width:576px){.varieties__card-price{margin-bottom:16px}}
    @media(max-width:480px){.varieties__card-price{margin-bottom:12px}}
    .varieties__card-from{font-size:.75rem;color:rgba(253,245,230,.4);text-transform:uppercase;letter-spacing:.1em}
    @media(max-width:576px){.varieties__card-from{font-size:.7rem}}
    @media(max-width:480px){.varieties__card-from{font-size:.65rem}}
    .varieties__card-amount{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:#FFD700}
    @media(max-width:768px){.varieties__card-amount{font-size:1.6rem}}
    @media(max-width:576px){.varieties__card-amount{font-size:1.4rem}}
    @media(max-width:480px){.varieties__card-amount{font-size:1.2rem}}
    .varieties__card-unit{font-size:.85rem;color:rgba(253,245,230,.4)}
    @media(max-width:576px){.varieties__card-unit{font-size:.8rem}}
    @media(max-width:480px){.varieties__card-unit{font-size:.75rem}}
    .varieties__card-btn{width:100%;justify-content:center}
    .varieties__card-email{margin-bottom:16px}
    .varieties__email-input{width:100%;padding:10px 12px;background:rgba(253,245,230,.05);border:1px solid rgba(196,155,50,.2);border-radius:6px;color:#FDF5E6;font-family:'Jost',sans-serif;font-size:.85rem;outline:none;transition:all .2s ease}
    .varieties__email-input::placeholder{color:rgba(253,245,230,.3)}
    .varieties__email-input:focus{border-color:#C49B32;background:rgba(253,245,230,.08)}
    @media(max-width:576px){.varieties__email-input{padding:8px 10px;font-size:.8rem}}
    .varieties__email-label{display:block;font-family:'Jost',sans-serif;font-size:.65rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(253,245,230,.6);margin-bottom:6px}
    .required{color:#ff4444;font-weight:700;margin-left:2px}
    .varieties__card--out-of-stock{opacity:.7;filter:grayscale(.3)}
    .varieties__card-badge--out-of-stock{background:#ff4444;color:#fff}
    .varieties__card-btn:disabled{opacity:.5;cursor:not-allowed;background:rgba(196,155,50,.3)}
  `]
})
export class VarietiesComponent implements AfterViewInit {
  varieties = [
    {name:'Kesar',emoji:'🥭',origin:'Junagadh, Gujarat',description:'Named after saffron for its deep orange pulp. Intensely sweet with a hint of citrus and floral notes.',sweetness:90,aroma:85,fibre:15,price:'800',badge:'Premium Choice',email:''},
    {name:'Alphonso Hapus',emoji:'🥭',origin:'Ratnagiri, Maharashtra',description:'The undisputed King of Mangoes. Rich saffron flesh, zero fibre, intoxicating aroma. ',sweetness:95,aroma:98,fibre:10,price:'1,200',badge:'Limited Stock',email:''},
    {name:'Devgad Hapus',emoji:'🥭',origin:'Devgad, Maharashtra',description:"Slightly tangier cousin of the Ratnagiri Alphonso. Firmer flesh, excellent for cutting. ",sweetness:88,aroma:92,fibre:12,price:'1,000',badge:'Out of Stock',email:'',outOfStock:true},
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
