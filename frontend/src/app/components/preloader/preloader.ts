import { Component, AfterViewInit, ElementRef, ViewChild, Output, EventEmitter, signal, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-preloader',
  standalone: true,
  template: `
    <div #preloader class="fixed inset-0 z-[20000] bg-[#050505] flex items-center justify-center overflow-hidden">
      <!-- Background Texture/Noise -->
      <div class="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      
      <!-- Scanning Line -->
      <div #scanner class="absolute top-0 left-0 w-full h-[1px] bg-white/40 z-10 opacity-0 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
      
      <!-- Telemetry Data -->
      <div #telemetry class="absolute inset-0 p-10 flex flex-col justify-between pointer-events-none opacity-0">
        <div class="flex justify-between items-start">
          <div class="font-mono text-[9px] text-white/30 uppercase tracking-[0.3em] leading-relaxed">
            <div>[ SYSTEM_LINK ] .......... ACTIVE</div>
            <div>[ NOIR_SIGNAL ] .......... SYNCED</div>
            <div>[ ENCRYPTION ] .......... RSA_4096</div>
          </div>
          <div class="font-mono text-[9px] text-white/30 uppercase tracking-[0.3em] text-right">
            <div>DATA_STREAM // {{ bits().join('') }}</div>
            <div>COORDINATES // {{ currentCoords() }}</div>
            <div>UPTIME // {{ uptime() }}s</div>
          </div>
        </div>
        
        <!-- Bottom Interface -->
        <div class="flex justify-between items-end">
          <div class="flex flex-col gap-2">
             <div class="flex items-baseline gap-4">
                <div class="w-32 h-[1px] bg-white/10 relative overflow-hidden">
                    <div #progressBar class="absolute top-0 left-0 h-full bg-white/40 w-0"></div>
                </div>
             </div>
             <div class="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em]">Initialize_Sequence_Primary</div>
          </div>
          <div class="font-mono text-[10px] text-white/40 uppercase tracking-[0.6em] flex items-center gap-4">
            <span class="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
            SE.AGENCY_RESERVED
          </div>
        </div>
      </div>

      <!-- Main Portal -->
      <div class="relative flex flex-col items-center justify-center">
        <!-- Lens Flare / Glow -->
        <div #bloom class="absolute w-64 h-64 bg-neon-cyan opacity-0 blur-[100px] rounded-full"></div>
        
        <!-- Geometric Elements -->
        <div #coreShell class="absolute w-48 h-48 border border-white/5 rounded-full scale-0 rotate-45"></div>
        <div #coreShellInner class="absolute w-32 h-32 border border-white/10 rounded-full scale-0 -rotate-45"></div>
        
        <!-- Center Content -->
        <div #emblemContainer class="relative flex flex-col items-center">
            <!-- Central Progress Number -->
            <div #centerProgress class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="font-mono text-[40px] md:text-[80px] text-white font-black tabular-nums tracking-tighter">
                    {{ Math.floor(progress()) }}
                </div>
            </div>

            <div class="overflow-hidden">
                <img #logoText src="/S.E_WHITE_LOGO.png" alt="S.E Logo" class="h-12 md:h-16 w-auto object-contain opacity-0 translate-y-full">
            </div>
            
            <div #logoSubtext class="font-mono text-[10px] text-white/40 tracking-[1.2em] uppercase mt-6 opacity-0 flex items-center gap-4">
                <div class="w-8 h-[1px] bg-white/20"></div>
                LOADING_PHASE_01
                <div class="w-8 h-[1px] bg-white/20"></div>
            </div>
            
            <!-- Pulse Dot -->
            <div #dot class="absolute -bottom-12 w-1.5 h-1.5 bg-neon-cyan rounded-full opacity-0 shadow-[0_0_20px_#e01028]"></div>
        </div>
      </div>

      <!-- Glitch Overlays -->
      <div #glitch class="absolute inset-0 bg-white opacity-0 mix-blend-difference pointer-events-none"></div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .font-cosmic { font-family: 'Syncopate', sans-serif; }
    .text-neon-cyan { color: #e01028; }
    .bg-neon-cyan { background-color: #e01028; }
  `]
})
export class Preloader implements AfterViewInit, OnDestroy {
  @ViewChild('preloader') preloader!: ElementRef;
  @ViewChild('scanner') scanner!: ElementRef;
  @ViewChild('telemetry') telemetry!: ElementRef;
  @ViewChild('dot') dot!: ElementRef;
  @ViewChild('logoText') logoText!: ElementRef;
  @ViewChild('logoSubtext') logoSubtext!: ElementRef;
  @ViewChild('coreShell') coreShell!: ElementRef;
  @ViewChild('coreShellInner') coreShellInner!: ElementRef;
  @ViewChild('glitch') glitch!: ElementRef;
  @ViewChild('bloom') bloom!: ElementRef;
  @ViewChild('progressBar') progressBar!: ElementRef;
  @ViewChild('centerProgress') centerProgress!: ElementRef;

