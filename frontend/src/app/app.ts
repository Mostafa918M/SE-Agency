import { Component, OnInit, AfterViewInit, ViewChild, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TranslateService } from '@ngx-translate/core';

import { Navbar } from './components/navbar/navbar';
import { Cursor } from './components/cursor/cursor';
import { Shutter } from './components/shutter/shutter';
import { Preloader } from './components/preloader/preloader';
import { Footer } from './components/footer/footer';
import { TransitionService } from './services/transition.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Cursor, Shutter, Preloader, Footer],
  template: `
    @if (showPreloader()) {
        <app-preloader (completed)="onPreloaderComplete()"></app-preloader>
    }
    <app-cursor></app-cursor>
    @if (!isAdminRoute()) {
      <app-navbar></app-navbar>
    }
    <app-shutter #shutter></app-shutter>
    <main>
      <router-outlet></router-outlet>
      @if (!isAdminRoute()) {
        <app-footer></app-footer>
      }
    </main>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  @ViewChild('shutter') shutter!: Shutter;
  protected readonly title = signal('Lumina Digital');
  showPreloader = signal(true);
  isAdminRoute = signal(false);
  private lenis?: Lenis;

  constructor(
    private router: Router, 
    private transitionService: TransitionService,
    private translate: TranslateService
  ) {
    // Initialize translations
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    
    // Check for saved language or use browser language
    const savedLang = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang();
    const useLang = (savedLang || (browserLang?.match(/en|ar/) ? browserLang : 'en')) as string;
    
    this.translate.use(useLang);
    
    // Set initial direction
    const dir = useLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = useLang;
  }

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    // Initial check
    this.isAdminRoute.set(this.router.url.includes('/admin'));

    // Coordinate leaving animations from projects
    this.transitionService.transition$.subscribe(async (data) => {
        try {
            // Set flag FIRST so NavigationStart handler skips the double-shutter
            this.transitionService.isTransitioning = true;
            
            // Pass project info if available
            await this.shutter?.playIn(data.title, data.client);
            
            // Navigate and wait for it to finish
            const success = await this.router.navigate(data.url);
            if (!success) {
                console.warn('Navigation rejected by router');
                this.transitionService.isTransitioning = false;
                this.shutter?.playOut();
            }
        } catch (error) {
            console.error('Navigation error:', error);
            this.transitionService.isTransitioning = false;
            this.shutter?.playOut();
        }
    });

    // Handle all router events for shutter control
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Skip if already handled by the transition service (manual clicks on projects)
        if (this.transitionService.isTransitioning) return;
        
        this.shutter?.playIn();
      } 
      
      else if (event instanceof NavigationEnd) {
        // Update admin route state
        this.isAdminRoute.set(this.router.url.includes('/admin'));
        
        // Reset transition flag
        this.transitionService.isTransitioning = false;
        
        // Finalize transition
        setTimeout(() => {
            if (this.lenis) {
                this.lenis.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo(0, 0);
            }
            this.shutter?.playOut();
            ScrollTrigger.refresh();
        }, 300);
      } 
      
      else if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.transitionService.isTransitioning = false;
        this.shutter?.playOut();
      }
    });
  }

  ngAfterViewInit(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  onPreloaderComplete() {
    this.showPreloader.set(false);
    // You could trigger something here if needed, but the preloader handles its own hide.
  }
}
