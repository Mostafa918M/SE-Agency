import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectionStrategy, signal, computed, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WorkOrbit } from '../../components/work-orbit/work-orbit';
import { Magnet } from '../../directives/magnet';
import { ProjectService, ProjectData } from '../../services/project.service';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { TransitionService } from '../../services/transition.service';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';



@Component({
    selector: 'app-work',
    standalone: true,
    imports: [CommonModule, WorkOrbit, Magnet, TranslateModule],
    template: `
    <!-- Immersive Presentation Section -->
    <div #presentationContainer class="relative bg-zinc-950 overflow-hidden min-h-screen rtl:text-right">
        
        <!-- Progress Bar -->
        <div class="fixed top-0 left-0 w-full h-1 z-[100] bg-white/5">
            <div #progressBar class="h-full bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)] w-0"></div>
        </div>

        <!-- Background Layers -->
        <div class="absolute inset-0 z-0 pointer-events-none opacity-40">
            <app-work-orbit></app-work-orbit>
        </div>

        <!-- Presentation Slides -->
        <div #slidesWrapper class="relative z-10 h-screen w-full">
            
            <!-- Slide 0: Intro Hero -->
            <section class="slide-section absolute inset-0 flex items-center justify-center p-6 md:p-10 z-[10]">
                <div class="text-center">
                    <div class="overflow-hidden mb-8 pb-2">
                        <p class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan intro-reveal">{{ 'WORK.SUB' | translate }}</p>
                    </div>
                    <h2 class="text-[15vw] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-body font-black text-white leading-[0.8] uppercase font-cosmic intro-main">
                        {{ 'WORK.MAIN_TITLE' | translate }}
                    </h2>
                    <div class="mt-12 flex flex-col items-center gap-4 animate-pulse intro-reveal">
                        <span class="font-mono text-[10px] uppercase tracking-widest text-neon-cyan/40">{{ 'WORK.EXPLORE' | translate }}</span>
                        <div class="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"></div>
                    </div>
                </div>
            </section>

            <!-- Slides 1-3: Services Focus -->
            @for (service of services; track service.title; let i = $index) {
                <section class="slide-section absolute inset-0 flex flex-col md:flex-row items-center justify-between p-6 md:p-32 bg-zinc-950/80 backdrop-blur-3xl border-t border-white/5 opacity-0 pointer-events-none z-[9] rtl:md:flex-row-reverse">
                    <div class="w-full md:w-1/2">
                        <p class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan mb-6">{{ 'WORK.FOCUS_SUB' | translate }}{{ i + 1 }}</p>
                        <h3 class="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-body font-black text-white leading-none mb-10 uppercase service-title py-2 rtl:text-5xl">
                            {{ service.title | translate }} <br>
                            <span class="text-neon-cyan/20 italic shine-text">{{ service.subtitle | translate }}</span>
                        </h3>
                        <p class="text-xl md:text-2xl text-neon-cyan/50 font-medium max-w-xl leading-relaxed service-desc">
                            {{ service.description | translate }}
                        </p>
                    </div>
                    <div class="w-full md:w-1/3 flex flex-wrap gap-4 mt-12 md:mt-0 service-tags rtl:justify-end">
                        @for (tag of (service.tagsKey | translate); track tag) {
                            <span class="px-6 py-3 border border-white/10 rounded-full font-mono text-[10px] uppercase tracking-widest text-neon-cyan/40 bg-white/5 hover:border-neon-cyan hover:text-white transition-colors cursor-default">
                                {{ tag }}
                            </span>
                        }
                    </div>
                </section>
            }

            <!-- Client Marquee Slide -->
            <section class="slide-section absolute inset-0 flex flex-col justify-center bg-zinc-50 text-black overflow-hidden z-[8] opacity-0 pointer-events-none">
                
                <!-- Background Accent -->
                <div class="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
                     <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[2px] border-black rounded-full scale-110"></div>
                </div>

                <!-- Marquee Row 1 (Logos) -->
                <div class="marquee-container flex whitespace-nowrap mb-10 md:mb-20">
                    <div class="marquee-track flex gap-12 md:gap-24 py-10 items-center">
                        @for (client of clients(); track client._id) {
                            @if (client.logo) {
                                <div class="flex items-center justify-center h-20 md:h-32 px-10 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                                    <img [src]="getImageUrl(client.logo)" [alt]="client.name" class="max-w-full max-h-full object-contain">
                                </div>
                            } @else {
                                <span class="text-[5rem] md:text-[8rem] font-body font-black tracking-tighter uppercase opacity-10 hover:opacity-100 transition-opacity cursor-default">{{ client.name }}</span>
                            }
                        }
                        <!-- Repeat for infinite animation -->
                        @for (client of clients(); track client._id + 'rep') {
                            @if (client.logo) {
                                <div class="flex items-center justify-center h-20 md:h-32 px-10 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                                    <img [src]="getImageUrl(client.logo)" [alt]="client.name" class="max-w-full max-h-full object-contain">
                                </div>
                            } @else {
                                <span class="text-[5rem] md:text-[8rem] font-body font-black tracking-tighter uppercase opacity-10 hover:opacity-100 transition-opacity cursor-default">{{ client.name }}</span>
                            }
                        }
                    </div>
                </div>

                <!-- Marquee Row 2 (Names) -->
                <div class="marquee-container flex whitespace-nowrap bg-black text-white py-4 md:py-8 rotate-[-1deg] scale-105 shadow-2xl z-10">
                    <div class="marquee-track flex gap-20 items-center animate-marquee-reverse">
                        @for (client of clients(); track client._id + 'name') {
                            <span class="text-3xl md:text-6xl font-cosmic font-black tracking-widest uppercase opacity-20 hover:opacity-100 transition-opacity cursor-default">{{ client.name }}</span>
                        }
                        <!-- Repeat for infinite animation -->
                        @for (client of clients(); track client._id + 'namerep') {
                            <span class="text-3xl md:text-6xl font-cosmic font-black tracking-widest uppercase opacity-20 hover:opacity-100 transition-opacity cursor-default">{{ client.name }}</span>
                        }
                    </div>
                </div>

                <div class="text-center mt-20 relative z-10">
                    <p class="font-mono text-[10px] uppercase tracking-[1em] text-neon-cyan/40">{{ 'WORK.MARQUEE_SUB' | translate }}</p>
                </div>
            </section>

            <!-- Featured Work Horizontal Sampler -->
            <section #samplerContainer class="slide-section absolute inset-0 bg-zinc-900 border-t border-white/5 overflow-hidden flex flex-col justify-center z-[7] opacity-0 pointer-events-none">
                <div class="px-10 md:px-32 mb-12 rtl:text-right">
                     <p class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan mb-2">{{ 'WORK.SAMPLER_SUB' | translate }}</p>
                     <h2 class="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-body font-black text-white tracking-tighter uppercase">{{ 'WORK.SAMPLER_TITLE_1' | translate }} <span class="text-neon-cyan/20">{{ 'WORK.SAMPLER_TITLE_2' | translate }}</span></h2>
                </div>
                
                @if (featuredProjects().length > 0) {
                    <div #horizontalScroll class="flex gap-10 px-10 md:px-32 relative rtl:flex-row-reverse">
                        @for (project of featuredProjects(); track project._id; let i = $index) {
                            <div (click)="goToProject(project.slug)" class="sampler-card flex-shrink-0 w-[80vw] md:w-[540px] lg:w-[500px] xl:w-[580px] aspect-[16/10] bg-zinc-900 rounded-[3rem] overflow-hidden relative group cursor-pointer" appMagnet [appMagnetStrength]="0.05">
                                <img [src]="project.img" [alt]="project.title" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
                                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors"></div>
                                
                                <div class="absolute inset-0 p-10 flex flex-col justify-between z-10 rtl:text-right">
                                    <span class="font-mono text-[10px] uppercase tracking-widest text-white/60">0{{ i + 1 }}</span>
                                    <div>
                                        <h4 class="text-4xl md:text-6xl font-body font-black text-white tracking-tighter leading-none uppercase mb-2">
                                            {{ project.title }}
                                        </h4>
                                        <p class="font-mono text-[9px] uppercase tracking-[0.3em] text-neon-cyan opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            {{ 'WORK.CASE_STUDY' | translate }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                } @else {
                    <div class="px-10 md:px-32 py-20 border border-white/5 rounded-[3rem] mx-10 md:mx-32 bg-white/5 flex flex-col items-center justify-center text-center">
                         <p class="text-neon-cyan/20 font-mono uppercase tracking-[0.5em] text-xs">{{ 'WORK.EXCELLENCE_LOADING' | translate }}</p>
                         <p class="text-neon-cyan/20 mt-4 max-w-sm">{{ 'WORK.SAMPLER_DESC' | translate }}</p>
                    </div>
                }
            </section>

             <!-- Bridge to Gallery -->
             <section class="slide-section absolute inset-0 flex items-center justify-center bg-zinc-50 z-[6] overflow-hidden opacity-0 pointer-events-none">
                 <div #bridgeText class="text-center p-10">
                    <p class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan/30 mb-8">{{ 'WORK.BRIDGE_SUB' | translate }}</p>
                    <h3 class="text-5xl md:text-7xl lg:text-8xl xl:text-[9rem] font-body font-black tracking-tighter text-zinc-900 mb-12 uppercase leading-[0.8]">
                        {{ 'WORK.BRIDGE_TITLE_1' | translate }} <br> <span class="text-neon-cyan/10">{{ 'WORK.BRIDGE_TITLE_2' | translate }}</span>
                    </h3>
                    <div class="flex flex-col items-center gap-4">
                         <div #scrollIndicator class="w-px h-24 bg-gradient-to-b from-black/5 to-black/40 overflow-hidden">
                            <div class="w-full h-1/2 bg-black animate-scroll-line"></div>
                         </div>
                    </div>
                 </div>
             </section>
        </div>
    </div>

    <!-- Original Project Gallery Section -->
    <div #mainContent class="relative z-[60] bg-zinc-50 shadow-[0_-50px_100px_rgba(0,0,0,0.1)] opacity-0">
        <section class="pt-32 pb-20 px-6 md:px-10 lg:px-20 bg-zinc-50">
            <!-- Categories -->
            <div class="flex flex-wrap gap-4 mb-20 justify-center">
                @for (cat of categories(); track cat) {
                    <button
                    (click)="filterBy(cat)"
                    class="px-8 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest font-black transition-all duration-300 border border-black/5"
                    [ngClass]="activeCategory() === cat ? 'bg-black text-white shadow-xl' : 'bg-transparent text-zinc-500 hover:bg-zinc-200'"
                    appMagnet [appMagnetStrength]="0.2"
                    >
                        {{ cat }}
                    </button>
                }
            </div>

            <!-- Projects Grid -->
            @if (filteredProjects().length > 0) {
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-16 relative z-20 max-w-7xl mx-auto rtl:flex-row-reverse">
                @for (project of filteredProjects(); track project._id) {
                        <div (click)="goToProject(project.slug)" class="project-card-item group relative cursor-pointer overflow-hidden rounded-[3rem] bg-zinc-900 aspect-[4/3] md:aspect-[16/10] block" appMagnet [appMagnetStrength]="0.03">
                            <img [src]="project.img" [alt]="project.title" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                            
                            <div class="absolute bottom-10 left-10 rtl:left-auto rtl:right-10 overflow-hidden">
                                <h3 class="text-white font-body text-4xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-2xl translate-y-full group-hover:translate-y-0 transition-transform duration-700">
                                    {{ project.title }}
                                </h3>
                            </div>
                        </div>
                    }
                </div>
            } @else {
                <div class="py-40 text-center">
                    <p class="text-neon-cyan/30 font-mono uppercase tracking-[0.5em]">{{ 'WORK.NO_PROJECTS' | translate }}</p>
                </div>
            }
        </section>

        <!-- Logos Showcase -->
        <section class="py-24 md:py-32 bg-black px-6 md:px-10 lg:px-20">
            <div class="mb-16 text-center">
                <p class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan mb-6">{{ 'HOME.CLIENTS_SUB' | translate }}</p>
                <h2 class="text-3xl md:text-5xl font-body font-black text-white tracking-tighter uppercase italic">{{ 'HOME.CLIENTS_TITLE' | translate }}</h2>
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                @for (client of clients(); track client._id) {
                    <div class="logo-showcase-item group h-28 md:h-32 flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/8 hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-500 cursor-default relative overflow-hidden px-3">
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,16,40,0.08)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        @if (client.logo) {
                            <img [src]="getImageUrl(client.logo)" [alt]="client.name"
                                 class="h-12 md:h-14 w-auto max-w-[85%] object-contain
                                        brightness-0 invert opacity-40
                                        group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100
                                        transition-all duration-500 group-hover:scale-105">
                        } @else {
                            <span class="font-cosmic text-sm font-black text-white/40 group-hover:text-white transition-all duration-500 select-none uppercase text-center leading-tight px-2">{{ client.name }}</span>
                        }
                        <span class="font-mono text-[7px] uppercase tracking-widest text-white/25 group-hover:text-white/55 transition-all duration-500 select-none truncate max-w-full px-2 text-center">{{ client.name }}</span>
                    </div>
                }
            </div>
        </section>

        <!-- Footer CTA -->
        <section class="py-40 bg-zinc-50 border-t border-black/5 flex flex-col items-center justify-center">
            <h2 class="text-4xl md:text-7xl font-body font-black tracking-tighter mb-12 text-zinc-900 uppercase">{{ 'WORK.START_STORY' | translate }}</h2>
            <a href="/contact" class="px-12 py-6 bg-black text-white rounded-full font-mono font-black uppercase text-xs tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-2xl" appMagnet [appMagnetStrength]="0.3">
                {{ 'WORK.COLLAB_BTN' | translate }}
            </a>
        </section>
    </div>
  `,
    styles: [`
    :host { display: block; background: #000; }
    .slide-section {
        will-change: transform, opacity;
    }
    .marquee-track {
        animation: marquee 30s linear infinite;
    }
    .animate-marquee-reverse {
        animation: marquee 40s linear infinite reverse;
    }
    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    .shine-text {
      position: relative;
      background: linear-gradient(120deg, transparent 0%, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%, transparent 100%);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      animation: shine 4s infinite linear;
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
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Work implements AfterViewInit {
    @ViewChild('presentationContainer') presentationContainer!: ElementRef;
    @ViewChild('slidesWrapper') slidesWrapper!: ElementRef;
    @ViewChild('mainContent') mainContent!: ElementRef;
    @ViewChild('progressBar') progressBar!: ElementRef;
    @ViewChild('samplerContainer') samplerContainer!: ElementRef;
    @ViewChild('horizontalScroll') horizontalScroll!: ElementRef;
    @ViewChild('bridgeText') bridgeText!: ElementRef;

    private zone = inject(NgZone);
    private projectService = inject(ProjectService);
    private transitionService = inject(TransitionService);
    private clientService = inject(ClientService);

    clients = computed(() => {
        const clients = this.clientService.clients();
        return clients.length > 0 ? clients : [
            { _id: '1', name: 'NIKE' } as any,
            { _id: '2', name: 'ADIDAS' } as any,
            { _id: '3', name: 'PORSCHE' } as any,
            { _id: '4', name: 'MERCEDES' } as any,
            { _id: '5', name: 'APPLE' } as any,
            { _id: '6', name: 'SONY' } as any
        ];
    });

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

    categories = computed(() => {
        const cats = [...new Set(
            this.projectService.projects().map(p => p.cat).filter(Boolean)
        )] as string[];
        return ['All', ...cats];
    });
    activeCategory = signal('All');

    featuredProjects = computed(() => this.projectService.getFeaturedProjects());
    filteredProjects = computed(() => {
        const projects = this.projectService.projects();
        const active = this.activeCategory();
        if (active === 'All') return projects;
        return projects.filter(p => p.cat === active);
    });

    goToProject(slug: string | undefined) {
        if (!slug) return;
        const project = this.projectService.getProjectById(slug);
        this.transitionService.navigateWithTransition({
            url: ['/work', slug],
            title: project?.title,
            client: project?.client
        });
    }

    filterBy(cat: string) {
        this.activeCategory.set(cat);
    }

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            gsap.registerPlugin(ScrollTrigger);

            // Ensure slides are pre-hidden except for first one
            gsap.set('.slide-section:not(:first-child)', { opacity: 0, pointerEvents: 'none' });

            setTimeout(() => {
                this.initAnimations();
                ScrollTrigger.refresh();
            }, 500);
        });
    }

    private initAnimations() {
        // 1. Scene Hero Intro (One-time)
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
        tl.from('.intro-reveal', { y: 30, opacity: 0, stagger: 0.2, delay: 0.5 })
            .from('.intro-main', { scale: 1.1, opacity: 0, duration: 2, ease: 'power2.out' }, '-=1');

        // 2. Global Presentation Timeline
        const mainTl = gsap.timeline({
            scrollTrigger: {
                trigger: this.presentationContainer.nativeElement,
                start: 'top top',
                end: '+=550%', // Condensed scroll distance
                pin: true,
                scrub: 1.2,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    gsap.set(this.progressBar.nativeElement, { width: `${self.progress * 100}%` });
                }
            }
        });

        // Intro Fade Out
        mainTl.to('.slide-section:nth-of-type(1)', { opacity: 0, scale: 0.8, y: -50, duration: 2 });

        // Services Reveals
        const services = gsap.utils.toArray('.slide-section:nth-of-type(n+2):nth-of-type(-n+4)') as HTMLElement[];
        services.forEach((service, i) => {
            mainTl.fromTo(service,
                { opacity: 0, y: 100, pointerEvents: 'none' },
                { opacity: 1, y: 0, pointerEvents: 'auto', duration: 3 }
            );
            mainTl.to(service, { opacity: 0, scale: 0.9, y: -100, duration: 2, delay: 1 });
        });

        // Client Marquee Fade In
        mainTl.fromTo('.marquee-container',
            { opacity: 0, scale: 0.8, pointerEvents: 'none' },
            { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 3 }
        );
        mainTl.to('.marquee-container', { opacity: 0, y: -100, duration: 2, delay: 1 });

        // Horizontal Scroll Selection
        mainTl.fromTo(this.samplerContainer.nativeElement,
            { opacity: 0, y: 100, pointerEvents: 'none' },
            { opacity: 1, y: 0, pointerEvents: 'auto', duration: 3 }
        );

        // Dynamic Horizontal Scroll
        if (this.horizontalScroll) {
            mainTl.to(this.horizontalScroll.nativeElement, {
                x: () => -(this.horizontalScroll.nativeElement.scrollWidth - window.innerWidth + 200),
                ease: 'none',
                duration: 10
            });
        } else {
            mainTl.to({}, { duration: 5 });
        }

        mainTl.to(this.samplerContainer.nativeElement, { opacity: 0, scale: 0.9, y: -100, duration: 3 });

        // Bridge Reveal
        mainTl.fromTo(this.bridgeText.nativeElement.parentElement,
            { opacity: 0, y: 100, pointerEvents: 'none' },
            { opacity: 1, y: 0, pointerEvents: 'auto', duration: 4 }
        );

        // Final Content Reveal - Starts much earlier and overlaps bridge
        mainTl.fromTo(this.mainContent.nativeElement,
            { y: '50vh', opacity: 0 },
            { y: 0, opacity: 1, duration: 8, ease: 'power2.inOut' },
            '-=3'
        );

        // Project grid items entry in the final section
        const gridItems = gsap.utils.toArray('.project-card-item');
        if (gridItems.length > 0) {
            gsap.from(gridItems, {
                scrollTrigger: {
                    trigger: '.project-card-item',
                    start: 'top 90%',
                    once: true,
                },
                opacity: 0,
                y: 50,
                stagger: 0.1,
                duration: 1,
                ease: 'power3.out',
                clearProps: 'all',
            });
        }

        // Logo showcase scroll animation
        const logoItems = gsap.utils.toArray('.logo-showcase-item');
        if (logoItems.length > 0) {
            gsap.from(logoItems, {
                scrollTrigger: {
                    trigger: '.logo-showcase-item',
                    start: 'top 85%',
                    once: true,
                },
                opacity: 0,
                y: 40,
                scale: 0.85,
                stagger: {
                    amount: 1.2,
                    from: 'start',
                    grid: 'auto',
                },
                duration: 0.8,
                ease: 'expo.out',
                clearProps: 'all',
            });
        }
    }
}