  @Output() completed = new EventEmitter<void>();

  protected readonly Math = Math;
  currentCoords = signal('0.0000, 0.0000');
  bits = signal(['0','1','0','1','1','0']);
  uptime = signal('0.00');
  progress = signal(0);
  private interval: any;
  private startTime = Date.now();

  ngAfterViewInit() {
    this.updateTelemetry();
    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  private updateTelemetry() {
    this.interval = setInterval(() => {
        const lat = (Math.random() * 180 - 90).toFixed(4);
        const lng = (Math.random() * 360 - 180).toFixed(4);
        this.currentCoords.set(`${lat}, ${lng}`);
        
        const newBits = Array.from({ length: 6 }, () => Math.round(Math.random()).toString());
        this.bits.set(newBits);
        
        this.uptime.set(((Date.now() - this.startTime) / 1000).toFixed(2));
    }, 100);
  }

  private startAnimation() {
    const tl = gsap.timeline({
      onComplete: () => {
        this.completed.emit();
      }
    });

    // Initial setup
    gsap.set([this.scanner.nativeElement, this.telemetry.nativeElement], { opacity: 0 });
    gsap.set(this.centerProgress.nativeElement, { opacity: 0, scale: 0.8 });
    
    // SEQUENCE 1: BOOTING
    tl.to(this.scanner.nativeElement, {
        opacity: 1,
        duration: 0.1
    })
    .to(this.scanner.nativeElement, {
        top: '100%',
        duration: 1.2,
        ease: 'power2.inOut'
    })
    .to(this.telemetry.nativeElement, {
        opacity: 1,
        duration: 0.5
    }, "-=0.8")

    // SEQUENCE 2: CENTER PROGRESS COUNTDOWN
    .to(this.centerProgress.nativeElement, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(2)'
    }, "-=0.4")
    
    // Sync progress and bar
    const progressObj = { val: 0 };
    tl.to(this.progressBar.nativeElement, {
        width: '100%',
        duration: 2.5,
        ease: 'power2.inOut'
    }, "-=0.2")
    .to(progressObj, {
        val: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
            this.progress.set(progressObj.val);
        }
    }, "<")

    // SEQUENCE 3: GEOMETRY REVEAL (During count)
    .to(this.coreShell.nativeElement, {
        scale: 1,
        opacity: 0.2,
        duration: 1.5,
        ease: 'expo.out'
    }, "-=2.5")
    .to(this.coreShellInner.nativeElement, {
        scale: 1,
        opacity: 0.3,
        duration: 1.5,
        ease: 'expo.out'
    }, "-=2.2")

    // SEQUENCE 4: TRANSITION FROM NUMBER TO LOGO
    .to(this.centerProgress.nativeElement, {
        opacity: 0,
        scale: 1.2,
        filter: 'blur(10px)',
        duration: 0.4,
        ease: 'power3.in'
    }, "+=0.2")
    
    .to(this.dot.nativeElement, {
        opacity: 1,
        scale: 1.5,
        duration: 0.3,
        ease: 'back.out(2)'
    })
    .to(this.logoText.nativeElement, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out',
    }, "-=0.1")
    .to(this.logoSubtext.nativeElement, {
        opacity: 1,
        duration: 0.8
    }, "-=0.8")
    
    // SEQUENCE 5: CHARGE UP & BURST
    .to(this.bloom.nativeElement, {
        opacity: 0.4,
        scale: 2,
        duration: 1,
        ease: 'power2.in'
    }, "-=1")
    .to([this.coreShell.nativeElement, this.coreShellInner.nativeElement], {
        rotation: (i) => i === 0 ? 360 : -360,
        scale: 2,
        opacity: 0.6,
        duration: 1.5,
        ease: 'power2.in'
    }, "-=1.5")

    .to(this.glitch.nativeElement, {
        opacity: 1,
        duration: 0.05,
        repeat: 3,
        yoyo: true,
        ease: 'none'
    })
    .to(this.preloader.nativeElement, {
        backgroundColor: '#ffffff',
        duration: 0.1
    })
    .to(this.preloader.nativeElement, {
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        onComplete: () => {
             gsap.set(this.preloader.nativeElement, { display: 'none' });
        }
    })
    .to('body', {
        backgroundColor: '#f0f6f8',
        duration: 0.5
    }, "-=1");
  }
}
