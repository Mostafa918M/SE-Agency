import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-shutter',
  standalone: true,
  template: `
    <div #shutter class="fixed inset-0 z-[10000] flex flex-col pointer-events-none overflow-hidden">
      <!-- Upper Half -->
      <div class="shutter-half flex-1 bg-zinc-950 border-b border-white/5 relative">
          <div class="absolute bottom-10 left-10 md:left-20 overflow-hidden">
              <p class="shutter-meta font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan opacity-0 translate-y-full">
                {{ client() || 'Noir Signal' }}
              </p>
          </div>
      </div>

      <!-- Center Logo/Loading -->
      <div #centerContent class="absolute inset-0 flex items-center justify-center z-10 opacity-0 scale-90 pointer-events-none">
          <div class="text-center">
              @if (title()) {
                <h2 class="text-4xl md:text-8xl font-body font-black tracking-tighter text-white uppercase italic leading-none mb-4">
                    {{ title() }}
                </h2>
              }
              <div class="flex items-center justify-center gap-4">
                  <div class="w-12 h-px bg-white/20"></div>
                  <span class="font-mono text-[9px] uppercase tracking-[0.4em] text-white/40">Opening Case</span>
                  <div class="w-12 h-px bg-white/20"></div>
              </div>
          </div>
      </div>

      <!-- Lower Half -->
      <div class="shutter-half flex-1 bg-zinc-950 border-t border-white/5 relative">
           <div class="absolute top-10 right-10 md:right-20 overflow-hidden">
              <p class="shutter-meta font-mono text-[10px] uppercase tracking-[0.5em] text-white/20 opacity-0 -translate-y-full">
                Digital Experience // 2026
              </p>
          </div>
      </div>
    </div>
  `,
  styles: [`
    .shutter-half {
        transform: scaleY(0);
        will-change: transform;
    }
  `],
})
export class Shutter {
  @ViewChild('shutter') shutterEl!: ElementRef;
  @ViewChild('centerContent') centerContent!: ElementRef;

  title = signal<string | null>(null);
  client = signal<string | null>(null);

  public async playIn(title?: string, client?: string): Promise<void> {
    // Kill existing animations on these elements
    gsap.killTweensOf(['.shutter-half', this.centerContent.nativeElement, '.shutter-meta']);

    this.title.set(title || null);
    this.client.set(client || null);

    return new Promise(resolve => {
        const tl = gsap.timeline({
            onComplete: () => resolve()
        });

        tl.to('.shutter-half', {
            scaleY: 1,
            duration: 0.8,
            ease: 'power4.inOut',
            stagger: 0.1
        })
        .to(this.centerContent.nativeElement, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.7)'
        }, '-=0.4')
        .to('.shutter-meta', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.3');
    });
  }

  public async playOut(): Promise<void> {
    gsap.killTweensOf(['.shutter-half', this.centerContent.nativeElement, '.shutter-meta']);

    return new Promise(resolve => {
        const tl = gsap.timeline({
            onComplete: () => {
                this.title.set(null);
                this.client.set(null);
                // Reset positions and props to avoid stuck states
                gsap.set(this.centerContent.nativeElement, { opacity: 0, scale: 0.9, y: 0 });
                gsap.set('.shutter-meta', { opacity: 0, y: (i: number) => i === 0 ? 20 : -20 });
                resolve();
            }
        });

        tl.to(this.centerContent.nativeElement, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: 'power2.in'
        })
        .to('.shutter-meta', {
            opacity: 0,
            duration: 0.3
        }, '-=0.2')
        .to('.shutter-half', {
            scaleY: 0,
            duration: 1,
            ease: 'power4.inOut',
            stagger: -0.1
        }, '-=0.1');
    });
  }
}
