import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectionStrategy, NgZone, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LuminaOrb } from '../../components/lumina-orb/lumina-orb';
import { DotOrbit } from '../../components/dot-orbit/dot-orbit';
import { Magnet } from '../../directives/magnet';
import { ProjectService } from '../../services/project.service';
import { ClientService } from '../../services/client.service';
import { Router, RouterLink } from '@angular/router';
import { TransitionService } from '../../services/transition.service';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, LuminaOrb, DotOrbit, Magnet, TranslateModule, RouterLink],
    template: `
    <!-- Hero Section -->
    <section #hero 
      class="min-h-screen flex flex-col justify-center items-center px-6 md:px-10 py-32 relative overflow-hidden bg-cosmic-bg"
    >
      <!-- Parallax Background Layer -->
      <div #parallaxBg class="absolute inset-0 z-0 pointer-events-none scale-150 md:scale-110 opacity-10 md:opacity-30">
        <app-lumina-orb></app-lumina-orb>
      </div>

      <!-- Floating Particles -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="particle absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan/20 rounded-full blur-sm"></div>
        <div class="particle absolute top-3/4 left-1/3 w-3 h-3 bg-cosmic-text/10 rounded-full blur-sm"></div>
        <div class="particle absolute top-1/3 right-1/4 w-2 h-2 bg-neon-cyan/15 rounded-full blur-sm"></div>
        <div class="particle absolute bottom-1/4 right-1/3 w-4 h-4 bg-white/5 rounded-full blur-sm"></div>
      </div>

      <div class="z-10 text-center max-w-6xl">
        <h1 #title class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8 md:mb-12 font-cosmic leading-[1.1] md:leading-[1.05] tracking-tighter cursor-default font-black uppercase rtl:text-4xl rtl:md:text-6xl rtl:tracking-normal">
          <div class="overflow-hidden inline-block pb-2 px-1"><span class="reveal-line inline-block">{{ 'HOME.HERO_TITLE_1' | translate }}</span></div> <br/>
          <div class="overflow-hidden inline-block pb-2 px-1">
            <span class="reveal-line inline-block">
              {{ 'HOME.HERO_TITLE_2' | translate }} <span class="text-neon-cyan italic shine-text">{{ 'HOME.HERO_IMPACT' | translate }}</span>
            </span>
          </div> <br/>
        </h1>

        <div #subtext class="max-w-2xl mx-auto opacity-0 translate-y-10 group px-4">
            <p class="font-body text-base md:text-lg text-neon-cyan/70 font-medium leading-relaxed mb-10">
              {{ 'HOME.HERO_DESC' | translate }}
            </p>
            
            <a routerLink="/work" 
               class="inline-flex items-center gap-4 px-10 py-5 bg-neon-cyan text-white rounded-full font-mono text-xs uppercase tracking-[0.2em] font-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(224,16,40,0.2)] hover:shadow-[0_30px_60px_rgba(224,16,40,0.4)] rtl:tracking-normal rtl:text-sm"
               appMagnet [appMagnetStrength]="0.3">
               {{ 'HOME.HERO_CTA' | translate }}
               <div class="w-6 h-6 flex items-center justify-center bg-black/10 rounded-full group-hover:translate-x-1 transition-transform rtl:rotate-180">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
               </div>
            </a>
        </div>
      </div>

      <div class="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 hidden md:block group cursor-pointer" (click)="scrollToWork()">
         <div class="flex flex-col items-center gap-4">
             <span class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan/50 group-hover:text-neon-cyan transition-colors">{{ 'HOME.SCROLL' | translate }}</span>
             <div class="relative w-px h-12 md:h-16 bg-gradient-to-b from-cosmic-text/20 via-cosmic-text/80 to-transparent overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1/2 bg-neon-cyan animate-scroll-line"></div>
             </div>
         </div>
      </div>
    </section>

    <!-- Work Section (Grid Style) -->
    <section class="py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-cosmic-bg relative z-10">
      
      <!-- Vision Heading -->
      <div class="max-w-full mb-24">
        <p class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan mb-8">{{ 'HOME.FEATURED_WORK_SUB' | translate }}</p>
        <h2 class="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-body font-black tracking-tighter leading-[1.05] max-w-full rtl:text-right">
            {{ 'HOME.VISION_TEXT_1' | translate }} <span class="text-neon-cyan/30">{{ 'HOME.VISION_TEXT_2' | translate }}</span> {{ 'HOME.VISION_TEXT_3' | translate }}
        </h2>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-3 mb-12 justify-center">
        @for (cat of homeCategories(); track cat) {
          <button
            (click)="filterFeatured(cat)"
            class="px-6 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest font-black transition-all duration-300 border"
            [ngClass]="activeFilter() === cat
              ? 'bg-neon-cyan text-white border-neon-cyan shadow-[0_0_20px_rgba(224,16,40,0.3)]'
              : 'bg-transparent text-zinc-400 border-black/10 hover:border-neon-cyan/50 hover:text-neon-cyan'">
            {{ cat }}
          </button>
        }
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-20">
        @for (project of displayedProjects(); track project._id) {
          <div (click)="goToProject(project.slug)" class="project-item group cursor-pointer relative overflow-hidden rounded-[2.5rem] bg-zinc-900 aspect-[4/3] md:aspect-[16/10] block">
              <img [src]="project.img" [alt]="project.title" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors"></div>

              <!-- Content -->
              <div class="absolute bottom-10 left-10 rtl:left-auto rtl:right-10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <h3 class="text-white font-body text-4xl font-black tracking-tight drop-shadow-xl">{{ project.title }}</h3>
              </div>
          </div>
        }
      </div>

      <!-- View All Link -->
      <div class="flex justify-center mt-14">
        <a routerLink="/work" class="inline-flex items-center gap-4 px-10 py-5 border border-black/10 text-zinc-400 rounded-full font-mono text-xs uppercase tracking-[0.2em] font-black transition-all hover:border-neon-cyan hover:text-neon-cyan">
          {{ 'HOME.HERO_CTA' | translate }}
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
        </a>
      </div>
    </section>

    <!-- Services Section (Stacking Cards) -->
    <section #servicesSection class="py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-cosmic-bg relative z-10">
        
        <!-- Header -->
        <div class="max-w-full mb-24">
            <p class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan mb-8">{{ 'HOME.SERVICES_SUB' | translate }}</p>
            <h2 class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-body font-black tracking-tighter leading-[1.05] max-w-full rtl:text-right">
                {{ 'HOME.SERVICES_TEXT_1' | translate }} <span class="text-neon-cyan/30">{{ 'HOME.SERVICES_TEXT_2' | translate }}</span> {{ 'HOME.SERVICES_TEXT_3' | translate }}
            </h2>
        </div>

        <!-- Cards Container -->
        <div class="relative flex flex-col gap-0 pb-[60vh]">
            @for (service of services; track service.title; let i = $index) {
                <div 
                    class="service-card sticky top-24 md:top-32 w-full min-h-[60vh] md:min-h-[70vh] bg-zinc-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 flex flex-col justify-between text-white border border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] mb-[4vh] md:mb-[10vh] overflow-hidden" 
                    [style.zIndex]="i + 1"
                    [style.top]="(windowWidth < 768 ? (80 + (i * 10)) : (100 + (i * 20))) + 'px'"
                >
                    
                    <!-- Background Accent -->
                    <div class="absolute top-0 right-0 w-2/3 h-2/3 bg-neon-cyan/5 blur-[120px] pointer-events-none"></div>

                    <div class="relative z-10 rtl:text-right">
                        <div class="mb-4">
                             <h3 class="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-body font-black tracking-tight leading-[0.9] text-white">
                                {{ service.title | translate }} <br>
                                <span class="text-white/20">{{ service.subtitle | translate }}</span>
                             </h3>
                        </div>

                        <!-- Tags -->
                        <div class="flex flex-wrap gap-2 md:gap-3 mt-8 md:mt-12 rtl:justify-end">
                            @for (tag of (service.tagsKey | translate); track tag) {
                                <span class="px-3 py-1 md:px-6 md:py-2 font-mono text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 rounded-full hover:bg-neon-cyan hover:text-white hover:border-neon-cyan transition-all duration-300 cursor-default">
                                    {{ tag }}
                                </span>
                            }
                        </div>
                    </div>

                    <div class="mt-12 md:mt-20 relative z-10 max-w-3xl flex flex-col md:flex-row gap-6 md:gap-10 items-start rtl:md:flex-row-reverse">
                        <div class="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 text-neon-cyan/80">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="animate-[spin_4s_linear_infinite]"><path d="M12 0l2.5 9.5 9.5 2.5-9.5 2.5-2.5 9.5-2.5-9.5-9.5-2.5 9.5-2.5z"/></svg>
                        </div>
                        <p class="font-body text-base md:text-xl text-neon-cyan/50 leading-relaxed font-medium rtl:text-right">
                            {{ service.description | translate }}
                        </p>
                    </div>
                </div>
            }
        </div>

    </section>

    <!-- Clients Section -->
    <section #clientsSection class="py-24 md:py-36 bg-black relative z-10 overflow-hidden">

        <!-- Ambient glow -->
        <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div class="absolute top-0 right-0 w-[700px] h-[700px] bg-neon-cyan/8 blur-[200px] rounded-full -translate-y-1/3 translate-x-1/3"></div>
            <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-cyan/5 blur-[160px] rounded-full translate-y-1/3 -translate-x-1/3"></div>
        </div>

        <!-- Header -->
        <div class="px-6 md:px-10 lg:px-20 mb-14 md:mb-20 relative z-10">
            <p class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan mb-6">{{ 'HOME.CLIENTS_SUB' | translate }}</p>
            <h2 class="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-body font-black tracking-tighter leading-[0.95] text-white uppercase italic">
                {{ 'HOME.CLIENTS_TITLE' | translate }}
            </h2>
        </div>

        <!-- Ticker strip -->
        <div class="relative overflow-hidden mb-14 md:mb-20 border-t border-b border-white/5 py-6 md:py-9">
            <div class="flex gap-14 md:gap-24 whitespace-nowrap clients-ticker">
                @for (client of clients(); track client._id) {
                    @if (client.logo) {
                        <img [src]="getImageUrl(client.logo)" [alt]="client.name"
                             class="h-10 md:h-12 w-auto object-contain brightness-0 invert opacity-35 flex-shrink-0 pointer-events-none select-none">
                    } @else {
                        <span class="text-xl md:text-2xl font-cosmic font-black text-white/30 flex-shrink-0 uppercase">{{ client.name }}</span>
                    }
                }
                @for (client of clients(); track client._id + 'dup') {
                    @if (client.logo) {
                        <img [src]="getImageUrl(client.logo)" [alt]="client.name"
                             class="h-10 md:h-12 w-auto object-contain brightness-0 invert opacity-35 flex-shrink-0 pointer-events-none select-none">
                    } @else {
                        <span class="text-xl md:text-2xl font-cosmic font-black text-white/30 flex-shrink-0 uppercase">{{ client.name }}</span>
                    }
                }
            </div>
        </div>

        <!-- Logo Grid -->
        <div class="px-6 md:px-10 lg:px-20 relative z-10">
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                @for (client of clients(); track client._id) {
                    <div class="client-logo-item group h-32 md:h-36 flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/8 hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-500 cursor-default relative overflow-hidden px-4"
                         appMagnet [appMagnetStrength]="0.12">

                        <!-- Hover glow -->
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,16,40,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        @if (client.logo) {
                            <img [src]="getImageUrl(client.logo)"
                                 [alt]="client.name"
                                 class="h-16 md:h-20 w-auto max-w-[85%] object-contain
                                        brightness-0 invert opacity-55
                                        group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100
                                        transition-all duration-500 group-hover:scale-105">
                        } @else {
                            <span class="font-cosmic text-sm md:text-base font-black text-white/55 group-hover:text-white transition-all duration-500 select-none uppercase text-center leading-tight px-2">
                                {{ client.name }}
                            </span>
                        }

                        <span class="font-mono text-[7px] uppercase tracking-widest text-white/25 group-hover:text-white/55 transition-all duration-500 select-none truncate max-w-full px-2 text-center">
                            {{ client.name }}
                        </span>
                    </div>
                }
            </div>
        </div>
    </section>

    <!-- Ready Section (CTA) -->
    <section class="py-24 md:py-40 bg-black flex flex-col items-center justify-center px-6 md:px-20 lg:px-40 relative overflow-hidden min-h-screen text-white">
        
        <!-- Atmospheric Background -->
        <div class="absolute inset-0 z-0">
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-neon-cyan/10 blur-[180px] rounded-full animate-pulse-slow"></div>
             <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150 invert"></div>
        </div>

        <!-- Content -->
        <div class="z-10 flex flex-col items-center text-center max-w-5xl">
            <p class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan mb-12 opacity-80">{{ 'HOME.CLIENTS_SUB' | translate }}</p>
            
            <h2 class="text-6xl md:text-[8rem] lg:text-[10rem] font-body font-black tracking-tighter leading-[0.85] mb-16 select-none uppercase italic text-white">
                {{ 'HOME.CTA_TITLE' | translate }} <br> 
                <span class="text-neon-cyan/20">{{ 'HOME.CTA_SUB' | translate }}</span>
            </h2>
            
            <div class="flex flex-wrap justify-center gap-6">
                <!-- Chat Button -->
                <a routerLink="/contact" class="group flex items-center gap-6 px-10 py-6 bg-neon-cyan text-white rounded-full hover:scale-105 transition-all duration-500 shadow-[0_20px_60px_rgba(224,16,40,0.3)]" appMagnet [appMagnetStrength]="0.2">
                    <span class="font-mono text-xs uppercase tracking-widest font-black">{{ 'COMMON.CHAT_WITH' | translate }}</span>
                    <div class="w-10 h-10 rounded-full bg-white text-neon-cyan flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 shadow-xl">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M7 17L17 7M17 7H7M17 7v10"></path></svg>
                    </div>
                </a>

                <!-- Meeting Button -->
                <a href="/book" class="group flex items-center gap-6 px-10 py-6 border border-white/10 text-white rounded-full hover:bg-white/5 transition-all duration-300" appMagnet [appMagnetStrength]="0.2">
                    <span class="font-mono text-xs uppercase tracking-widest font-black">{{ 'HOME.CTA_BOOK' | translate }}</span>
                    <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                </a>
            </div>
        </div>

        <!-- Floating Decor -->
        <div class="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-[0.1] pointer-events-none scale-75 md:scale-100">
             <app-dot-orbit></app-dot-orbit>
        </div>

    </section>
  `,
    styles: [`
    :host { display: block; }
    .reveal-line { display: block; }
    .service-card {
        will-change: transform;
    }
    .shine-text {
      position: relative;
      background: linear-gradient(120deg, transparent 0%, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%, transparent 100%);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      animation: shine 6s infinite linear;
    }
    @keyframes shine {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes scroll-line {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(200%); }
    }
    .animate-scroll-line {
      animation: scroll-line 2s infinite cubic-bezier(0.7, 0, 0.3, 1);
    }
    .animate-spin-slow {
      animation: spin 12s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .clients-ticker {
      animation: ticker 60s linear infinite;
    }
    @keyframes ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-pulse-slow {
      animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
    .rtl:rotate-180 {
        transform: rotate(180deg);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements AfterViewInit {
    @ViewChild('hero') hero!: ElementRef;
    @ViewChild('title') title!: ElementRef;
    @ViewChild('subtext') subtext!: ElementRef;
    @ViewChild('parallaxBg') parallaxBg!: ElementRef;
    @ViewChild('servicesSection') servicesSection!: ElementRef;
    @ViewChild('clientsSection') clientsSection!: ElementRef;

    private zone = inject(NgZone);
    private projectService = inject(ProjectService);
    private clientService = inject(ClientService);
    private router = inject(Router);
    private transitionService = inject(TransitionService);

    activeFilter = signal('All');

    homeCategories = computed(() => {
        const cats = [...new Set(
            this.projectService.getFeaturedProjects().map((p: any) => p.cat).filter(Boolean)
        )] as string[];
        return ['All', ...cats];
    });

    displayedProjects = computed(() => {
        const featured = this.projectService.getFeaturedProjects();
        const active = this.activeFilter();
        const filtered = active === 'All' ? featured : featured.filter((p: any) => p.cat === active);
        return filtered.slice(0, 4);
    });

    clients = this.clientService.clients;

    getImageUrl(path: string | undefined): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        
        let baseUrl = '';
        try {
            baseUrl = new URL(environment.apiUrl).origin;
        } catch {
            baseUrl = environment.apiUrl.replace(/\/api$/, '');
        }
        
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    }


    services = [
        {
            title: 'SERVICES.BRAND.TITLE',
            subtitle: 'SERVICES.BRAND.SUBTITLE',
            tagsKey: 'SERVICES.BRAND.TAGS',
            description: 'SERVICES.BRAND.DESC'
        },
        {
            title: 'SERVICES.DEVELOPMENT.TITLE',
            subtitle: 'SERVICES.DEVELOPMENT.SUBTITLE',
            tagsKey: 'SERVICES.DEVELOPMENT.TAGS',
            description: 'SERVICES.DEVELOPMENT.DESC'
        },
        {
            title: 'SERVICES.MARKETING.TITLE',
            subtitle: 'SERVICES.MARKETING.SUBTITLE',
            tagsKey: 'SERVICES.MARKETING.TAGS',
            description: 'SERVICES.MARKETING.DESC'
        }
    ];

    filterFeatured(cat: string) {
        this.activeFilter.set(cat);
    }

    goToProject(slug: string | undefined) {
        if (!slug) return;
        const project = this.projectService.getProjectById(slug);
        this.transitionService.navigateWithTransition({
            url: ['/work', slug],
            title: project?.title,
            client: project?.client
        });
    }

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            gsap.registerPlugin(ScrollTrigger);

            const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

            tl.from('.reveal-line', {
                y: '105%',
                stagger: 0.15,
                delay: 0.8
            })
                .to(this.subtext.nativeElement, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2
                }, '-=1');

            // Initial particle animation
            gsap.from('.particle', {
                scale: 0,
                opacity: 0,
                stagger: 0.1,
                duration: 1.5,
                ease: 'back.out(1.7)'
            });

            this.setupParallax();

            // Project animations — single trigger on the grid, staggered, fires once
            const projectItems = gsap.utils.toArray('.project-item');
            if (projectItems.length) {
                gsap.from(projectItems, {
                    scrollTrigger: {
                        trigger: '.project-item',
                        start: 'top 88%',
                        once: true,
                    },
                    opacity: 0,
                    y: 40,
                    duration: 0.9,
                    stagger: 0.08,
                    ease: 'power3.out',
                    clearProps: 'all',
                });
            }

            // Stacking cards animation logic
            const cards = gsap.utils.toArray('.service-card') as HTMLElement[];
            cards.forEach((card, index) => {
                const isLast = index === cards.length - 1;

                const isMobile = window.innerWidth < 768;
                const topOffset = isMobile ? (80 + (index * 10)) : (100 + (index * 20));

                ScrollTrigger.create({
                    trigger: card,
                    start: `top top+=${topOffset}`,
                    end: () => isLast ? 'bottom bottom' : '+=100%',
                    pin: true,
                    pinSpacing: false,
                    scrub: true,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (!isLast) {
                            // Progressively scale down and dim the card as we scroll past it
                            const scale = 1 - (self.progress * 0.05);
                            const opacity = 1 - (self.progress * 0.5);
                            const blur = self.progress * 4;
                            gsap.set(card, {
                                scale: scale,
                                opacity: opacity,
                                filter: `blur(${blur}px)`
                            });
                        }
                    }
                });

                // Reveal animation for content inside card
                gsap.from(card.querySelectorAll('.z-10 > div, .mt-12'), {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top center+=200',
                        toggleActions: 'play none none reverse'
                    },
                    y: 50,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 1.2,
                    ease: 'power3.out'
                });
            });

            // Clients Section Animation
            gsap.from(this.clientsSection.nativeElement.querySelectorAll('.client-logo-item'), {
                scrollTrigger: {
                    trigger: this.clientsSection.nativeElement,
                    start: 'top 70%',
                    once: true,
                },
                opacity: 0,
                y: 60,
                scale: 0.8,
                stagger: {
                    amount: 0.8,
                    from: "start",
                    grid: "auto"
                },
                duration: 1.2,
                ease: "expo.out",
                clearProps: 'all',
            });
        });
    }

    private setupParallax() {
        const titleSetter = {
            x: gsap.quickSetter(this.title.nativeElement, "x", "px"),
            y: gsap.quickSetter(this.title.nativeElement, "y", "px")
        };

        const bgSetter = {
            x: gsap.quickSetter(this.parallaxBg.nativeElement, "x", "px"),
            y: gsap.quickSetter(this.parallaxBg.nativeElement, "y", "px")
        };

        const subtextSetter = {
            x: gsap.quickSetter(this.subtext.nativeElement, "x", "px"),
            y: gsap.quickSetter(this.subtext.nativeElement, "y", "px")
        };

        const particles = gsap.utils.toArray('.particle');

        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth) - 0.5;
            const yPos = (clientY / window.innerHeight) - 0.5;

            titleSetter.x(xPos * 40);
            titleSetter.y(yPos * 40);

            bgSetter.x(xPos * -60);
            bgSetter.y(yPos * -60);

            subtextSetter.x(xPos * 20);
            subtextSetter.y(yPos * 20);

            particles.forEach((p: any, i) => {
                gsap.to(p, {
                    x: xPos * (50 + i * 30),
                    y: yPos * (50 + i * 30),
                    duration: 1.2 + i * 0.1,
                    ease: 'power2.out'
                });
            });
        });
    }

    get windowWidth() {
        return window.innerWidth;
    }

    scrollToWork() {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    }
}
