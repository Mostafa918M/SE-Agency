import { Component, signal, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnet } from '../../directives/magnet';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, Magnet, TranslateModule],
  template: `
    <nav class="fixed top-0 left-0 w-full z-[100] px-4 md:px-8 py-6 md:py-8 lg:py-10 flex justify-between items-center pointer-events-none">
      
      <!-- Logo -->
      <div #logo class="logo pointer-events-auto">
        <a routerLink="/" class="font-cosmic text-xl font-black tracking-tighter transition-colors" appMagnet [appMagnetStrength]="0.3">
         <img [src]="logoWhite() ? '/S.E_WHITE_LOGO.png' : '/S.E_LOGO.png'" alt="S.E Logo" class="h-5 md:h-7 w-auto object-contain transition-opacity duration-500">
        </a>
      </div>

      <!-- Pill Buttons -->
      <div class="flex items-center gap-2 md:gap-4 pointer-events-auto">
        
        <!-- Language Switcher -->
        <button
          (click)="toggleLanguage()"
          class="flex items-center justify-center min-w-[3.5rem] h-11 md:h-12 backdrop-blur-md rounded-full border transition-all duration-300 group shadow-sm px-3"
          [class]="logoWhite() ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-black/5 border-black/10 hover:bg-black/10'"
          appMagnet [appMagnetStrength]="0.2"
        >
          <span class="font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-black transition-colors duration-300"
                [class]="logoWhite() ? 'text-white' : 'text-cosmic-text'">
            {{ currentLang() === 'en' ? 'AR' : 'EN' }}
          </span>
        </button>

        <!-- Chat Pill -->
        <button class="hidden lg:flex items-center gap-4 px-6 h-12 backdrop-blur-md rounded-full border group transition-all duration-300"
                [class]="logoWhite() ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-black/5 border-black/5 hover:bg-black/10'"
                appMagnet [appMagnetStrength]="0.2">
          <span class="font-mono text-[10px] uppercase tracking-widest font-black transition-colors duration-300"
                [class]="logoWhite() ? 'text-white' : 'text-cosmic-text'">{{ 'COMMON.CHAT_WITH' | translate }}</span>
          <div class="w-8 h-8 rounded-full flex items-center justify-center border group-hover:scale-110 transition-transform"
               [class]="logoWhite() ? 'bg-white/10 border-white/10' : 'bg-white border-black/5'">
            <svg class="w-3 h-3 transition-colors duration-300" [class]="logoWhite() ? 'text-white' : 'text-cosmic-text'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
        </button>

        <!-- Menu Pill -->
        <button
          (click)="toggleMenu()"
          class="flex items-center gap-4 md:gap-6 px-4 md:px-6 h-11 md:h-12 rounded-full border transition-all duration-300 group shadow-lg"
          [class]="logoWhite() ? 'bg-white text-black hover:bg-zinc-100 border-white/20' : 'bg-black text-white hover:bg-zinc-800 border-black/10'"
          appMagnet [appMagnetStrength]="0.2"
        >
          <span class="font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-black">
            {{ (isMenuOpen() ? 'NAV.CLOSE' : 'NAV.MENU') | translate }}
          </span>
          <div class="flex flex-col gap-1">
            @if (isMenuOpen()) {
                <div class="flex flex-col gap-1 items-center">
                    <span class="w-1 h-1 rounded-full" [class]="logoWhite() ? 'bg-black' : 'bg-white'"></span>
                    <span class="w-1 h-1 rounded-full" [class]="logoWhite() ? 'bg-black' : 'bg-white'"></span>
                </div>
            } @else {
                <div class="flex flex-col gap-1 items-center">
                    <span class="w-1.5 h-1.5 md:w-1 md:h-1 rounded-full opacity-40" [class]="logoWhite() ? 'bg-black' : 'bg-white'"></span>
                    <span class="w-1.5 h-1.5 md:w-1 md:h-1 rounded-full" [class]="logoWhite() ? 'bg-black' : 'bg-white'"></span>
                </div>
            }
          </div>
        </button>
      </div>

    </nav>

    <!-- Floating Menu Card -->
    <div 
        class="fixed top-20 right-6 md:right-10 z-[90] w-[calc(100%-3rem)] md:w-80 bg-zinc-200/90 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl origin-right border border-white/20 rtl:right-auto rtl:left-6 rtl:md:left-10 rtl:origin-left"
        [class.opacity-100]="isMenuOpen()"
        [class.scale-100]="isMenuOpen()"
        [class.translate-x-0]="isMenuOpen()"
        [class.opacity-0]="!isMenuOpen()"
        [class.scale-95]="!isMenuOpen()"
        [class.translate-x-[120%]]="!isMenuOpen() && !isRtl()"
        [class.-translate-x-[120%]]="!isMenuOpen() && isRtl()"
        [class.pointer-events-none]="!isMenuOpen()"
    >
        <div class="flex flex-col gap-6">
            @for (item of navItems; track item.path) {
                <a 
                    [routerLink]="item.path"
                    (click)="toggleMenu()"
                    class="group"
                >
                    <span 
                        class="font-body text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter transition-all duration-300 block rlt:text-right"
                        [class.text-black/20]="isActive(item.path)"
                        [class.text-black]="!isActive(item.path)"
                        [class.hover:translate-x-2]="!isActive(item.path) && !isRtl()"
                        [class.hover:-translate-x-2]="!isActive(item.path) && isRtl()"
                    >
                        {{ item.label | translate }}
                    </span>
                </a>
            }
        </div>
    </div>
  `,
  styles: [`
    :host {
        display: block;
    }
  `],
})
export class Navbar implements AfterViewInit, OnDestroy {
  @ViewChild('logo') logo!: ElementRef;
  isMenuOpen = signal(false);
  currentLang = signal('en');
  logoWhite = signal(false);

  private readonly scrollHandler = () => this.updateLogoColor();

  navItems = [
    { path: '/', label: 'NAV.HOME' },
    { path: '/studio', label: 'NAV.STUDIO' },
    { path: '/work', label: 'NAV.WORK' },
    { path: '/contact', label: 'NAV.CONTACT' },
  ];

  constructor(private translate: TranslateService) {
    this.currentLang.set(this.translate.currentLang || 'en');
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(this.logo.nativeElement, {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "100px top",
        scrub: true,
      },
      y: -50,
      opacity: 0,
      ease: "none"
    });

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.updateLogoColor();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollHandler);
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  private updateLogoColor() {
    const elements = document.elementsFromPoint(window.innerWidth / 2, 120);
    for (const el of elements) {
      if (el === document.documentElement || el === document.body) continue;
      if (el.closest('nav, app-navbar')) continue;
      const bg = getComputedStyle(el as HTMLElement).backgroundColor;
      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') continue;
      const nums = bg.match(/\d+/g)?.map(Number) ?? [];
      if (nums.length >= 3) {
        const luma = 0.299 * nums[0] + 0.587 * nums[1] + 0.114 * nums[2];
        this.logoWhite.set(luma < 100);
        return;
      }
    }
    this.logoWhite.set(false);
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  toggleLanguage() {
    const nextLang = this.currentLang() === 'en' ? 'ar' : 'en';
    this.translate.use(nextLang);
    this.currentLang.set(nextLang);
    localStorage.setItem('lang', nextLang);

    // Update document direction
    const dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = nextLang;
  }

  isActive(path: string): boolean {
    return window.location.pathname === path;
  }

  isRtl(): boolean {
    return this.currentLang() === 'ar';
  }
}
