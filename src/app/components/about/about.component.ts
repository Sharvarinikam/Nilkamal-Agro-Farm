import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about" id="about">
      <div class="about__ornament-top">
        <svg viewBox="0 0 1200 20" preserveAspectRatio="none">
          <path d="M0 10 Q300 0 600 10 Q900 20 1200 10" stroke="rgba(196,155,50,0.2)" fill="none" stroke-width="1"/>
        </svg>
      </div>
      <div class="about__container">
        <div class="about__left reveal-el">
          <div class="about__image-frame">
            <img src="/assets/images/hero.png" alt="Our Ancestral Orchards" class="about__image">
            <div class="about__image-border"></div>
          </div>
          <div class="about__stats">
            <div class="about__stat" *ngFor="let stat of stats">
              <span class="about__stat-number">{{ stat.value }}</span>
              <span class="about__stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
        <div class="about__right">
          <span class="subheading reveal-el">Our Heritage</span>
          <h2 class="section-title reveal-el">Three Generations<br>of Mango Royalty</h2>
          <div class="ornament reveal-el"><div class="ornament__diamond"></div></div>
          <div class="about__text reveal-el">
            <p>In 1952, our grandfather planted the first Alphonso saplings on the sun-drenched slopes of Pune. He believed that the finest mangoes come not from science alone, but from a deep reverence for the land, the seasons, and the ancient wisdom passed down through generations.</p>
            <p>Today, Nilkamal Agro Farms spans over 15 acres of heritage orchards. Every mango that leaves our farm carries the warmth of our soil, the sweetness of monsoon rains, and the love of a family that has dedicated its life to growing the king of fruits.</p>
          </div>
          <div class="about__values reveal-el">
            <div class="about__value" *ngFor="let value of values">
              <span class="about__value-icon">{{ value.icon }}</span>
              <div><strong>{{ value.title }}</strong><p>{{ value.desc }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about{position:relative;padding:clamp(80px,10vh,140px) clamp(20px,5vw,80px);background:linear-gradient(180deg,#FFFDF7 0%,#FDF5E6 50%,#FAF0DC 100%)}
    .about__ornament-top{position:absolute;top:0;left:0;right:0;height:20px}
    .about__ornament-top svg{width:100%;height:100%}
    .about__container{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1.2fr;gap:clamp(40px,6vw,100px);align-items:center}
    @media(max-width:1024px){.about__container{grid-template-columns:1fr}}
    .about__image-frame{position:relative;aspect-ratio:4/5;background:linear-gradient(135deg,#F0E4CE,#D9C9A8);overflow:hidden}
    .about__image{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}
    .about__image:hover{transform:scale(1.05)}
    .about__image-border{position:absolute;inset:12px;border:1px solid rgba(196,155,50,.3);pointer-events:none}
    .about__stats{display:grid;grid-template-columns:repeat(3,1fr);margin-top:24px;border:1px solid rgba(196,155,50,.2)}
    .about__stat{display:flex;flex-direction:column;align-items:center;padding:20px 12px;border-right:1px solid rgba(196,155,50,.2)}
    .about__stat:last-child{border-right:none}
    .about__stat-number{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3vw,2.5rem);font-weight:700;background:linear-gradient(135deg,#C49B32,#8B6914);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .about__stat-label{font-family:'Jost',sans-serif;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:#8B7D4A;text-align:center;margin-top:4px}
    .about__text p{font-size:clamp(.95rem,1.2vw,1.08rem);color:#5C4A3E;line-height:1.9;margin-bottom:18px}
    .about__text p:first-child::first-letter{font-family:'Playfair Display',serif;font-size:3.5em;float:left;line-height:.8;margin:4px 12px 0 0;color:#C49B32;font-weight:700}
    .about__values{display:flex;flex-direction:column;gap:18px;margin-top:32px}
    .about__value{display:flex;gap:16px;align-items:flex-start}
    .about__value strong{display:block;font-family:'Playfair Display',serif;font-size:1rem;color:#3B2314;margin-bottom:2px}
    .about__value p{font-size:.9rem;color:#7A6A5E;line-height:1.6;margin:0}
    .about__value-icon{font-size:1.5rem;flex-shrink:0;width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(196,155,50,.1);border:1px solid rgba(196,155,50,.2)}
  `]
})
export class AboutComponent implements AfterViewInit {
  stats = [
    { value: '70+', label: 'Years of Legacy' },
    { value: '50', label: 'Acres of Orchards' },
    { value: '10K+', label: 'Trees Nurtured' },
  ];
  values = [
    { icon: '🌿', title: 'Chemical-Free Cultivation', desc: 'No pesticides, no shortcuts—only organic methods our ancestors trusted.' },
   // { icon: '👑', title: 'Royal GI Tagged Alphonso', desc: 'Certified Hapus from the legendary Ratnagiri-Devgad belt.' },
    { icon: '🤲', title: 'Hand-Picked with Care', desc: 'Every mango is touched by human hands, never machines, from tree to box.' },
  ];
  constructor(private scroll: ScrollAnimationService) {}
  ngAfterViewInit(): void { this.scroll.revealElements('.about .reveal-el'); }
}
