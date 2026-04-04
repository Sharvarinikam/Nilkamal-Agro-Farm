import {
  Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FallingMango {
  mesh: THREE.Mesh;
  vy: number;
  bounced: number;
  grounded: boolean;
  rotSpeed: { x: number; y: number };
}

interface TreeData {
  trunk: THREE.Mesh;
  crown: THREE.Mesh;
  x: number;
  z: number;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer" id="footer">
      <!-- 3D Orchard Scene -->
      <div class="footer__orchard" #orchardWrapper>
        <canvas #orchardCanvas class="footer__orchard-canvas"></canvas>
        <div class="footer__orchard-overlay"></div>
        <div class="footer__orchard-text">
          <h3>From Our Orchards, With Love</h3>
          <p>Where the golden harvest meets your home</p>
        </div>
      </div>

      <div class="footer__main">
        <div class="footer__grid">
          <div class="footer__brand">
            <div class="footer__logo">
              <span class="footer__logo-icon">🥭</span>
              <div>
                <span class="footer__logo-name">Nikam Farms</span>
                <span class="footer__logo-tag">Royal Heritage Mangoes</span>
              </div>
            </div>
            <p class="footer__desc">
              Three generations of passion. Fifty acres of sun-blessed orchards.
              One extraordinary mango. From our family to yours, since 1952.
            </p>
          </div>

          <div class="footer__links-group" *ngFor="let group of linkGroups">
            <h4>{{ group.title }}</h4>
            <a *ngFor="let link of group.links" [href]="link.url">{{ link.label }}</a>
          </div>
        </div>

        <div class="footer__bottom">
          <div class="footer__bottom-inner">
            <p>&copy; 2026 Nikam Farms. All rights reserved.</p>
            <p class="footer__craft">Crafted with ♥ and a love for mangoes</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: relative;
      background: #0A0502;

      &__orchard {
        width: 100%;
        height: clamp(350px, 50vh, 550px);
        position: relative;
        overflow: hidden;
        background: linear-gradient(180deg, #1A0F05, #0A0502);
      }

      &__orchard-canvas {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: block;
      }

      &__orchard-overlay {
        position: absolute;
        inset: 0;
        z-index: 2;
        background: linear-gradient(180deg, transparent 60%, rgba(10, 5, 2, 0.7));
        pointer-events: none;
      }

      &__orchard-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        text-align: center;
        pointer-events: none;

        h3 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 800;
          color: #FDF5E6;
          opacity: 0.7;
        }

        p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.85rem, 1.5vw, 1.1rem);
          font-style: italic;
          color: rgba(196, 155, 50, 0.4);
          margin-top: 8px;
        }
      }

      &__main {
        border-top: 1px solid rgba(196, 155, 50, 0.06);
      }

      &__grid {
        max-width: 1400px;
        margin: 0 auto;
        padding: clamp(48px, 7vh, 80px) clamp(20px, 6vw, 100px);
        display: grid;
        grid-template-columns: 1.6fr 1fr 1fr 1fr;
        gap: clamp(30px, 5vw, 70px);

        @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; }
        @media (max-width: 576px) { grid-template-columns: 1fr; }
      }

      &__logo {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
      }

      &__logo-icon {
        font-size: 2.2rem;
        filter: drop-shadow(0 4px 10px rgba(245, 166, 35, 0.3));
      }

      &__logo-name {
        display: block;
        font-family: 'Playfair Display', serif;
        font-size: 1.4rem;
        font-weight: 800;
        color: #FFD700;
      }

      &__logo-tag {
        display: block;
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.65rem;
        color: rgba(196, 155, 50, 0.4);
        letter-spacing: 0.3em;
        text-transform: uppercase;
      }

      &__desc {
        font-size: 0.85rem;
        color: rgba(253, 245, 230, 0.25);
        line-height: 1.8;
        max-width: 340px;
      }

      &__links-group {
        h4 {
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #C49B32;
          margin-bottom: 18px;
          letter-spacing: 0.06em;
        }

        a {
          display: block;
          font-size: 0.82rem;
          color: rgba(253, 245, 230, 0.25);
          padding: 6px 0;
          transition: all 0.3s;

          &:hover {
            color: #FFD700;
            padding-left: 8px;
          }
        }
      }

      &__bottom {
        border-top: 1px solid rgba(196, 155, 50, 0.05);
      }

      &__bottom-inner {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px clamp(20px, 6vw, 100px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;

        p {
          font-size: 0.72rem;
          color: rgba(253, 245, 230, 0.15);
          letter-spacing: 0.05em;
        }
      }

      &__craft {
        font-style: italic;
      }
    }
  `]
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('orchardWrapper') orchardWrapper!: ElementRef<HTMLElement>;
  @ViewChild('orchardCanvas') orchardCanvas!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animationId = 0;
  private fallingMangoes: FallingMango[] = [];
  private trees: TreeData[] = [];
  private staticMangoes: THREE.Mesh[] = [];
  private particles!: THREE.Points;
  private orchardStarted = false;
  private spawnTimer = 0;
  private mangoGeo!: THREE.SphereGeometry;
  private mangoMats: THREE.MeshPhysicalMaterial[] = [];

  linkGroups = [
    {
      title: 'Explore',
      links: [
        { label: 'Our Story', url: '#about' },
        { label: 'The Journey', url: '#journey' },
        { label: 'Varieties', url: '#varieties' },
        { label: 'Farm to Home', url: '#farm-to-home' },
        { label: 'Order Now', url: '#contact' },
      ],
    },
    {
      title: 'Learn',
      links: [
        { label: 'How to Ripen Mangoes', url: '#' },
        { label: 'Mango Recipes', url: '#' },
        { label: 'GI Tag Certification', url: '#' },
        { label: 'Sustainability', url: '#' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Instagram', url: '#' },
        { label: 'WhatsApp', url: '#' },
        { label: 'YouTube', url: '#' },
        { label: 'Facebook', url: '#' },
      ],
    },
  ];

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // Small delay to ensure DOM is ready
      setTimeout(() => this.initOrchard(), 100);
    });
  }

  private initOrchard(): void {
    const canvas = this.orchardCanvas.nativeElement;
    const container = this.orchardWrapper.nativeElement;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0A0502, 0.015);

    // Camera
    this.camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    this.camera.position.set(0, 6, 18);
    this.camera.lookAt(0, 2, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(W, H);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.9;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    this.scene.add(new THREE.AmbientLight(0x1A0F05, 0.6));

    const moonlight = new THREE.DirectionalLight(0xFFE4B5, 0.8);
    moonlight.position.set(10, 20, 5);
    moonlight.castShadow = true;
    moonlight.shadow.mapSize.set(1024, 1024);
    this.scene.add(moonlight);

    const warmGlow = new THREE.PointLight(0xFFD700, 0.6, 30);
    warmGlow.position.set(-5, 8, 5);
    this.scene.add(warmGlow);

    const sideGlow = new THREE.PointLight(0xF5A623, 0.4, 25);
    sideGlow.position.set(8, 6, -3);
    this.scene.add(sideGlow);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 40),
      new THREE.MeshPhysicalMaterial({ color: 0x2D1810, roughness: 0.9 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Shared mango geometry & materials
    this.mangoGeo = new THREE.SphereGeometry(0.18, 10, 8);
    const mp = this.mangoGeo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < mp.count; i++) {
      const y = mp.getY(i);
      mp.setY(i, y * 1.2);
      mp.setX(i, mp.getX(i) * 0.9);
      mp.setZ(i, mp.getZ(i) * 0.9);
    }
    this.mangoGeo.computeVertexNormals();

    this.mangoMats = [
      new THREE.MeshPhysicalMaterial({
        color: 0xF5A623, emissive: 0xE8910C, emissiveIntensity: 0.2,
        roughness: 0.3, clearcoat: 0.8,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0xFFB347, emissive: 0xE8910C, emissiveIntensity: 0.15,
        roughness: 0.35, clearcoat: 0.7,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0xE89620, emissive: 0xC47810, emissiveIntensity: 0.2,
        roughness: 0.3, clearcoat: 0.8,
      }),
    ];

    this.buildTrees();
    this.buildParticles();
    this.buildBasket();

    // Start orchard animation when scrolled into view
    ScrollTrigger.create({
      trigger: container,
      start: 'top 90%',
      onEnter: () => { this.orchardStarted = true; },
    });

    this.animate();
    window.addEventListener('resize', this.onResize);
  }

  private buildTrees(): void {
    const positions: [number, number][] = [
      [-8, -3], [-4, -6], [0, -4], [4, -7], [8, -3],
      [-6, -9], [2, -10], [6, -10], [-10, -7], [10, -6],
    ];

    positions.forEach(([tx, tz]) => {
      // Trunk
      const trunkHeight = 3 + Math.random();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.25, trunkHeight, 8),
        new THREE.MeshPhysicalMaterial({ color: 0x5C3D2E, roughness: 0.8 })
      );
      trunk.position.set(tx, trunkHeight / 2, tz);
      trunk.castShadow = true;
      this.scene.add(trunk);

      // Crown
      const crownRadius = 1.5 + Math.random() * 0.8;
      const crownGeo = new THREE.SphereGeometry(crownRadius, 12, 10);
      const cp = crownGeo.attributes['position'] as THREE.BufferAttribute;
      for (let i = 0; i < cp.count; i++) {
        const x = cp.getX(i), y = cp.getY(i), z = cp.getZ(i);
        cp.setXYZ(
          i,
          x * (1 + Math.sin(y * 2) * 0.15),
          y * 0.7,
          z * (1 + Math.cos(x * 2) * 0.15)
        );
      }
      crownGeo.computeVertexNormals();

      const hue = 0.3 + Math.random() * 0.05;
      const lightness = 0.2 + Math.random() * 0.1;
      const crown = new THREE.Mesh(
        crownGeo,
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color().setHSL(hue, 0.5, lightness),
          roughness: 0.7,
        })
      );
      crown.position.set(tx, 3.5 + Math.random() * 0.5, tz);
      crown.castShadow = true;
      this.scene.add(crown);

      this.trees.push({ trunk, crown, x: tx, z: tz });

      // Static mangoes hanging on each tree
      const mangoCount = 4 + Math.floor(Math.random() * 4);
      for (let i = 0; i < mangoCount; i++) {
        const mat = this.mangoMats[Math.floor(Math.random() * this.mangoMats.length)];
        const mango = new THREE.Mesh(this.mangoGeo, mat);
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.6 + Math.random() * 0.8;
        mango.position.set(
          tx + Math.cos(angle) * dist,
          3.2 + Math.random() * 1.2,
          tz + Math.sin(angle) * dist
        );
        mango.rotation.set(Math.random(), Math.random(), Math.random());
        mango.castShadow = true;
        this.scene.add(mango);
        this.staticMangoes.push(mango);
      }
    });
  }

  private buildParticles(): void {
    const count = 100;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.particles = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xFFD700,
      size: 0.08,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    }));
    this.scene.add(this.particles);
  }

  private buildBasket(): void {
    const basketBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.2, 1, 12, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0xB87333, roughness: 0.7, side: THREE.DoubleSide,
      })
    );
    basketBody.position.set(0, 0.5, 3);
    basketBody.receiveShadow = true;
    this.scene.add(basketBody);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.08, 8, 24),
      new THREE.MeshPhysicalMaterial({ color: 0xC4864A, roughness: 0.6 })
    );
    rim.position.set(0, 1, 3);
    rim.rotation.x = Math.PI / 2;
    this.scene.add(rim);
  }

  private spawnFallingMango(): void {
    const tree = this.trees[Math.floor(Math.random() * this.trees.length)];
    const mat = this.mangoMats[Math.floor(Math.random() * this.mangoMats.length)];
    const mesh = new THREE.Mesh(this.mangoGeo, mat);

    mesh.position.set(
      tree.x + (Math.random() - 0.5) * 2,
      3.5 + Math.random(),
      tree.z + (Math.random() - 0.5) * 1.5
    );
    mesh.castShadow = true;
    this.scene.add(mesh);

    this.fallingMangoes.push({
      mesh,
      vy: 0,
      bounced: 0,
      grounded: false,
      rotSpeed: { x: Math.random() * 3, y: Math.random() * 3 },
    });

    // Remove oldest if too many
    if (this.fallingMangoes.length > 35) {
      const old = this.fallingMangoes.shift()!;
      this.scene.remove(old.mesh);
      old.mesh.geometry.dispose();
    }
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Sway tree crowns
    this.trees.forEach((tree, i) => {
      tree.crown.rotation.z = Math.sin(elapsed * 0.5 + i) * 0.03;
      tree.crown.rotation.x = Math.cos(elapsed * 0.3 + i) * 0.02;
      tree.crown.position.y = 3.5 + Math.sin(elapsed * 0.4 + i) * 0.05;
    });

    // Bob static mangoes
    this.staticMangoes.forEach((m, i) => {
      m.position.y += Math.sin(elapsed * 1.5 + i) * 0.001;
      m.rotation.y += delta * 0.2;
    });

    // Spawn new falling mangoes
    if (this.orchardStarted) {
      this.spawnTimer += delta;
      if (this.spawnTimer > 0.6) {
        this.spawnTimer = 0;
        this.spawnFallingMango();
      }
    }

    // Physics for falling mangoes
    this.fallingMangoes.forEach(fm => {
      if (fm.grounded) return;

      fm.vy -= 9.8 * delta * 0.15; // gravity
      fm.mesh.position.y += fm.vy;
      fm.mesh.rotation.x += fm.rotSpeed.x * delta;
      fm.mesh.rotation.y += fm.rotSpeed.y * delta;

      // Ground collision + bounce
      if (fm.mesh.position.y <= 0.2) {
        fm.mesh.position.y = 0.2;
        if (fm.bounced < 2) {
          fm.vy = Math.abs(fm.vy) * 0.3;
          fm.bounced++;
        } else {
          fm.grounded = true;
          fm.mesh.position.y = 0.15 + Math.random() * 0.1;
        }
      }
    });

    // Particle drift
    if (this.particles) {
      const pa = this.particles.geometry.attributes['position'] as THREE.BufferAttribute;
      for (let i = 0; i < pa.count; i++) {
        let y = pa.getY(i);
        y += delta * 0.3 * Math.sin(elapsed + i);
        if (y > 8) y = 0;
        pa.setY(i, y);
        pa.setX(i, pa.getX(i) + Math.sin(elapsed * 0.5 + i) * 0.008);
      }
      pa.needsUpdate = true;
    }

    // Gentle camera sway
    this.camera.position.x = Math.sin(elapsed * 0.15) * 2;
    this.camera.position.y = 6 + Math.sin(elapsed * 0.2) * 0.5;
    this.camera.lookAt(0, 2, 0);

    this.renderer.render(this.scene, this.camera);
  };

  private onResize = (): void => {
    const el = this.orchardWrapper?.nativeElement;
    if (!el || !this.camera || !this.renderer) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    this.renderer?.dispose();
    this.scene?.clear();
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}
