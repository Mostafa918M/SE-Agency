import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-dot-orbit',
  standalone: true,
  template: `<div #container class="w-full h-full cursor-grab active:cursor-grabbing"></div>`,
  styles: [`:host { display: block; width: 100%; height: 100%; }`],
})
export class DotOrbit implements AfterViewInit, OnDestroy {
  @ViewChild('container') container!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mainDot!: THREE.Mesh;
  private particles: THREE.Mesh[] = [];
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
    this.renderer?.dispose();
    this.mainDot?.geometry.dispose();
    (this.mainDot?.material as THREE.Material).dispose();
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

    // Main Dot
    const dotGeo = new THREE.SphereGeometry(0.8, 64, 64);
    const dotMat = new THREE.MeshBasicMaterial({ 
        color: 0x000000, // Black main dot on light bg
        transparent: true,
        opacity: 0.9
    });
    this.mainDot = new THREE.Mesh(dotGeo, dotMat);
    this.scene.add(this.mainDot);

    // Glowing shell for main dot
    const shellGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const shellMat = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Vibrant Red
        transparent: true,
        opacity: 0.15,
        wireframe: true
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    this.mainDot.add(shell);

    // Orbiting particles
    const particleGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const particleColors = [0x000000, 0xff0000, 0x000000];

    for (let i = 0; i < 12; i++) {
        const mat = new THREE.MeshBasicMaterial({ 
            color: particleColors[i % 3],
            transparent: true,
            opacity: 0.7
        });
        const p = new THREE.Mesh(particleGeo, mat);
        
        // Random orbit distance and angle
        const dist = 1.5 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        p.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, (Math.random() - 0.5) * 2);
        
        // Custom property for orbit logic
        (p as any).orbitData = {
            distance: dist,
            speed: 0.01 + Math.random() * 0.02,
            angle: angle,
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
        };
        
        this.particles.push(p);
        this.scene.add(p);
    }

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
      
      this.mainDot.rotation.x = y * 0.5;
      this.mainDot.rotation.y = x * 0.5;
  }

  private animate() {
    this.frameId = requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Pulse main dot
    const s = 1 + Math.sin(time * 2) * 0.05;
    this.mainDot.scale.set(s, s, s);

    // Orbit particles
    this.particles.forEach(p => {
        const data = (p as any).orbitData;
        data.angle += data.speed;
        
        p.position.x = Math.cos(data.angle) * data.distance;
        p.position.y = Math.sin(data.angle) * data.distance;
        p.position.z = Math.sin(data.angle * 0.5) * (data.distance * 0.5);
    });

    this.renderer.render(this.scene, this.camera);
  }
}
