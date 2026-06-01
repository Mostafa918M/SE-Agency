import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';

@Component({
  selector: 'app-work-orbit',
  standalone: true,
  template: `<div #container class="w-full h-full"></div>`,
  styles: [`:host { display: block; width: 100%; height: 100%; }`],
})
export class WorkOrbit implements AfterViewInit, OnDestroy {
  @ViewChild('container') container!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private group!: THREE.Group;
  private points!: THREE.Points;
  private rings: THREE.Mesh[] = [];
  private frameId: number | null = null;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
        this.initThree();
        this.animate();
    });
  }

  ngOnDestroy(): void {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize.bind(this));
    this.renderer?.dispose();
    // Clean up scene geometries and materials
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m: THREE.Material) => m.dispose());
          } else {
            (object.material as THREE.Material)?.dispose();
          }
        }
      });
    }
  }

  private initThree() {
    this.scene = new THREE.Scene();

    const width = this.container.nativeElement.clientWidth;
    const height = this.container.nativeElement.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.nativeElement.appendChild(this.renderer.domElement);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Create a "Mechanical Drum" (Approximate the robotic object in the image)
    const createDrum = (xOffset: number, scale: number = 1) => {
        const drumGroup = new THREE.Group();
        drumGroup.position.x = xOffset;
        drumGroup.scale.set(scale, scale, scale);

        // Core Cylinder
        const coreGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
        const coreMat = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 100 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.rotation.x = Math.PI / 2;
        drumGroup.add(core);

        // Neon Glow Strip (Red)
        const stripGeo = new THREE.TorusGeometry(0.85, 0.05, 16, 100);
        const stripMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.rotation.x = Math.PI / 2;
        drumGroup.add(strip);

        // Subparts (caps)
        const capGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32);
        const capMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const cap1 = new THREE.Mesh(capGeo, capMat);
        cap1.position.z = 0.25;
        cap1.rotation.x = Math.PI / 2;
        drumGroup.add(cap1);

        const cap2 = new THREE.Mesh(capGeo, capMat);
        cap2.position.z = -0.25;
        cap2.rotation.x = Math.PI / 2;
        drumGroup.add(cap2);

        // Accent Dots on Caps
        const pointGeo = new THREE.SphereGeometry(0.04, 8, 8);
        const pointMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        for (let i = 0; i < 4; i++) {
            const p = new THREE.Mesh(pointGeo, pointMat);
            const angle = (i * Math.PI) / 2;
            p.position.set(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0.31);
            drumGroup.add(p);
        }

        // Spikes / Texture
        for (let i = 0; i < 8; i++) {
            const spikeGeo = new THREE.BoxGeometry(0.1, 0.1, 1.2);
            const spike = new THREE.Mesh(spikeGeo, coreMat);
            spike.rotation.y = (i * Math.PI) / 4;
            drumGroup.add(spike);
        }

        return drumGroup;
    };

    const drum1 = createDrum(-1.2);
    const drum2 = createDrum(1.2, 0.9);
    
    this.group.add(drum1);
    this.group.add(drum2);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    window.addEventListener('resize', this.onResize.bind(this));
    this.container.nativeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onResize() {
    if (!this.container) return;
    const width = this.container.nativeElement.clientWidth;
    const height = this.container.nativeElement.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private onMouseMove(e: MouseEvent) {
    const rect = this.container.nativeElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    gsap.to(this.group.rotation, { y: x * 0.4, x: -y * 0.4, duration: 1.5 });
  }

  private animate() {
    this.frameId = requestAnimationFrame(() => this.animate());
    this.group.children.forEach((child, i) => {
        child.rotation.z += 0.01 * (i + 1);
        child.rotation.y += 0.005;
    });
    this.renderer.render(this.scene, this.camera);
  }
}
