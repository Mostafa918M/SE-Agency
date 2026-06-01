import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <section class="min-h-screen pt-40 pb-20 px-6 md:px-10 bg-cosmic-bg rtl:text-right">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="reveal-text font-cosmic text-5xl md:text-8xl mb-12 py-2 rtl:text-6xl">
          {{ 'STUDIO.TITLE_1' | translate }} <span class="text-neon-cyan">{{ 'STUDIO.TITLE_STUDIO' | translate }}</span>
        </h1>
        <p class="reveal-sub font-mono text-neon-cyan/50 uppercase tracking-[0.3em] leading-relaxed max-w-2xl mx-auto">
          {{ 'STUDIO.DESC' | translate }}
        </p>

        <div class="mt-32 border-t border-cosmic-text/10 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="flex flex-col gap-2">
                <span class="font-mono text-[10px] uppercase text-neon-cyan">{{ 'STUDIO.SERVICES' | translate }}</span>
                <span class="font-cosmic text-sm">{{ 'STUDIO.CGI_MOTION' | translate }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-mono text-[10px] uppercase text-neon-cyan">{{ 'STUDIO.SERVICES' | translate }}</span>
                <span class="font-cosmic text-sm">{{ 'STUDIO.ARCH' | translate }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-mono text-[10px] uppercase text-neon-cyan">{{ 'STUDIO.LOCATION' | translate }}</span>
                <span class="font-cosmic text-sm">{{ 'STUDIO.DIST_GLOBAL' | translate }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-mono text-[10px] uppercase text-neon-cyan">{{ 'STUDIO.PHILOSOPHY' | translate }}</span>
                <span class="font-cosmic text-sm">{{ 'STUDIO.UNCOMPROMISING' | translate }}</span>
            </div>
        </div>
      </div>
    </section>
  `,
  styles: ``
})
export class Studio implements AfterViewInit {
  ngAfterViewInit() {
    gsap.from('.reveal-text', { opacity: 0, y: 50, duration: 1.5, ease: 'power4.out', delay: 0.8 });
    gsap.from('.reveal-sub', { opacity: 0, y: 30, duration: 1.5, ease: 'power4.out', delay: 1 });
  }
}
