import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-lumina-orb',
  standalone: true,
  template: `<div #container class="w-full h-full"></div>`,
  styles: [`:host { display: block; width: 100%; height: 100%; }`],
})
export class LuminaOrb implements AfterViewInit, OnDestroy {
  @ViewChild('container') container!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private sphere!: THREE.Mesh;
  private ring!: THREE.Mesh;
  private frameId: number | null = null;
  private targetMouse = { x: 0, y: 0 };
  private mouse = { x: 0, y: 0 };

  ngAfterViewInit(): void {
    this.initThree();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.renderer?.dispose();
    this.sphere?.geometry.dispose();
    (this.sphere?.material as THREE.Material).dispose();
  }

  private initThree() {
    this.scene = new THREE.Scene();

    const width = this.container.nativeElement.clientWidth;
    const height = this.container.nativeElement.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 3.5;

    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true // Allow background color to show through
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.nativeElement.appendChild(this.renderer.domElement);

    // Orb Geometry
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Main Orb (Glow focus)
    const material = new THREE.MeshBasicMaterial({
        color: 0xe01028, // Lumina Red
        transparent: true,
        opacity: 0.1
    });
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);

    // Inner Glow (Smaller sphere)
    const innerGeo = new THREE.SphereGeometry(0.95, 64, 64);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0xe01028,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    this.sphere.add(innerSphere);

    // Dynamic Ring (Orbit)
    const ringGeo = new THREE.TorusGeometry(1.2, 0.002, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe01028,
        transparent: true,
        opacity: 0.3
    });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.ring.rotation.x = Math.PI / 2.5;
    this.scene.add(this.ring);

    // Handle resizing
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onMouseMove(e: MouseEvent) {
    this.targetMouse.x = (e.clientX / window.innerWidth) - 0.5;
    this.targetMouse.y = (e.clientY / window.innerHeight) - 0.5;
  }

  private onResize() {
    const width = this.container.nativeElement.clientWidth;
    const height = this.container.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate() {
    this.frameId = requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Smooth mouse follow
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    // Pulse
    const scale = 1 + Math.sin(time * 2) * 0.05;
    this.sphere.scale.set(scale, scale, scale);

    // Rotate components & follow mouse
    this.sphere.rotation.y += 0.005 + (this.mouse.x * 0.02);
    this.sphere.rotation.x += (this.mouse.y * 0.02);
    
    this.ring.rotation.z += 0.01;
    this.ring.rotation.y += 0.005 + (this.mouse.x * 0.05);

    // Subtle tilt of the whole scene
    this.scene.rotation.y = this.mouse.x * 0.5;
    this.scene.rotation.x = -this.mouse.y * 0.5;

    this.renderer.render(this.scene, this.camera);
  }
}
