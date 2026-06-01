import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appMagnet]',
  standalone: true
})
export class Magnet implements OnInit {
  @Input() appMagnetStrength = 0.5;

  private xTo!: (value: number) => void;
  private yTo!: (value: number) => void;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.xTo = gsap.quickTo(this.el.nativeElement, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    this.yTo = gsap.quickTo(this.el.nativeElement, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const { left, top, width, height } = this.el.nativeElement.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (e.clientX - centerX) * this.appMagnetStrength;
    const deltaY = (e.clientY - centerY) * this.appMagnetStrength;

    this.xTo(deltaX);
    this.yTo(deltaY);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.xTo(0);
    this.yTo(0);
  }
}
