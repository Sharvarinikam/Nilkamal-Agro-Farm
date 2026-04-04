import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

export interface MangoStage {
  name: string;
  label: string;
  color: THREE.Color;
  emissive: THREE.Color;
  scale: THREE.Vector3;
  geometry: () => THREE.BufferGeometry;
  rotationSpeed: number;
}

@Injectable({ providedIn: 'root' })
export class MangoSceneService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mangoMesh!: THREE.Mesh;
  private leafGroup!: THREE.Group;
  private particleSystem!: THREE.Points;
  private animationId = 0;
  private clock = new THREE.Clock();
  private currentStageIndex = 0;
  private targetMorphProgress = 0;
  private currentMorphProgress = 0;
  private isInitialized = false;
  private container!: HTMLElement;

  readonly stages: MangoStage[] = [
    {
      name: 'seed',
      label: 'The Seed',
      color: new THREE.Color(0x8B6914),
      emissive: new THREE.Color(0x3D2B06),
      scale: new THREE.Vector3(0.3, 0.45, 0.25),
      geometry: () => new THREE.SphereGeometry(1, 16, 12),
      rotationSpeed: 0.3,
    },
    {
      name: 'sprout',
      label: 'The Sprout',
      color: new THREE.Color(0x6B9E3A),
      emissive: new THREE.Color(0x2D4A15),
      scale: new THREE.Vector3(0.35, 0.7, 0.3),
      geometry: () => this.createSproutGeometry(),
      rotationSpeed: 0.5,
    },
    {
      name: 'sapling',
      label: 'The Sapling',
      color: new THREE.Color(0x4A7C3A),
      emissive: new THREE.Color(0x1E3A15),
      scale: new THREE.Vector3(0.6, 1.0, 0.5),
      geometry: () => this.createSaplingGeometry(),
      rotationSpeed: 0.4,
    },
    {
      name: 'tree',
      label: 'The Tree',
      color: new THREE.Color(0x2D5A1E),
      emissive: new THREE.Color(0x142B0A),
      scale: new THREE.Vector3(1.0, 1.2, 0.9),
      geometry: () => this.createTreeGeometry(),
      rotationSpeed: 0.2,
    },
    {
      name: 'blossom',
      label: 'The Blossom',
      color: new THREE.Color(0xF5E6B8),
      emissive: new THREE.Color(0x8B7D4A),
      scale: new THREE.Vector3(0.9, 0.9, 0.9),
      geometry: () => this.createBlossomGeometry(),
      rotationSpeed: 0.6,
    },
    {
      name: 'raw',
      label: 'Raw Mango',
      color: new THREE.Color(0x7CB342),
      emissive: new THREE.Color(0x33691E),
      scale: new THREE.Vector3(0.7, 0.85, 0.65),
      geometry: () => this.createMangoGeometry(),
      rotationSpeed: 0.4,
    },
    {
      name: 'ripe',
      label: 'Ripe Alphonso',
      color: new THREE.Color(0xF5A623),
      emissive: new THREE.Color(0xE8910C),
      scale: new THREE.Vector3(0.85, 1.0, 0.75),
      geometry: () => this.createMangoGeometry(),
      rotationSpeed: 0.35,
    },
  ];

  constructor(private ngZone: NgZone) {}

  init(container: HTMLElement): void {
    if (this.isInitialized) return;
    this.container = container;
    this.isInitialized = true;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0.5, 5);

    // Lighting — warm, golden, dramatic
    const ambientLight = new THREE.AmbientLight(0xFDF5E6, 0.4);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFD700, 1.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xF5A623, 0.6);
    fillLight.position.set(-3, 2, -2);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xFFE4B5, 0.8);
    rimLight.position.set(0, -2, -4);
    this.scene.add(rimLight);

    const topGlow = new THREE.PointLight(0xC49B32, 1.2, 15);
    topGlow.position.set(0, 4, 2);
    this.scene.add(topGlow);

    // Initial mango mesh (seed)
    const stage = this.stages[0];
    const material = new THREE.MeshPhysicalMaterial({
      color: stage.color,
      emissive: stage.emissive,
      emissiveIntensity: 0.15,
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xFFD700),
      sheenRoughness: 0.3,
    });

    this.mangoMesh = new THREE.Mesh(stage.geometry(), material);
    this.mangoMesh.scale.copy(stage.scale);
    this.mangoMesh.castShadow = true;
    this.scene.add(this.mangoMesh);

    // Leaf decoration group
    this.leafGroup = new THREE.Group();
    this.scene.add(this.leafGroup);
    this.createLeaves();

    // Floating particles (pollen/sparkle)
    this.createParticles();

    // Start render loop
    this.ngZone.runOutsideAngular(() => this.animate());

    // Resize handler
    window.addEventListener('resize', this.onResize);
  }

  private createMangoGeometry(): THREE.BufferGeometry {
    const geo = new THREE.SphereGeometry(1, 32, 24);
    const positions = geo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      let x = positions.getX(i);
      let y = positions.getY(i);
      let z = positions.getZ(i);
      // Mango shape: elongated, asymmetric, slight point at top
      y *= 1.3;
      x *= 0.85 + 0.15 * Math.cos(Math.atan2(z, x) * 0.5);
      const topFactor = Math.max(0, y) * 0.3;
      x *= 1 - topFactor * 0.4;
      z *= 1 - topFactor * 0.4;
      // Slight curve
      x += y * 0.08;
      positions.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  private createSproutGeometry(): THREE.BufferGeometry {
    const geo = new THREE.ConeGeometry(0.4, 2, 8);
    const positions = geo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const swell = 1 + 0.3 * Math.sin((y + 1) * Math.PI * 0.5);
      positions.setX(i, positions.getX(i) * swell);
      positions.setZ(i, positions.getZ(i) * swell);
    }
    geo.computeVertexNormals();
    return geo;
  }

  private createSaplingGeometry(): THREE.BufferGeometry {
    const geo = new THREE.CylinderGeometry(0.15, 0.3, 2.5, 8);
    const sphere = new THREE.SphereGeometry(0.8, 16, 12);
    sphere.translate(0, 1.8, 0);
    const merged = new THREE.BufferGeometry();
    // Simple approach: use the cylinder with spherical top hint
    const positions = geo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      if (y > 0.8) {
        const bloom = 1 + (y - 0.8) * 1.2;
        positions.setX(i, positions.getX(i) * bloom);
        positions.setZ(i, positions.getZ(i) * bloom);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }

  private createTreeGeometry(): THREE.BufferGeometry {
    const geo = new THREE.IcosahedronGeometry(1.2, 2);
    const positions = geo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      let x = positions.getX(i);
      let y = positions.getY(i);
      let z = positions.getZ(i);
      // Make it tree-crown shaped
      const r = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      const noise = 0.15 * Math.sin(angle * 5 + y * 3);
      x += noise;
      z += noise * 0.7;
      y *= 0.8;
      positions.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  private createBlossomGeometry(): THREE.BufferGeometry {
    const geo = new THREE.DodecahedronGeometry(1.0, 1);
    const positions = geo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      let x = positions.getX(i);
      let y = positions.getY(i);
      let z = positions.getZ(i);
      const r = Math.sqrt(x * x + y * y + z * z);
      const bloom = 1 + 0.2 * Math.sin(r * 4);
      positions.setXYZ(i, x * bloom, y * bloom, z * bloom);
    }
    geo.computeVertexNormals();
    return geo;
  }

  private createLeaves(): void {
    const leafGeo = new THREE.PlaneGeometry(0.4, 0.15, 4, 2);
    // Curve the leaf
    const lp = leafGeo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < lp.count; i++) {
      const x = lp.getX(i);
      lp.setZ(i, Math.sin(x * Math.PI) * 0.05);
    }
    leafGeo.computeVertexNormals();

    const leafMat = new THREE.MeshPhysicalMaterial({
      color: 0x4A7C3A,
      emissive: 0x1A3A10,
      emissiveIntensity: 0.1,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(leafGeo.clone(), leafMat.clone());
      const angle = (i / 5) * Math.PI * 2;
      leaf.position.set(Math.cos(angle) * 1.3, 0.8 + Math.random() * 0.5, Math.sin(angle) * 1.3);
      leaf.rotation.set(Math.random() * 0.5, angle, Math.random() * 0.3);
      this.leafGroup.add(leaf);
    }
  }

  private createParticles(): void {
    const count = 80;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sizes[i] = Math.random() * 3 + 1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: 0xFFD700,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.particleSystem = new THREE.Points(geo, mat);
    this.scene.add(this.particleSystem);
  }

  /** Set the mango stage based on scroll progress (0..1) */
  setProgress(progress: number): void {
    const totalStages = this.stages.length;
    const stageFloat = progress * (totalStages - 1);
    const stageIndex = Math.floor(stageFloat);
    const stageFrac = stageFloat - stageIndex;
    const clampedIndex = Math.min(stageIndex, totalStages - 1);

    if (clampedIndex !== this.currentStageIndex) {
      this.currentStageIndex = clampedIndex;
      this.morphToStage(clampedIndex);
    }

    this.targetMorphProgress = stageFrac;
  }

  private morphToStage(index: number): void {
    const stage = this.stages[index];
    if (!this.mangoMesh) return;

    // Swap geometry
    this.mangoMesh.geometry.dispose();
    this.mangoMesh.geometry = stage.geometry();

    // Animate material color
    const mat = this.mangoMesh.material as THREE.MeshPhysicalMaterial;
    mat.color.copy(stage.color);
    mat.emissive.copy(stage.emissive);

    // Update leaf visibility based on stage
    this.leafGroup.visible = index >= 2;
    this.leafGroup.children.forEach((leaf, i) => {
      (leaf as THREE.Mesh).visible = i < Math.min(index, 5);
    });
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    if (!this.mangoMesh) return;

    // Smooth morph
    this.currentMorphProgress += (this.targetMorphProgress - this.currentMorphProgress) * 0.05;

    // Gentle rotation
    const stage = this.stages[this.currentStageIndex];
    this.mangoMesh.rotation.y += stage.rotationSpeed * delta;
    this.mangoMesh.rotation.x = Math.sin(elapsed * 0.5) * 0.1;

    // Float effect
    this.mangoMesh.position.y = Math.sin(elapsed * 0.8) * 0.15;

    // Scale interpolation
    const targetScale = stage.scale;
    this.mangoMesh.scale.lerp(targetScale, 0.03);

    // Leaf animation
    this.leafGroup.rotation.y = elapsed * 0.1;
    this.leafGroup.children.forEach((leaf, i) => {
      leaf.rotation.z = Math.sin(elapsed + i) * 0.2;
      leaf.position.y = 0.8 + Math.sin(elapsed * 0.5 + i * 0.7) * 0.1;
    });

    // Particle drift
    if (this.particleSystem) {
      const pa = this.particleSystem.geometry.attributes['position'] as THREE.BufferAttribute;
      for (let i = 0; i < pa.count; i++) {
        let y = pa.getY(i);
        y += delta * 0.15;
        if (y > 4) y = -4;
        pa.setY(i, y);
        pa.setX(i, pa.getX(i) + Math.sin(elapsed + i) * delta * 0.05);
      }
      pa.needsUpdate = true;
      this.particleSystem.rotation.y = elapsed * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private onResize = (): void => {
    if (!this.container || !this.camera || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  /** For loader animation: tween camera or add glow */
  pulseGlow(intensity: number): void {
    if (!this.scene) return;
    this.scene.children.forEach(child => {
      if (child instanceof THREE.PointLight) {
        child.intensity = intensity;
      }
    });
  }

  destroy(): void {
    window.removeEventListener('resize', this.onResize);
    cancelAnimationFrame(this.animationId);
    this.renderer?.dispose();
    this.scene?.clear();
    this.isInitialized = false;
  }
}
