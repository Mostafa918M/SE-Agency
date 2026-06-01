import { Component, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { RouterLink } from '@angular/router';
import { Magnet } from '../../directives/magnet';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, Magnet, TranslateModule],
  template: `
    <section #container class="min-h-screen flex flex-col justify-center items-center px-10 relative overflow-hidden bg-cosmic-bg">
      <!-- 404 Background Text -->
      <div #bgText class="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none opacity-[0.03]">
        <h1 class="text-[30vw] md:text-[40vw] font-cosmic leading-none">404</h1>
      </div>

      <!-- Content -->
      <div class="z-10 text-center max-w-4xl pt-20">
        <h1 #title class="text-6xl md:text-8xl lg:text-9xl mb-8 font-cosmic leading-none font-black tracking-tighter">
          {{ 'NOT_FOUND.TITLE' | translate }} <br> <span class="text-neon-cyan italic">{{ 'NOT_FOUND.SUBTITLE' | translate }}</span>
        </h1>
        
        <p #desc class="font-body text-lg md:text-xl text-cosmic-text/60 mb-12 max-w-xl mx-auto opacity-0 translate-y-10">
          {{ 'NOT_FOUND.DESC' | translate }}
        </p>

        <div #btnContainer class="opacity-0 translate-y-10">
          <a routerLink="/" 
             class="group inline-flex items-center gap-4 px-10 py-5 bg-neon-cyan text-white rounded-full font-mono text-xs uppercase tracking-[0.2em] font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(224,16,40,0.3)] hover:shadow-[0_0_50px_rgba(224,16,40,0.5)]"
             appMagnet [appMagnetStrength]="0.3">
             {{ 'COMMON.GO_HOME' | translate }}
             <div class="w-6 h-6 flex items-center justify-center bg-black/10 rounded-full group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1">
              <svg class="w-4 h-4 rotate-180 rtl:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
             </div>
          </a>
        </div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="particle-err absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan/20 rounded-full blur-sm"></div>
        <div class="particle-err absolute top-3/4 left-1/3 w-3 h-3 bg-cosmic-text/10 rounded-full blur-sm"></div>
        <div class="particle-err absolute top-1/3 right-1/4 w-2 h-2 bg-neon-cyan/15 rounded-full blur-sm"></div>
        <div class="particle-err absolute bottom-1/4 right-1/3 w-4 h-4 bg-white/5 rounded-full blur-sm"></div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class NotFound implements AfterViewInit {
  @ViewChild('title') title!: ElementRef;
  @ViewChild('desc') desc!: ElementRef;
  @ViewChild('btnContainer') btnContainer!: ElementRef;
  @ViewChild('bgText') bgText!: ElementRef;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 }});

      tl.from(this.title.nativeElement, {
        y: 100,
        opacity: 0,
        delay: 0.5
      })
      .to(this.desc.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 1.2
      }, '-=1')
      .to(this.btnContainer.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 1.2
      }, '-=1');

      // Floating particles
      gsap.to('.particle-err', {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Parallax effect
      window.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth) - 0.5;
        const yPos = (e.clientY / window.innerHeight) - 0.5;

        if (this.bgText) {
          gsap.to(this.bgText.nativeElement, {
            x: xPos * 50,
            y: yPos * 50,
            duration: 2,
            ease: 'power2.out'
          });
        }
      });
    });
  }
}
