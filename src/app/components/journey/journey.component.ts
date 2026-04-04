import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationService } from '../../services/scroll-animation.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface JourneyStage {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="journey" id="journey" #journeySection>
      <div class="journey__header">
        <span class="subheading reveal-el">The Sacred Lifecycle</span>
        <h2 class="section-title reveal-el">From Seed to<br><em class="section-title--gold">Golden Perfection</em></h2>
        <p class="section-subtitle reveal-el">Witness the miraculous journey of our Kesar</p>
        <div class="ornament reveal-el"><div class="ornament__diamond"></div></div>
      </div>
      <div class="journey__timeline" #timeline>
        <div class="journey__image-sidebar" #imageSidebar>
          <div class="journey__image-container" #journeyImage>
            <div class="journey__stage-image" *ngFor="let stage of stages; let i = index" [class.active]="i === currentStageIndex">
              <div class="journey__stage-image-content">
                <img [src]="getImagePath(i)" [alt]="stage.title" class="journey__stage-img">
              </div>
            </div>
          </div>
          <div class="journey__stage-label" #stageLabel>{{ currentLabel }}</div>
        </div>
        <div class="journey__stages">
          <div class="journey__stage" *ngFor="let stage of stages; let i = index" [attr.data-index]="i" [class.active]="i <= currentStageIndex">
            <div class="journey__stage-marker" [style.borderColor]="stage.color"><span>{{ stage.icon }}</span></div>
            <div class="journey__stage-content">
              <span class="journey__stage-step" [style.color]="stage.color">Stage {{ i + 1 }}</span>
              <h3>{{ stage.title }}</h3><em>{{ stage.subtitle }}</em><p>{{ stage.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .journey{position:relative;padding:clamp(80px,10vh,140px) clamp(20px,5vw,80px);background:linear-gradient(180deg,#1A0F05 0%,#2D1810 30%,#251510 70%,#1A0F05 100%);color:#FDF5E6}
    .journey__header{text-align:center;max-width:700px;margin:0 auto clamp(60px,8vh,100px)}
    .journey__header .section-title{color:#FDF5E6}
    .journey__header .section-subtitle{color:rgba(253,245,230,.5);margin:0 auto;font-family:'Cormorant Garamond',serif;font-size:clamp(1rem,1.8vw,1.35rem);font-weight:300;font-style:italic;max-width:600px}
    .journey__timeline{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:350px 1fr;gap:60px}
    @media(max-width:1024px){.journey__timeline{grid-template-columns:1fr}}
    .journey__image-sidebar{position:sticky;top:15vh;height:fit-content;display:flex;flex-direction:column;align-items:center;gap:20px}
    @media(max-width:1024px){.journey__image-sidebar{display:none}}
    .journey__image-container{width:320px;height:320px;position:relative;overflow:hidden;border:2px solid rgba(196,155,50,.3);background:linear-gradient(135deg,#1A0F05,#2D1810)}
    .journey__stage-image{position:absolute;inset:0;opacity:0;transition:opacity .4s ease-in-out}
    .journey__stage-image:first-child{opacity:1}
    .journey__stage-image.active{opacity:1}
    .journey__stage-image-content{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .journey__stage-img{width:100%;height:100%;object-fit:cover}
    .journey__stage-label{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-style:italic;color:#C49B32;letter-spacing:.05em;transition:opacity .4s ease-in-out}
    .journey__stages{display:flex;flex-direction:column;position:relative}
    .journey__stages::before{content:'';position:absolute;left:24px;top:0;bottom:0;width:1px;background:linear-gradient(180deg,transparent,rgba(196,155,50,.3),transparent)}
    @media(max-width:768px){.journey__stages::before{left:18px}}
    .journey__stage{display:flex;gap:28px;padding:40px 0;opacity:.3;transition:opacity .6s}
    .journey__stage.active{opacity:1}
    .journey__stage-marker{flex-shrink:0;width:48px;height:48px;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:1.4rem;background:#1A0F05;z-index:1}
    @media(max-width:768px){.journey__stage-marker{width:36px;height:36px;font-size:1rem}}
    .journey__stage-content h3{font-family:'Playfair Display',serif;font-size:clamp(1.3rem,2.5vw,1.8rem);font-weight:700;color:#FDF5E6;margin-bottom:4px}
    .journey__stage-content em{font-family:'Cormorant Garamond',serif;font-size:1rem;color:rgba(196,155,50,.7);display:block;margin-bottom:12px}
    .journey__stage-content p{font-size:.95rem;color:rgba(253,245,230,.55);line-height:1.8;max-width:480px}
    .journey__stage-step{font-family:'Jost',sans-serif;font-size:.7rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:6px}
  `]
})
export class JourneyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('journeySection') journeySection!: ElementRef;
  @ViewChild('stageLabel') stageLabel!: ElementRef;

  currentLabel = 'The Seed';
  currentStageIndex = 0;
  private scrollTriggers: ScrollTrigger[] = [];

  stages: JourneyStage[] = [
    {icon:'🌰',title:'The Sacred Seed',subtitle:'December — The Quiet Beginning',description:'Selected from the finest Kesar mother trees, each seed carries within it seventy years of heritage genetics. Planted in our ancestral soil, blessed by the winter sun.',color:'#8B6914'},
    {icon:'🌱',title:'The First Sprout',subtitle:'January — Awakening',description:'A tender green shoot breaks through rich Pune earth. Our farmers watch over each sapling like a newborn child, shielding it from wind and excess rain.',color:'#6B9E3A'},
    {icon:'🪴',title:'The Growing Sapling',subtitle:'February — Strength',description:'Roots reach deep into mineral-rich black soil. The sapling strengthens, its trunk thickening, leaves broadening to drink the coastal sun.',color:'#4A7C3A'},
    {icon:'🌳',title:'The Majestic Tree',subtitle:'March — Full Crown',description:'A magnificent canopy unfolds. Our Kesar trees stand like royalty in the orchard — their dense crowns creating cathedral-like shade below.',color:'#2D5A1E'},
    {icon:'🌸',title:'The Golden Blossom',subtitle:'April — The Promise',description:'Thousands of tiny cream-white flowers burst into bloom, filling the orchard with intoxicating fragrance. Bees dance between blossoms in ancient pollination rituals.',color:'#F5E6B8'},
    {icon:'🟢',title:'The Raw Mango',subtitle:'May — Green Gold',description:'Firm, aromatic, vibrant green. The raw Kesar hangs heavy on the branch, already carrying the promise of its legendary sweetness. Patience rewards.',color:'#7CB342'},
    {icon:'🥭',title:'The Ripe Kesar',subtitle:'June — Golden Perfection',description:'Bathed in golden sunlight, the Kesar achieves its legendary saffron hue. The flesh turns to silk, the aroma becomes divine. The King of Fruits is crowned.',color:'#F5A623'},
  ];

  constructor(private scroll: ScrollAnimationService, private ngZone: NgZone) {}

  getImagePath(stageIndex: number): string {
    return `/assets/images/stage-${stageIndex + 1}.jpeg`;
  }

  ngAfterViewInit(): void {
    this.scroll.revealElements('.journey__header .reveal-el');
    this.currentStageIndex = 0;
    const section = this.journeySection.nativeElement;
    const stages = section.querySelectorAll('.journey__stage');
    const st = ScrollTrigger.create({
      trigger: section, start: 'top 20%', end: 'bottom 80%', scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const idx = Math.min(Math.floor(progress * this.stages.length), this.stages.length - 1);
        this.ngZone.run(() => {
          this.currentStageIndex = idx;
          this.currentLabel = this.stages[idx].title;
        });
        stages.forEach((el: Element, i: number) => { el.classList.toggle('active', i <= idx); });
      },
    });
    this.scrollTriggers.push(st);
  }

  ngOnDestroy(): void { this.scrollTriggers.forEach(st => st.kill()); }
}
