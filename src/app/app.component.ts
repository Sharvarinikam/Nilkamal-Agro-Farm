import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { JourneyComponent } from './components/journey/journey.component';
import { SpecialComponent } from './components/special/special.component';
import { VarietiesComponent } from './components/varieties/varieties.component';
import { FarmToHomeComponent } from './components/farm-to-home/farm-to-home.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { OrderPopupComponent } from './components/order-popup/order-popup.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { ScrollAnimationService } from './services/scroll-animation.service';
import { ConfirmationService } from './services/confirmation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    LoaderComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    JourneyComponent,
    SpecialComponent,
    VarietiesComponent,
    FarmToHomeComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent,
    OrderPopupComponent,
    ConfirmationPopupComponent,
  ],
  template: `
    <app-loader
      *ngIf="isLoading"
      (loadingComplete)="onLoadingComplete()">
    </app-loader>

    <div class="site-wrapper" [class.visible]="!isLoading">
      <div class="grain-overlay"></div>
      <app-navbar></app-navbar>

      <main class="main-content" id="scrollContainer">
        <app-hero></app-hero>
        <app-about></app-about>
        <app-journey></app-journey>
        <app-special></app-special>
        <app-varieties></app-varieties>
        <app-farm-to-home></app-farm-to-home>
        <app-testimonials></app-testimonials>
        <app-contact></app-contact>
      </main>

      <app-footer></app-footer>
    </div>

    <app-order-popup></app-order-popup>
    <app-confirmation-popup [show]="showConfirmation" (closed)="onConfirmationClosed()"></app-confirmation-popup>
  `,
  styles: [`
    :host { display: block; }

    .site-wrapper {
      opacity: 0;
      transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);

      &.visible {
        opacity: 1;
      }
    }

    .main-content {
      position: relative;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = true;
  showConfirmation = false;

  constructor(
    private scrollService: ScrollAnimationService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
  
  switchLang(lang: string) {
    this.translate.use(lang);
  }
  
  ngOnInit(): void {
    document.body.classList.add('loading');
    
    // Subscribe to confirmation service
    this.confirmationService.confirmation$.subscribe(() => {
      this.showConfirmation = true;
    });
  }
  
  onLoadingComplete(): void {
    this.isLoading = false;
    document.body.classList.remove('loading');
    setTimeout(() => this.scrollService.refresh(), 100);
  }
  
  showConfirmationPopup(): void {
    this.showConfirmation = true;
  }

  onConfirmationClosed(): void {
    this.showConfirmation = false;
  }
  
  ngOnDestroy(): void {
    this.scrollService.killAll();
  }
  
}
