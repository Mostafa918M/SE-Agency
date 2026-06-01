import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `
    <div #cursor class="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block border border-white flex justify-center items-center overflow-hidden">
        <div class="w-1 h-1 bg-white rounded-full"></div>
    </div>
  `,
  styles: [`
    :host {
        pointer-events: none;
    }
  `],
})
export class Cursor implements AfterViewInit {
  @ViewChild('cursor') cursorEl!: ElementRef;

  private xTo!: (v: number) => void;
  private yTo!: (value: number) => void;

  ngAfterViewInit(): void {
    // Hide native cursor
    document.body.style.cursor = 'none';

    this.xTo = gsap.quickTo(this.cursorEl.nativeElement, "x", { duration: 0.6, ease: "power3.out" });
    this.yTo = gsap.quickTo(this.cursorEl.nativeElement, "y", { duration: 0.6, ease: "power3.out" });

    // Ensure it starts at some position
    gsap.set(this.cursorEl.nativeElement, { xPercent: -50, yPercent: -50 });
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.xTo(e.clientX);
    this.yTo(e.clientY);

    // Dynamic scaling based on hovered elements
    const element = e.target as HTMLElement;
    const isLink = element.closest('a') || element.closest('button');

    if (isLink) {
        gsap.to(this.cursorEl.nativeElement, {
            scale: 2.5,
            duration: 0.3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        });
    } else {
        gsap.to(this.cursorEl.nativeElement, {
            scale: 1,
            duration: 0.3,
            backgroundColor: 'transparent'
        });
    }
  }
}
