import {
  Component, Input, Output, EventEmitter,
  AfterViewInit, ViewChild, ElementRef, OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapService, Coordinates, Address } from '../../services/map.service';

declare var L: any;

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'info' | 'success';
}

@Component({
  selector: 'app-map-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="map-modal-overlay" [class.active]="isVisible" (click)="closeOnOverlay($event)">
      <div class="map-modal" [class.active]="isVisible">

        <!-- Header -->
        <div class="map-modal__header">
          <h3>Select Delivery Location</h3>
          <button class="map-modal__close" (click)="close()" aria-label="Close">×</button>
        </div>

        <!-- Search bar -->
        <div class="map-modal__search">
          <div class="map-modal__search-input-wrap">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
              (keydown.escape)="searchResults = []"
              placeholder="Search for a street, area or landmark..."
              class="map-modal__search-input"
              autocomplete="off"
            />
            <button
              *ngIf="searchQuery"
              class="search-clear"
              (click)="clearSearch()"
              aria-label="Clear search"
            >×</button>
          </div>

          <button
            class="map-modal__locate-btn"
            (click)="getCurrentLocation()"
            [disabled]="isLocating"
            [class.locating]="isLocating"
            title="Use my current location"
          >
            <span class="locate-ring" *ngIf="isLocating"></span>
            <span class="locate-icon">📍</span>
            <span class="locate-label">{{ isLocating ? 'Locating…' : 'My Location' }}</span>
          </button>
        </div>

        <!-- Search results dropdown -->
        <div class="map-modal__search-results" *ngIf="searchResults.length > 0">
          <div
            class="map-modal__search-result"
            *ngFor="let result of searchResults"
            (click)="selectSearchResult(result)"
          >
            <span class="result-pin">📍</span>
            <div>
              <div class="map-modal__result-name">{{ result.address.formatted }}</div>
              <div class="map-modal__result-coords">
                {{ result.coordinates.lat.toFixed(5) }}, {{ result.coordinates.lng.toFixed(5) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Map area -->
        <div class="map-modal__map-container">

          <!-- Acquiring location overlay (shown before map is ready) -->
          <div class="map-modal__acquiring" *ngIf="isAcquiringLocation">
            <div class="acquiring-animation">
              <div class="acquiring-ring r1"></div>
              <div class="acquiring-ring r2"></div>
              <div class="acquiring-ring r3"></div>
              <div class="acquiring-pin">📍</div>
            </div>
            <p class="acquiring-text">Acquiring your location…</p>
            <p class="acquiring-sub">Please allow location access when prompted</p>
            <button class="acquiring-skip" (click)="skipToDefaultLocation()">
              Skip — Search manually instead
            </button>
          </div>

          <div #mapContainer class="map-modal__map"></div>
        </div>

        <!-- Selected address panel -->
        <div class="map-modal__selected-address" *ngIf="selectedAddress && !isAcquiringLocation">
          <div class="map-modal__address-label">
            <span>📌</span> Selected Address
          </div>
          <div class="map-modal__address-text">{{ selectedAddress.formatted }}</div>
        </div>

        <!-- Action buttons -->
        <div class="map-modal__actions">
          <button class="btn-outline" (click)="close()">Cancel</button>
          <button
            class="btn-royal"
            (click)="confirmSelection()"
            [disabled]="!selectedAddress || isConfirming || isAcquiringLocation"
          >
            <span *ngIf="isConfirming" class="btn-spinner"></span>
            {{ isConfirming ? 'Confirming…' : 'Confirm Location' }}
          </button>
        </div>

        <!-- Toast notifications -->
        <div class="toast-container">
          <div
            class="toast"
            *ngFor="let toast of toasts"
            [class]="'toast toast--' + toast.type"
          >
            {{ toast.message }}
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ── Overlay ── */
    .map-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.82);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      padding: 16px;
    }
    .map-modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* ── Modal shell ── */
    .map-modal {
      background: linear-gradient(160deg, #2D1810 0%, #3B2314 50%, #2D1810 100%);
      border: 1.5px solid rgba(196, 155, 50, 0.35);
      border-radius: 18px;
      max-width: 820px;
      width: 100%;
      max-height: 92vh;
      position: relative;
      transform: scale(0.88) translateY(24px);
      transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(196,155,50,0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .map-modal.active {
      transform: scale(1) translateY(0);
    }

    /* ── Header ── */
    .map-modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;
      border-bottom: 1px solid rgba(196, 155, 50, 0.18);
      flex-shrink: 0;
    }
    .map-modal__header h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: #FFD700;
      margin: 0;
      letter-spacing: 0.01em;
    }
    .map-modal__close {
      background: transparent;
      border: none;
      color: rgba(253, 245, 230, 0.5);
      font-size: 1.8rem;
      line-height: 1;
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s, color 0.2s;
    }
    .map-modal__close:hover {
      background: rgba(196, 155, 50, 0.15);
      color: #FDF5E6;
    }

    /* ── Search bar ── */
    .map-modal__search {
      display: flex;
      gap: 10px;
      padding: 14px 20px;
      border-bottom: 1px solid rgba(196, 155, 50, 0.15);
      flex-shrink: 0;
    }
    .map-modal__search-input-wrap {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      font-size: 0.9rem;
      pointer-events: none;
    }
    .map-modal__search-input {
      width: 100%;
      padding: 11px 36px 11px 36px;
      background: rgba(253, 245, 230, 0.06);
      border: 1px solid rgba(196, 155, 50, 0.22);
      border-radius: 10px;
      color: #FDF5E6;
      font-family: 'Jost', sans-serif;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    .map-modal__search-input::placeholder {
      color: rgba(253, 245, 230, 0.28);
    }
    .map-modal__search-input:focus {
      border-color: rgba(196, 155, 50, 0.6);
      background: rgba(253, 245, 230, 0.09);
    }
    .search-clear {
      position: absolute;
      right: 10px;
      background: transparent;
      border: none;
      color: rgba(253, 245, 230, 0.4);
      font-size: 1.1rem;
      cursor: pointer;
      line-height: 1;
      padding: 2px 4px;
      transition: color 0.2s;
    }
    .search-clear:hover { color: #FDF5E6; }

    /* Locate button */
    .map-modal__locate-btn {
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 14px;
      background: rgba(196, 155, 50, 0.1);
      border: 1px solid rgba(196, 155, 50, 0.28);
      border-radius: 10px;
      color: #FFD700;
      font-family: 'Jost', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .map-modal__locate-btn:hover:not(:disabled) {
      background: rgba(196, 155, 50, 0.2);
      border-color: rgba(196, 155, 50, 0.5);
    }
    .map-modal__locate-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .map-modal__locate-btn.locating .locate-icon { animation: pulse-pin 1s ease-in-out infinite; }
    .locate-ring {
      position: absolute;
      inset: -2px;
      border-radius: 10px;
      border: 1.5px solid rgba(196, 155, 50, 0.5);
      animation: ring-pulse 1.2s ease-out infinite;
    }
    @keyframes ring-pulse {
      0%   { opacity: 1;   transform: scale(1); }
      100% { opacity: 0;   transform: scale(1.12); }
    }
    @keyframes pulse-pin {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-3px); }
    }

    /* ── Search results ── */
    .map-modal__search-results {
      max-height: 190px;
      overflow-y: auto;
      border-bottom: 1px solid rgba(196, 155, 50, 0.15);
      flex-shrink: 0;
    }
    .map-modal__search-result {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 11px 20px;
      cursor: pointer;
      transition: background 0.15s;
      border-bottom: 1px solid rgba(196, 155, 50, 0.07);
    }
    .map-modal__search-result:last-child { border-bottom: none; }
    .map-modal__search-result:hover { background: rgba(196, 155, 50, 0.07); }
    .result-pin { font-size: 0.85rem; padding-top: 1px; flex-shrink: 0; }
    .map-modal__result-name {
      font-family: 'Jost', sans-serif;
      font-size: 0.875rem;
      color: #FDF5E6;
      margin-bottom: 3px;
      line-height: 1.35;
    }
    .map-modal__result-coords {
      font-family: 'Jost', sans-serif;
      font-size: 0.72rem;
      color: rgba(253, 245, 230, 0.4);
    }

    /* ── Map container ── */
    .map-modal__map-container {
      flex: 1;
      min-height: 360px;
      position: relative;
      overflow: hidden;
    }
    .map-modal__map {
      width: 100%;
      height: 100%;
      min-height: 360px;
    }

    /* ── Acquiring location overlay ── */
    .map-modal__acquiring {
      position: absolute;
      inset: 0;
      z-index: 500;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(30, 15, 8, 0.92);
      gap: 10px;
    }
    .acquiring-animation {
      position: relative;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }
    .acquiring-ring {
      position: absolute;
      border-radius: 50%;
      border: 1.5px solid rgba(196, 155, 50, 0.5);
      animation: expand-ring 2s ease-out infinite;
    }
    .r1 { width: 80px; height: 80px; animation-delay: 0s; }
    .r2 { width: 56px; height: 56px; animation-delay: 0.5s; }
    .r3 { width: 36px; height: 36px; animation-delay: 1s; }
    @keyframes expand-ring {
      0%   { opacity: 0.8; transform: scale(0.7); }
      100% { opacity: 0;   transform: scale(1.3); }
    }
    .acquiring-pin {
      font-size: 1.8rem;
      animation: bounce-pin 1s ease-in-out infinite;
    }
    @keyframes bounce-pin {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
    .acquiring-text {
      font-family: 'Jost', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: #FDF5E6;
      margin: 0;
    }
    .acquiring-sub {
      font-family: 'Jost', sans-serif;
      font-size: 0.78rem;
      color: rgba(253, 245, 230, 0.45);
      margin: 0;
    }
    .acquiring-skip {
      margin-top: 12px;
      padding: 8px 18px;
      background: transparent;
      border: 1px solid rgba(196, 155, 50, 0.3);
      border-radius: 8px;
      color: rgba(196, 155, 50, 0.8);
      font-family: 'Jost', sans-serif;
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .acquiring-skip:hover {
      background: rgba(196, 155, 50, 0.1);
      border-color: #C49B32;
      color: #FFD700;
    }

    /* ── Selected address ── */
    .map-modal__selected-address {
      padding: 14px 20px;
      border-top: 1px solid rgba(196, 155, 50, 0.18);
      background: rgba(196, 155, 50, 0.04);
      flex-shrink: 0;
    }
    .map-modal__address-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Jost', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #C49B32;
      margin-bottom: 6px;
    }
    .map-modal__address-text {
      font-family: 'Jost', sans-serif;
      font-size: 0.875rem;
      color: #FDF5E6;
      line-height: 1.45;
    }

    /* ── Action buttons ── */
    .map-modal__actions {
      display: flex;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid rgba(196, 155, 50, 0.15);
      flex-shrink: 0;
    }
    .map-modal__actions button {
      flex: 1;
      padding: 12px 24px;
      font-family: 'Jost', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid rgba(196, 155, 50, 0.28);
      color: #C49B32;
    }
    .btn-outline:hover {
      background: rgba(196, 155, 50, 0.08);
      border-color: #C49B32;
    }
    .btn-royal {
      background: linear-gradient(135deg, #C49B32, #F5A623);
      border: 1px solid transparent;
      color: #1A0F05;
      font-weight: 600;
    }
    .btn-royal:hover:not(:disabled) {
      background: linear-gradient(135deg, #F5A623, #C49B32);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(196, 155, 50, 0.3);
    }
    .btn-royal:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .btn-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(26, 15, 5, 0.3);
      border-top-color: #1A0F05;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ── Toasts ── */
    .toast-container {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 600;
      pointer-events: none;
      min-width: 280px;
      max-width: 90%;
    }
    .toast {
      padding: 10px 18px;
      border-radius: 10px;
      font-family: 'Jost', sans-serif;
      font-size: 0.82rem;
      font-weight: 500;
      text-align: center;
      animation: toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(8px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .toast--error   { background: rgba(180, 40, 40, 0.9);  color: #fff; }
    .toast--info    { background: rgba(196, 155, 50, 0.9); color: #1A0F05; }
    .toast--success { background: rgba(40, 140, 80, 0.9);  color: #fff; }

    /* ── Marker tooltip ── */
    :global(.marker-tooltip) {
      background: rgba(30, 15, 8, 0.92) !important;
      border: 1px solid #C49B32 !important;
      border-radius: 7px !important;
      color: #FDF5E6 !important;
      font-family: 'Jost', sans-serif !important;
      font-size: 0.72rem !important;
      padding: 5px 10px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
      max-width: 240px !important;
      white-space: normal !important;
    }

    /* ── Responsive ── */
    @media (max-width: 640px) {
      .map-modal { max-height: 96vh; border-radius: 14px; }
      .map-modal__search { flex-direction: column; }
      .map-modal__locate-btn { justify-content: center; }
      .map-modal__map { min-height: 280px; }
    }
  `]
})
export class MapModalComponent implements AfterViewInit, OnDestroy {

  @Input() set visible(value: boolean) {
    this.isVisible = value;
    if (value) {
      // Small tick so the overlay transition fires before we start heavy work
      setTimeout(() => this.initializeMap(), 50);
    } else {
      this.destroyMap();
    }
  }

  @Output() closed = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<{ coordinates: Coordinates; address: Address }>();

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  isVisible = false;
  map: any = null;
  marker: any = null;

  searchQuery = '';
  searchResults: { coordinates: Coordinates; address: Address }[] = [];
  selectedAddress: Address | null = null;
  selectedCoordinates: Coordinates | null = null;

  isLocating = false;
  isConfirming = false;
  isAcquiringLocation = true; // show acquiring overlay by default on open

  toasts: Toast[] = [];
  private toastCounter = 0;

  private searchTimeout: any;
  private leafletLoading = false;

  // India fallback centre
  private readonly INDIA_CENTER: [number, number] = [20.5937, 78.9629];
  private readonly INDIA_ZOOM = 5;

  constructor(
      private mapService: MapService,
      private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    // initializeMap is called via the visible setter; nothing needed here
  }

  ngOnDestroy(): void {
    this.destroyMap();
    clearTimeout(this.searchTimeout);
  }

  // ─────────────────────────────────────────────
  // Map lifecycle
  // ─────────────────────────────────────────────

  private initializeMap(): void {
    if (!this.mapContainer) return;
    if (this.map) {
      // Already created — just re-acquire location
      this.acquireCurrentLocation();
      return;
    }

    this.isAcquiringLocation = true;

    if (typeof L === 'undefined') {
      if (!this.leafletLoading) {
        this.leafletLoading = true;
        this.loadLeafletDynamically(() => this.createMap());
      }
    } else {
      this.createMap();
    }
  }

  private loadLeafletDynamically(callback: () => void): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => { this.leafletLoading = false; callback(); };
    script.onerror = () => {
      this.leafletLoading = false;
      this.showToast('Failed to load map library. Please refresh.', 'error');
    };
    document.head.appendChild(script);
  }

  private createMap(): void {
    if (typeof L === 'undefined' || !this.mapContainer) return;

    try {
      // Start at India centre; we'll fly to real location immediately after
      this.map = L.map(this.mapContainer.nativeElement, { zoomControl: true })
          .setView(this.INDIA_CENTER, this.INDIA_ZOOM);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      this.map.on('click', (e: any) => this.onMapClick(e.latlng));

      this.map.whenReady(() => {
        // Fix grey tiles that appear when map is initialised inside a hidden element
        setTimeout(() => {
          this.map?.invalidateSize();
          this.acquireCurrentLocation();
        }, 80);
      });

    } catch (err) {
      console.error('Map creation error:', err);
      this.showToast('Unable to initialise map. Please try again.', 'error');
    }
  }

  /**
   * Silently try to get the user's position and fly the map there.
   * Shows the acquiring overlay while waiting; hides it when done (or skipped).
   */
  private acquireCurrentLocation(): void {
    this.isAcquiringLocation = true;
    this.cdr.detectChanges();

    this.mapService.getCurrentLocation()
        .then(coords => {
          this.isAcquiringLocation = false;
          this.cdr.detectChanges();

          if (this.map) {
            this.map.setView([coords.lat, coords.lng], 16, { animate: true });
          }
          this.placeMarkerAndGeocode(coords);
        })
        .catch(err => {
          console.warn('Could not acquire location on open:', err.message);
          this.isAcquiringLocation = false;
          this.cdr.detectChanges();

          // Don't alert — user can still search or click on the map
          if (err.message?.toLowerCase().includes('denied')) {
            this.showToast('Location access denied. Search or tap the map.', 'info');
          }
          // Leave map at India centre so it's usable
        });
  }

  /** User clicked the "Skip" button inside the acquiring overlay */
  skipToDefaultLocation(): void {
    this.isAcquiringLocation = false;
    if (this.map) {
      this.map.setView(this.INDIA_CENTER, this.INDIA_ZOOM);
      this.map.invalidateSize();
    }
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.marker = null;
    this.selectedAddress = null;
    this.selectedCoordinates = null;
    this.isLocating = false;
    this.isConfirming = false;
    this.isAcquiringLocation = true;
    this.toasts = [];
  }

  // ─────────────────────────────────────────────
  // Map interaction
  // ─────────────────────────────────────────────

  onMapClick(latlng: { lat: number; lng: number }): void {
    this.placeMarkerAndGeocode(latlng);
  }

  private placeMarkerAndGeocode(coordinates: { lat: number; lng: number }): void {
    this.updateMarker(coordinates);
    this.mapService.reverseGeocode(coordinates).subscribe({
      next: addr => {
        this.selectedAddress = addr;
        this.selectedCoordinates = { lat: coordinates.lat, lng: coordinates.lng };
        this.searchQuery = addr.formatted || '';
        this.searchResults = [];
        // Update marker tooltip with the real address
        if (this.marker) {
          this.marker.setTooltipContent(
              addr.formatted?.split(',').slice(0, 3).join(', ') || 'Drag to refine'
          );
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.selectedAddress = {
          formatted: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
        };
        this.selectedCoordinates = { lat: coordinates.lat, lng: coordinates.lng };
        this.cdr.detectChanges();
      }
    });
  }

  private updateMarker(coordinates: { lat: number; lng: number }): void {
    if (!this.map) return;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    const customIcon = L.divIcon({
      html: `
        <div class="cmarker-outer">
          <div class="cmarker-dot"></div>
        </div>
      `,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28]
    });

    // Inject marker CSS once
    if (!document.getElementById('cmarker-style')) {
      const s = document.createElement('style');
      s.id = 'cmarker-style';
      s.textContent = `
        .cmarker-outer {
          width: 28px; height: 28px;
          background: #C49B32;
          border: 3px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.45);
          cursor: grab;
          display: flex; align-items: center; justify-content: center;
        }
        .cmarker-outer:active { cursor: grabbing; }
        .cmarker-dot {
          width: 9px; height: 9px;
          background: #fff; border-radius: 50%;
          transform: rotate(45deg);
        }
      `;
      document.head.appendChild(s);
    }

    this.marker = L.marker([coordinates.lat, coordinates.lng], {
      icon: customIcon,
      draggable: true,
      autoPan: true,
      riseOnHover: true
    }).addTo(this.map);

    this.marker.bindTooltip('Drag to refine position', {
      permanent: false,
      direction: 'top',
      offset: [0, -8],
      className: 'marker-tooltip'
    });

    this.selectedCoordinates = { lat: coordinates.lat, lng: coordinates.lng };

    this.marker.on('dragend', (e: any) => {
      const pos = e.target.getLatLng();
      this.placeMarkerAndGeocode(pos);
    });
  }

  // ─────────────────────────────────────────────
  // "My Location" button
  // ─────────────────────────────────────────────

  getCurrentLocation(): void {
    if (this.isLocating) return;
    this.isLocating = true;

    this.mapService.getCurrentLocation()
        .then(coords => {
          if (this.map) {
            this.map.setView([coords.lat, coords.lng], 17, { animate: true });
          }
          this.placeMarkerAndGeocode(coords);
          this.showToast('Location found!', 'success');
        })
        .catch(err => {
          const msg = err.message?.includes('denied')
              ? 'Location access denied. Enable it in browser settings.'
              : err.message?.includes('timed out')
                  ? 'Location timed out. Please try again.'
                  : 'Could not get location. Try searching instead.';
          this.showToast(msg, 'error');
        })
        .finally(() => {
          this.isLocating = false;
          this.cdr.detectChanges();
        });
  }

  // ─────────────────────────────────────────────
  // Search
  // ─────────────────────────────────────────────

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    if (!this.searchQuery || this.searchQuery.trim().length < 2) {
      this.searchResults = [];
      return;
    }
    this.searchTimeout = setTimeout(() => {
      this.mapService.searchAddress(this.searchQuery).subscribe({
        next: results => {
          this.searchResults = results;
          this.cdr.detectChanges();
        },
        error: () => { this.searchResults = []; }
      });
    }, 350);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  selectSearchResult(result: { coordinates: Coordinates; address: Address }): void {
    this.searchResults = [];
    this.searchQuery = result.address.formatted || '';
    this.selectedAddress = result.address;
    this.selectedCoordinates = result.coordinates;

    if (this.map) {
      this.map.setView([result.coordinates.lat, result.coordinates.lng], 16, { animate: true });
      this.updateMarker(result.coordinates);
      if (this.marker) {
        this.marker.setTooltipContent(
            result.address.formatted?.split(',').slice(0, 3).join(', ') || 'Drag to refine'
        );
      }
    }
  }

  // ─────────────────────────────────────────────
  // Confirm & close
  // ─────────────────────────────────────────────

  confirmSelection(): void {
    if (!this.selectedAddress || !this.selectedCoordinates || this.isConfirming) return;
    this.isConfirming = true;

    this.locationSelected.emit({
      coordinates: this.selectedCoordinates,
      address: this.selectedAddress
    });

    setTimeout(() => this.close(), 400);
  }

  close(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.isConfirming = false;
    this.isVisible = false;
    this.destroyMap();
    this.closed.emit();
  }

  closeOnOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  // ─────────────────────────────────────────────
  // Toast helpers
  // ─────────────────────────────────────────────

  private showToast(message: string, type: Toast['type'], duration = 3500): void {
    const id = ++this.toastCounter;
    this.toasts.push({ id, message, type });
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.cdr.detectChanges();
    }, duration);
  }
}