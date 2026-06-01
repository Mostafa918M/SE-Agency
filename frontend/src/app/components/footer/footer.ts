import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Magnet } from '../../directives/magnet';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, Magnet, TranslateModule],
    template: `
    <footer class="bg-zinc-950 text-white pt-20 pb-10 px-6 md:px-12 lg:px-24 rtl:text-right">
      <!-- 1. Main CTA Section -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 border-b border-white/5 pb-20 rtl:lg:flex-row-reverse">
          <div class="max-w-2xl">
              <p class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan mb-6">{{ 'FOOTER.COLLAB' | translate }}</p>
              <h2 class="text-4xl md:text-8xl font-body font-black tracking-tighter uppercase leading-[0.95] md:leading-[0.9] italic">
                  {{ 'FOOTER.LET_TALK_1' | translate }} <span class="text-white/20">{{ 'FOOTER.TALK' | translate }}</span>
              </h2>
          </div>
          <div class="relative group mt-4 md:mt-0">
              <a href="mailto:info@se.agency" class="inline-flex items-center justify-center w-36 h-36 md:w-48 md:h-48 rounded-full bg-white text-black font-body font-black uppercase text-[10px] md:text-sm tracking-widest hover:scale-110 transition-transform duration-500 shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95 px-4 text-center" appMagnet [appMagnetStrength]="0.3">
                  {{ 'FOOTER.EMAIL_US' | translate }}
              </a>
              <div class="absolute inset-0 bg-neon-cyan/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
          </div>
      </div>

      <!-- 2. Links Section -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-12 py-20 border-b border-white/5">
          <div class="col-span-2">
              <h3 class="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-10">{{ 'FOOTER.NAV_TITLE' | translate }}</h3>
              <div class="flex flex-col gap-4">
                  <a href="/work" class="text-xl md:text-3xl font-body font-bold hover:text-neon-cyan transition-colors">{{ 'FOOTER.PORTFOLIO' | translate }}</a>
                  <a href="/services" class="text-xl md:text-3xl font-body font-bold hover:text-neon-cyan transition-colors">{{ 'FOOTER.EXPERTISE' | translate }}</a>
                  <a href="/about" class="text-xl md:text-3xl font-body font-bold hover:text-neon-cyan transition-colors">{{ 'FOOTER.STORY' | translate }}</a>
                  <a href="/contact" class="text-xl md:text-3xl font-body font-bold hover:text-neon-cyan transition-colors">{{ 'FOOTER.CONTACT' | translate }}</a>
              </div>
          </div>

          <div>
              <h3 class="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-10">{{ 'FOOTER.SOCIAL_TITLE' | translate }}</h3>
              <div class="flex flex-col gap-4">
                  <a href="#" class="font-body text-base hover:text-white transition-colors text-white/60" appMagnet [appMagnetStrength]="0.2">Instagram</a>
                  <a href="#" class="font-body text-base hover:text-white transition-colors text-white/60" appMagnet [appMagnetStrength]="0.2">LinkedIn</a>
                  <a href="#" class="font-body text-base hover:text-white transition-colors text-white/60" appMagnet [appMagnetStrength]="0.2">Behance</a>
                  <a href="#" class="font-body text-base hover:text-white transition-colors text-white/60" appMagnet [appMagnetStrength]="0.2">Twitter</a>
              </div>
          </div>

          <div>
              <h3 class="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-10">{{ 'FOOTER.LOCATIONS_TITLE' | translate }}</h3>
              <div class="flex flex-col gap-6">


              </div>
          </div>
      </div>

      <!-- 3. Bottom Bar -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 rtl:md:flex-row-reverse">
          <div class="flex items-center gap-6 rtl:flex-row-reverse">
              <span class="font-mono text-[9px] uppercase tracking-widest text-white/40">&copy; 2026 SE.AGENCY</span>
              <div class="w-1 h-1 bg-white/10 rounded-full"></div>
              <a href="#" class="font-mono text-[9px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Privacy</a>
              <a href="#" class="font-mono text-[9px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Legal</a>
          </div>
          
          <div class="flex items-center gap-3 rtl:flex-row-reverse">
              <span class="font-mono text-[9px] uppercase tracking-widest text-white/40">{{ 'FOOTER.POWERED_BY' | translate }}</span>
              <span class="font-body font-black text-xs italic tracking-tighter">SE.AGENCY</span>
          </div>
      </div>
    </footer>
  `,
    styles: [`
    :host { display: block; }
  `],
})
export class Footer { }
