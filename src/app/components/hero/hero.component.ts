import {
  Component, AfterViewInit, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="hero" id="hero">
      <div class="hero__bg">
        <div class="hero__bg-gradient"></div>
        <div class="hero__bg-pattern"></div>
        <div class="hero__particles" #particlesContainer></div>
      </div>
      <div class="hero__mango-interactive" #mangoInteractive>
        <div class="hero__mango-container" #mangoContainer>
          <div class="hero__mango" #mango>
            <div class="hero__image-slideshow">
              <img *ngFor="let stage of [1,2,3,4,5,6,7]; let i = index"
                [src]="'/assets/stage-' + stage + '.jpeg'"
                [alt]="'Stage ' + stage"
                [class.active]="i === currentImageIndex"
                class="hero__slideshow-image">
            </div>
            <div class="hero__mango-glow"></div>
            <div class="hero__mango-particles">
              <div class="particle" *ngFor="let i of [0,1,2,3,4]" [style.animationDelay]="i * 0.2 + 's'"></div>
            </div>
          </div>
        </div>
        <div class="hero__mango-info" #mangoInfo>
          <div class="hero__mango-title">Premium Alphonso</div>
          <div class="hero__mango-subtitle">GI Tagged &bull; Pune Origin</div>
        </div>
      </div>
      <div class="hero__content">
        <div class="hero__badge" #badge>
          <span class="hero__badge-diamond">&#9670;</span>
          <span>{{ 'HERO.BADGE' | translate }}</span>
          <span class="hero__badge-diamond">&#9670;</span>
        </div>
        <h1 class="hero__title" #title>
          <span class="hero__title-line">{{ 'HERO.TITLE_LINE1' | translate }}</span>
          <span class="hero__title-line hero__title-line--gold">{{ 'HERO.TITLE_LINE2' | translate }}</span>
          <span class="hero__title-line">{{ 'HERO.TITLE_LINE3' | translate }}</span>
        </h1>
        <p class="hero__subtitle" #subtitle>
          {{ 'HERO.SUBTITLE' | translate }}
        </p>
        <div class="hero__actions" #actions>
          <a href="#varieties" class="btn-royal"><span>{{ 'HERO.EXPLORE_VARIETIES' | translate }}</span></a>
          <a href="#about" class="btn-outline"><span>{{ 'HERO.OUR_LEGACY' | translate }}</span></a>
        </div>
        <div class="hero__features">
          <div class="hero__feature" #feature1><span class="hero__feature-icon">&#128081;</span><span class="hero__feature-text">{{ 'HERO.FEATURE1' | translate }}</span></div>
          <div class="hero__feature" #feature2><span class="hero__feature-icon">&#127807;</span><span class="hero__feature-text">{{ 'HERO.FEATURE2' | translate }}</span></div>
          <div class="hero__feature" #feature3><span class="hero__feature-icon">&#127942;</span><span class="hero__feature-text">{{ 'HERO.FEATURE3' | translate }}</span></div>
        </div>
      </div>
      <div class="hero__scroll-hint" #scrollHint><div class="hero__scroll-line"></div><span>{{ 'HERO.SCROLL_HINT' | translate }}</span></div>
      <div class="hero__corner hero__corner--tl"></div><div class="hero__corner hero__corner--tr"></div>
      <div class="hero__corner hero__corner--bl"></div><div class="hero__corner hero__corner--br"></div>
    </section>
  `,
  styles: [`
    .hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;padding:clamp(100px,12vh,140px) clamp(20px,5vw,80px) clamp(60px,8vh,100px)}
    .hero__bg{position:absolute;inset:0;z-index:0}
    .hero__bg-gradient{position:absolute;inset:0;background:linear-gradient(160deg,#0F0A05 0%,#1A0F05 20%,#2D1810 50%,#1A1205 80%,#0F0A05 100%)}
    .hero__bg-pattern{position:absolute;inset:0;opacity:.03;background-image:radial-gradient(circle at 25% 25%,#C49B32 1px,transparent 1px),radial-gradient(circle at 75% 75%,#C49B32 1px,transparent 1px);background-size:60px 60px}
    .hero__particles{position:absolute;inset:0;overflow:hidden;pointer-events:none}
    :host ::ng-deep .bg-particle{position:absolute;border-radius:50%;opacity:.6;animation:bgFloat 15s ease-in-out infinite}
    :host ::ng-deep .bg-particle--dot{box-shadow:0 0 10px currentColor}
    :host ::ng-deep .bg-particle--ring{border:2px solid currentColor;background:transparent}
    :host ::ng-deep .bg-particle--star{text-shadow:0 0 8px currentColor}
    .hero__mango-interactive{position:absolute;right:-5%;top:10%;width:55%;height:80%;z-index:1;display:flex;align-items:center;justify-content:center}
    @media(max-width:1024px){.hero__mango-interactive{right:-10%;width:60%;opacity:.4}}
    @media(max-width:768px){.hero__mango-interactive{right:-15%;top:15%;width:70%;opacity:.3}}
    .hero__mango-container{position:relative;width:500px;height:500px;cursor:pointer;transition:transform .3s ease}
    .hero__mango-container:hover{transform:scale(1.05)}
    .hero__mango{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;animation:float 6s ease-in-out infinite}
    .hero__image-slideshow{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center}
    .hero__slideshow-image{position:absolute;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity 1s ease-in-out;filter:drop-shadow(0 8px 20px rgba(245,166,35,.3))}
    .hero__slideshow-image.active{opacity:1}
    .hero__mango-glow{position:absolute;inset:-20px;background:radial-gradient(circle,rgba(245,166,35,.2) 0%,transparent 70%);border-radius:50%;animation:glow 3s ease-in-out infinite alternate}
    .hero__mango-particles{position:absolute;inset:0;pointer-events:none}
    .hero__mango-particles .particle{position:absolute;width:4px;height:4px;background:#FFD700;border-radius:50%;opacity:0;animation:particleFloat 4s ease-in-out infinite}
    .hero__mango-info{position:absolute;bottom:-60px;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;opacity:0;animation:slideUp 1s ease-out .5s forwards}
    .hero__mango-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#FFD700;margin-bottom:4px}
    .hero__mango-subtitle{font-family:'Jost',sans-serif;font-size:.8rem;color:rgba(253,245,230,.7);letter-spacing:.1em;text-transform:uppercase}
    .hero__content{position:relative;z-index:2;max-width:680px}
    .hero__badge{display:inline-flex;align-items:center;gap:12px;font-family:'Jost',sans-serif;font-size:.75rem;font-weight:400;color:rgba(196,155,50,.7);letter-spacing:.25em;text-transform:uppercase;margin-bottom:28px;opacity:0}
    .hero__badge-diamond{font-size:.5rem;color:#C49B32}
    .hero__title{margin-bottom:28px;opacity:0}
    .hero__title-line{display:block;font-family:'Playfair Display',serif;font-size:clamp(3rem,7vw,5.5rem);font-weight:800;color:#FDF5E6;line-height:1.05;letter-spacing:-.02em}
    .hero__title-line--gold{background:linear-gradient(135deg,#C49B32 0%,#FFD700 30%,#E8C868 60%,#C49B32 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-style:italic}
    .hero__subtitle{font-family:'Cormorant Garamond',serif;font-size:clamp(1.1rem,2vw,1.45rem);font-weight:300;color:rgba(253,245,230,.6);line-height:1.8;margin-bottom:40px;max-width:520px;opacity:0}
    .hero__actions{display:flex;gap:16px;flex-wrap:wrap;opacity:0;margin-bottom:40px}
    .hero__features{display:flex;gap:24px;opacity:0;flex-wrap:wrap;justify-content:center}
    @media(max-width:768px){.hero__features{flex-direction:column;gap:16px}}
    .hero__feature{display:flex;align-items:center;gap:8px;padding:12px 20px;border:1px solid rgba(196,155,50,.2);background:rgba(26,15,5,.6);transition:all .3s ease}
    .hero__feature:hover{border-color:rgba(196,155,50,.4);background:rgba(26,15,5,.8);transform:translateY(-2px)}
    .hero__feature-icon{font-size:1.2rem}
    .hero__feature-text{font-family:'Jost',sans-serif;font-size:.8rem;color:rgba(253,245,230,.8);letter-spacing:.05em;text-transform:uppercase}
    .hero__scroll-hint{position:absolute;bottom:-40px;left:0;display:flex;flex-direction:column;align-items:center;gap:12px;opacity:0}
    .hero__scroll-hint span{font-family:'Jost',sans-serif;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(196,155,50,.4)}
    .hero__scroll-line{width:1px;height:50px;background:linear-gradient(180deg,#C49B32,transparent);animation:scrollPulse 2s ease-in-out infinite}
    .hero__corner{position:absolute;width:60px;height:60px;border-color:rgba(196,155,50,.2);border-style:solid;z-index:3}
    .hero__corner--tl{top:30px;left:30px;border-width:1px 0 0 1px}
    .hero__corner--tr{top:30px;right:30px;border-width:1px 1px 0 0}
    .hero__corner--bl{bottom:30px;left:30px;border-width:0 0 1px 1px}
    .hero__corner--br{bottom:30px;right:30px;border-width:0 1px 1px 0}
    @media(max-width:768px){.hero__corner{display:none}}
    @keyframes bgFloat{0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:.6}25%{transform:translateY(-20px) translateX(10px) scale(1.1);opacity:.8}50%{transform:translateY(-30px) translateX(-5px) scale(.9);opacity:.4}75%{transform:translateY(-15px) translateX(15px) scale(1.05);opacity:.7}}
    @keyframes scrollPulse{0%,100%{opacity:.4;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.2)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes glow{0%{opacity:.2}100%{opacity:.4}}
    @keyframes particleFloat{0%{opacity:0;transform:translate(0,0) scale(0)}50%{opacity:1;transform:translate(20px,-10px) scale(1)}100%{opacity:0;transform:translate(40px,-20px) scale(.5)}}
    @keyframes slideUp{0%{opacity:0;transform:translateX(-50%) translateY(20px)}100%{opacity:1;transform:translateX(-50%) translateY(0)}}
  `]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particlesContainer') particlesContainer!: ElementRef;
  @ViewChild('mangoInteractive') mangoInteractive!: ElementRef;
  @ViewChild('mangoContainer') mangoContainer!: ElementRef;
  @ViewChild('mango') mango!: ElementRef;
  @ViewChild('mangoInfo') mangoInfo!: ElementRef;
  @ViewChild('badge') badge!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  @ViewChild('actions') actions!: ElementRef;
  @ViewChild('feature1') feature1!: ElementRef;
  @ViewChild('feature2') feature2!: ElementRef;
  @ViewChild('feature3') feature3!: ElementRef;
  @ViewChild('scrollHint') scrollHint!: ElementRef;

  private animationTimeline: gsap.core.Timeline | null = null;
  private particles: HTMLElement[] = [];
  private slideshowInterval: ReturnType<typeof setInterval> | null = null;
  currentImageIndex = 0;

  ngAfterViewInit(): void {
    this.createFloatingParticles();
    this.setupInteractions();
    this.animateEntrance();
    this.startSlideshow();
  }

  private createFloatingParticles(): void {
    if (!this.particlesContainer) return;
    const types = [
      {t:'dot',s:1,c:'rgba(255,215,0,.8)'},{t:'dot',s:2,c:'rgba(255,215,0,.6)'},{t:'dot',s:3,c:'rgba(196,155,50,.4)'},
      {t:'ring',s:2,c:'rgba(245,166,35,.3)'},{t:'ring',s:3,c:'rgba(255,215,0,.2)'},
      {t:'star',s:2,c:'rgba(255,215,0,.9)'},{t:'star',s:3,c:'rgba(255,215,0,.7)'},
      {t:'cross',s:3,c:'rgba(196,155,50,.4)'},{t:'diamond',s:2,c:'rgba(245,166,35,.4)'}
    ];
    for(let i=0;i<80;i++){
      const pt=types[Math.floor(Math.random()*types.length)];
      const el=document.createElement('div');
      const l=`${Math.random()*100}%`,tp=`${Math.random()*100}%`,d=`${Math.random()*5}s`;
      if(pt.t==='star'){el.className='bg-particle bg-particle--star';el.innerHTML='✦';el.style.cssText=`position:absolute;font-size:${pt.s}px;left:${l};top:${tp};animation:bgFloat ${2+Math.random()*3}s ease-in-out infinite;animation-delay:${d};color:${pt.c};opacity:.9`}
      else if(pt.t==='cross'){el.className='bg-particle bg-particle--cross';el.innerHTML='✚';el.style.cssText=`position:absolute;font-size:${pt.s}px;left:${l};top:${tp};animation:bgFloat ${8+Math.random()*6}s linear infinite;animation-delay:${d};color:${pt.c};opacity:.7`}
      else if(pt.t==='diamond'){el.className='bg-particle bg-particle--diamond';el.innerHTML='◆';el.style.cssText=`position:absolute;font-size:${pt.s}px;left:${l};top:${tp};animation:bgFloat ${3+Math.random()*4}s ease-in-out infinite;animation-delay:${d};color:${pt.c};opacity:.8`}
      else if(pt.t==='ring'){el.className='bg-particle bg-particle--ring';el.style.cssText=`position:absolute;width:${pt.s}px;height:${pt.s}px;border:2px solid ${pt.c};border-radius:50%;left:${l};top:${tp};animation:bgFloat ${15+Math.random()*10}s ease-in-out infinite;animation-delay:${d};opacity:.6`}
      else{el.className='bg-particle bg-particle--dot';el.style.cssText=`position:absolute;width:${pt.s}px;height:${pt.s}px;background:radial-gradient(circle,${pt.c},transparent);border-radius:50%;left:${l};top:${tp};animation:bgFloat ${10+Math.random()*15}s ease-in-out infinite;animation-delay:${d};opacity:.7;box-shadow:0 0 10px ${pt.c}`}
      this.particlesContainer.nativeElement.appendChild(el);
      this.particles.push(el);
    }
  }

  private setupInteractions(): void {
    if(!this.mangoContainer)return;
    this.mangoContainer.nativeElement.addEventListener('mouseenter',()=>{if(this.mango)gsap.to(this.mango.nativeElement,{scale:1.1,rotation:5,duration:.3,ease:'power2.out'})});
    this.mangoContainer.nativeElement.addEventListener('mouseleave',()=>{if(this.mango)gsap.to(this.mango.nativeElement,{scale:1,rotation:0,duration:.3,ease:'power2.out'})});
    this.mangoContainer.nativeElement.addEventListener('click',()=>{if(this.mangoInfo){const v=this.mangoInfo.nativeElement.style.opacity==='1';gsap.to(this.mangoInfo.nativeElement,{opacity:v?0:1,duration:.3,ease:'power2.out'})}});
  }

  private animateEntrance(): void {
    this.animationTimeline=gsap.timeline({delay:.3});
    this.animationTimeline
      .to(this.badge.nativeElement,{opacity:1,y:0,duration:.8,ease:'power3.out'}).fromTo(this.badge.nativeElement,{y:20},{y:0,duration:.8},'<')
      .to(this.title.nativeElement,{opacity:1,duration:1,ease:'power3.out'},'-=0.4').fromTo(this.title.nativeElement,{y:40},{y:0,duration:1},'<')
      .to(this.subtitle.nativeElement,{opacity:1,duration:.8,ease:'power3.out'},'-=0.5').fromTo(this.subtitle.nativeElement,{y:30},{y:0,duration:.8},'<')
      .to(this.actions.nativeElement,{opacity:1,duration:.8,ease:'power3.out'},'-=0.4').fromTo(this.actions.nativeElement,{y:20},{y:0,duration:.8},'<')
      .to([this.feature1.nativeElement,this.feature2.nativeElement,this.feature3.nativeElement],{opacity:1,y:0,duration:.8,ease:'power3.out',stagger:.1},'-=0.2')
      .fromTo([this.feature1.nativeElement,this.feature2.nativeElement,this.feature3.nativeElement],{y:30},{y:0,duration:.8,stagger:.1},'<')
      .to(this.scrollHint.nativeElement,{opacity:1,duration:1},'-=0.2');
  }

  private startSlideshow(): void {
    this.currentImageIndex=0;
    this.slideshowInterval=setInterval(()=>{this.currentImageIndex=(this.currentImageIndex+1)%7},3000);
  }

  ngOnDestroy(): void {
    this.animationTimeline?.kill();
    this.particles.forEach(p=>p.parentNode?.removeChild(p));
    this.particles=[];
    if(this.slideshowInterval)clearInterval(this.slideshowInterval);
  }
}
