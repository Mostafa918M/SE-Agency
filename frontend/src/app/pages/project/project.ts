import { Component, AfterViewInit, ElementRef, ViewChild, signal, NgZone, OnInit, ChangeDetectionStrategy, computed, OnDestroy, HostListener } from '@angular/core';
import { ProjectService, ProjectData } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnet } from '../../directives/magnet';
import { TransitionService } from '../../services/transition.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, Magnet],
  template: `
    @if (project(); as p) {
      <div class="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      
      <!-- 1. Hero Banner -->
      <section class="pt-24 px-4 md:px-10 lg:px-20">
         <div class="project-banner relative w-full aspect-[21/9] md:aspect-[21/7] rounded-[2.5rem] overflow-hidden bg-white border border-black/10 shadow-2xl">
              <div class="absolute inset-0 bg-cover bg-center" [style.backgroundImage]="'url(' + p.bannerImg + ')'"></div>
              <div class="absolute inset-0 bg-black/5"></div>
         </div>
      </section>

      <!-- 2. Interactive Category Bar -->
      <section class="mt-4 px-4 md:px-10 lg:px-20">
          <div class="flex flex-col md:flex-row gap-px bg-black/5 rounded-[1.5rem] overflow-hidden border border-black/5 backdrop-blur-md">
              @for (cat of p.categories; track cat.name) {
                  <div 
                    (mouseenter)="activeCat.set(cat.name)"
                    (mouseleave)="activeCat.set(null)"
                    [class.md:flex-1]="activeCat() !== cat.name"
                    [class.md:flex-[3]]="activeCat() === cat.name"
                    class="relative min-h-[80px] p-6 bg-white transition-all duration-700 ease-out cursor-default flex flex-col justify-center gap-4 overflow-hidden"
                  >
                      <!-- Header -->
                      <div class="flex items-center justify-between pointer-events-none">
                          <span class="font-body text-lg font-bold">{{ cat.name }}</span>
                          <svg class="w-4 h-4 text-neon-cyan/50 transition-transform group-hover:rotate-12" [style.transform]="activeCat() === cat.name ? 'rotate(45deg)' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                      </div>

                      <!-- Details (Fade in) -->
                      <div class="flex flex-wrap gap-2 transition-all duration-500 overflow-hidden" [style.height]="activeCat() === cat.name ? 'auto' : '0'" [style.opacity]="activeCat() === cat.name ? '1' : '0'">
                          @for (tag of cat.tags; track tag) {
                              <span class="px-4 py-1.5 bg-black/5 border border-black/10 rounded-full font-mono text-[9px] uppercase tracking-widest text-neon-cyan/60 whitespace-nowrap">
                                  {{ tag }}
                              </span>
                          }
                      </div>

                      <!-- Background Hover Effect -->
                      <div class="absolute inset-0 bg-neon-cyan/5 opacity-0 transition-opacity duration-500" [style.opacity]="activeCat() === cat.name ? '1' : '0'"></div>
                  </div>
              }
          </div>
      </section>

      <!-- 3. Title & Description -->
      <section class="py-20 md:py-32 px-4 md:px-10 lg:px-20 max-w-7xl">
          <p class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/50 mb-8">{{ p.client }}</p>
          <h1 class="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-body font-black tracking-tighter leading-[1.05] mb-16">
              {{ p.mainHeadingStart }} <span class="text-neon-cyan/30">{{ p.mainHeadingMute }}</span> {{ p.mainHeadingEnd }}
          </h1>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
              <p class="font-body text-lg md:text-xl lg:text-2xl text-neon-cyan/60 leading-relaxed font-medium">
                  {{ p.description }}
              </p>
              @if (p.website) {
                  <div class="flex items-end">
                      <a [href]="p.website" target="_blank" class="flex items-center gap-6 px-10 py-5 bg-black text-white rounded-full font-mono font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all shadow-xl" appMagnet [appMagnetStrength]="0.2">
                          View Website
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                      </a>
                  </div>
              }
          </div>
      </section>

      <!-- 4. Image Grid -->
      <section class="pb-20 px-4 md:px-10 lg:px-20">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              @for (img of p.gallery; track img; let i = $index) {
                  <div class="gallery-item rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-zinc-50 border border-black/10 shadow-xl cursor-zoom-in group"
                       [ngClass]="{'md:col-span-2': i % 5 === 0}"
                       (click)="openLightbox(i)">
                      <img [src]="img" (load)="onImageLoad()"
                           class="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
                           alt="Project detail">
                  </div>
              }
          </div>
      </section>

      <!-- Lightbox -->
      @if (lightboxOpen()) {
        <div class="fixed inset-0 z-[300] bg-black/95 backdrop-blur-sm flex items-center justify-center"
             (click)="closeLightbox()">

          <!-- Close -->
          <button class="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10"
                  (click)="closeLightbox(); $event.stopPropagation()">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <!-- Counter -->
          <div class="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-white/40 text-[10px] uppercase tracking-widest pointer-events-none">
            {{ lightboxIndex() + 1 }} / {{ p.gallery.length }}
          </div>

          <!-- Image -->
          <img [src]="p.gallery[lightboxIndex()]"
               class="max-w-[90vw] max-h-[88vh] object-contain select-none rounded-xl shadow-2xl"
               (click)="$event.stopPropagation()"
               alt="Project image">

          <!-- Arrows -->
          @if (p.gallery.length > 1) {
            <button class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all border border-white/10 hover:border-white/30"
                    (click)="prevImage($event, p.gallery.length)">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all border border-white/10 hover:border-white/30"
                    (click)="nextImage($event, p.gallery.length)">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          }
        </div>
      }

      <!-- 5. Video Section -->
      @if (p.video) {
        <section class="py-20 md:py-32 px-4 md:px-10 lg:px-20 border-t border-black/10">
             <div class="max-w-4xl mb-16">
                 <p class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/50 mb-8">Video Production</p>
                 <h2 class="text-3xl md:text-5xl font-body font-black tracking-tight leading-tight">
                    {{ p.videoHeading }}
                 </h2>
             </div>
             
             <div class="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-white group border border-black/10">
                 <div class="absolute inset-0 bg-cover bg-center" [style.backgroundImage]="'url(' + p.videoThumb + ')'"></div>
                 <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div class="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center scale-100 group-hover:scale-110 transition-transform cursor-pointer shadow-2xl">
                           <svg class="w-8 h-8 translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                 </div>
             </div>
        </section>
      }

      <!-- Next Project Transition Section -->
      <section #nextSection class="h-screen bg-zinc-100 overflow-hidden flex flex-col items-center justify-center relative">
          <div class="absolute inset-x-0 bottom-0 bg-black transition-all duration-1000 ease-out" [style.height.vh]="scrollProgress() * 100"></div>
          
          <div class="z-10 text-center mix-blend-difference">
              <p class="font-mono text-xs uppercase tracking-[0.5em] mb-10 opacity-40">Next Project</p>
              <h2 class="text-5xl md:text-7xl lg:text-9xl font-body font-black tracking-tighter uppercase mb-20 italic">
                  {{ nextProject()?.title || 'Back to Work' }}
              </h2>
              
              <!-- Circular Loader -->
              <div class="relative w-40 h-40 mx-auto">
                 <svg class="w-full h-full rotate-[-90deg]">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" stroke-width="2" class="opacity-10"></circle>
                    <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" stroke-width="4" [style.strokeDasharray]="440" [style.strokeDashoffset]="440 - (scrollProgress() * 440)"></circle>
                 </svg>
                 <div class="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-widest pl-2">SCROLL</div>
              </div>
          </div>
      </section>

    </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .project-banner {
        will-change: transform;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Project implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('nextSection') nextSection!: ElementRef;
  
  private destroy$ = new Subject<void>();
  activeCat = signal<string | null>(null);
  scrollProgress = signal(0);
  project = signal<ProjectData | null>(null);
  lightboxOpen = signal(false);
  lightboxIndex = signal(0);

  nextProject = computed(() => {
    const current = this.project();
    if (!current) return null;
    const all = this.projectService.projects();
    if (all.length === 0) return null;
    const index = all.findIndex(p => p.slug === current.slug || p._id === current._id);
    if (index === -1 || index === all.length - 1) return all[0]; // Loop back or first
    return all[index + 1];
  });

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private zone: NgZone, 
    private projectService: ProjectService,
    private transitionService: TransitionService
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
        const id = params.get('id');
        if (id) {
            this.loadProject(id);
        }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    ScrollTrigger.getAll().forEach(t => t.kill());
    document.body.style.overflow = '';
  }

  onImageLoad() {
    ScrollTrigger.refresh();
  }

  openLightbox(index: number) {
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
    document.body.style.overflow = '';
  }

  nextImage(event: Event, total: number) {
    event.stopPropagation();
    this.lightboxIndex.set((this.lightboxIndex() + 1) % total);
  }

  prevImage(event: Event, total: number) {
    event.stopPropagation();
    this.lightboxIndex.set((this.lightboxIndex() - 1 + total) % total);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.lightboxOpen()) return;
    const total = this.project()?.gallery?.length ?? 0;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight' && total > 1) this.lightboxIndex.set((this.lightboxIndex() + 1) % total);
    if (event.key === 'ArrowLeft' && total > 1) this.lightboxIndex.set((this.lightboxIndex() - 1 + total) % total);
  }

  private loadProject(id: string) {
    // Scroll to top when loading new project
    window.scrollTo(0, 0);

    // Try local signal first
    const localData = this.projectService.getProjectById(id);
    if (localData) {
        this.project.set(localData);
    } else {
        // Fetch from backend
        this.projectService.fetchProjectById(id).subscribe({
            next: (data) => this.project.set(data),
            error: () => this.router.navigate(['/work'])
        });
    }
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Next project scroll progress (Pinned Transition)
        ScrollTrigger.create({
            trigger: this.nextSection.nativeElement,
            start: 'top top',
            end: '+=1000', 
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                this.zone.run(() => {
                    this.scrollProgress.set(self.progress);
                    if (self.progress >= 0.98 && !this.transitionService.isTransitioning) {
                        const next = this.nextProject();
                        this.transitionService.navigateWithTransition({
                            url: next ? ['/work', next.slug || next._id] : ['/work'],
                            title: next?.title || 'Archive',
                            client: next?.client || 'SE.Agency'
                        });
                    }
                });
            }
        });

        // Robust refresh mechanism
        setTimeout(() => ScrollTrigger.refresh(), 1000);

        // Banner parallax
        gsap.to('.project-banner div', {
            scrollTrigger: {
                trigger: '.project-banner',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: 100,
            scale: 1.1
        });

        // Reveal animations
        gsap.utils.toArray('section:not(:last-child)').forEach((sec: any) => {
            gsap.from(sec, {
                scrollTrigger: {
                    trigger: sec,
                    start: 'top 95%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            });
        });
    });
  }
}
