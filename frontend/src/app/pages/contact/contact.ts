import { Component, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { TranslateModule } from '@ngx-translate/core';
import { Magnet } from '../../directives/magnet';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, Magnet],
  template: `
    <section class="min-h-screen pt-32 pb-20 px-6 md:px-10 lg:px-20 bg-cosmic-bg relative overflow-hidden text-cosmic-text rtl:text-right">
      
      <!-- Background Orb -->
      <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        
        <!-- Left Column: Info -->
        <div class="flex flex-col justify-center">
          <div class="mb-12">
            <p class="reveal-info font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan mb-6">{{ 'CONTACT.GET_IN_TOUCH' | translate }}</p>
            <h1 class="reveal-text font-cosmic text-5xl md:text-7xl lg:text-8xl mb-8 leading-[0.9] tracking-tighter uppercase italic rtl:text-6xl">
                {{ 'CONTACT.SAY' | translate }} <br>
                <span class="text-neon-cyan">{{ 'CONTACT.HELLO' | translate }}</span>
            </h1>
            <p class="reveal-info font-body text-lg md:text-xl text-neon-cyan/60 max-w-md leading-relaxed mb-10">
                {{ 'CONTACT.DESC' | translate }}
            </p>
          </div>

          <div class="flex flex-col gap-8">
            <div class="reveal-info group">
                <p class="font-mono text-[9px] uppercase tracking-widest text-neon-cyan/30 mb-2">{{ 'CONTACT.EMAIL_LABEL' | translate }}</p>
                <a href="mailto:info@se.agency" class="font-body text-2xl md:text-3xl font-bold border-b border-transparent hover:border-neon-cyan transition-all duration-500 pb-1">
                    hello&#64;se.agency
                </a>
            </div>

            <div class="reveal-info">
                <p class="font-mono text-[9px] uppercase tracking-widest text-neon-cyan/30 mb-2">{{ 'CONTACT.SOCIAL_LABEL' | translate }}</p>
                <div class="flex gap-6 mt-2">
                    <a href="#" class="hover:text-neon-cyan transition-colors">Instagram</a>
                    <a href="#" class="hover:text-neon-cyan transition-colors">LinkedIn</a>
                    <a href="#" class="hover:text-neon-cyan transition-colors">Behance</a>
                </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Form -->
        <div class="reveal-form bg-zinc-950/5 border border-cosmic-text/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-8">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Name -->
                <div class="input-group">
                    <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/40 mb-3">{{ 'CONTACT.NAME' | translate }}</label>
                    <input 
                        type="text" 
                        formControlName="name"
                        placeholder="{{ 'CONTACT.NAME_PLACEHOLDER' | translate }}"
                        class="w-full bg-cosmic-text/[0.03] border border-cosmic-text/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-cyan/50 focus:bg-white/5 transition-all text-sm font-medium"
                    >
                </div>

                <!-- Email -->
                <div class="input-group">
                    <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/40 mb-3">{{ 'CONTACT.EMAIL' | translate }}</label>
                    <input 
                        type="email" 
                        formControlName="email"
                        placeholder="hello&#64;example.com"
                        class="w-full bg-cosmic-text/[0.03] border border-cosmic-text/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-cyan/50 focus:bg-white/5 transition-all text-sm font-medium"
                    >
                </div>
            </div>

            <!-- Subject/Service -->
            <div class="input-group">
                <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/40 mb-3">{{ 'CONTACT.SERVICE' | translate }}</label>
                <select 
                    formControlName="service"
                    class="w-full bg-cosmic-text/[0.03] border border-cosmic-text/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-cyan/50 focus:bg-white/5 transition-all text-sm font-medium appearance-none cursor-pointer"
                >
                    <option value="" disabled selected>{{ 'CONTACT.CHOOSE_SERVICE' | translate }}</option>
                    <option value="branding">Branding & Identity</option>
                    <option value="web">Web Development</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <!-- Message -->
            <div class="input-group">
                <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/40 mb-3">{{ 'CONTACT.MESSAGE' | translate }}</label>
                <textarea 
                    formControlName="message"
                    rows="4"
                    placeholder="{{ 'CONTACT.MESSAGE_PLACEHOLDER' | translate }}"
                    class="w-full bg-cosmic-text/[0.03] border border-cosmic-text/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-cyan/50 focus:bg-white/5 transition-all text-sm font-medium resize-none"
                ></textarea>
            </div>

            <!-- Submit Button -->
            <div class="mt-4">
                <button 
                    type="submit" 
                    [disabled]="contactForm.invalid || isSubmitting()"
                    class="group relative inline-flex items-center gap-4 px-10 py-5 bg-neon-cyan text-white rounded-full font-mono text-xs uppercase tracking-[0.2em] font-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(224,16,40,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    appMagnet [appMagnetStrength]="0.2"
                >
                    @if (isSubmitting()) {
                        <span class="animate-pulse">{{ 'CONTACT.SENDING' | translate }}</span>
                    } @else if (isSuccess()) {
                        <span>{{ 'CONTACT.SENT' | translate }}</span>
                    } @else {
                        <span>{{ 'CONTACT.SUBMIT' | translate }}</span>
                        <div class="w-6 h-6 flex items-center justify-center bg-black/10 rounded-full group-hover:translate-x-1 transition-transform rtl:rotate-180">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                        </div>
                    }
                </button>
            </div>
          </form>

          <!-- Success Message -->
          @if (isSuccess()) {
              <div class="absolute inset-0 bg-cosmic-bg/90 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 z-20">
                  <div class="w-20 h-20 bg-neon-cyan text-white rounded-full flex items-center justify-center mb-8 animate-bounce">
                      <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M20 6L9 17l-5-5"></path></svg>
                  </div>
                  <h3 class="text-4xl font-cosmic uppercase italic mb-4">{{ 'CONTACT.THANKS_TITLE' | translate }}</h3>
                  <p class="font-body text-neon-cyan/60 max-w-xs">{{ 'CONTACT.THANKS_DESC' | translate }}</p>
                  <button (click)="resetForm()" class="mt-8 font-mono text-[10px] uppercase tracking-widest text-neon-cyan border-b border-neon-cyan">{{ 'CONTACT.SEND_ANOTHER' | translate }}</button>
              </div>
          }
        </div>
      </div>
      
      <!-- Decorative background text -->
      <div class="absolute bottom-[-10vw] left-0 w-full overflow-hidden opacity-[0.02] pointer-events-none select-none z-0">
          <h2 class="text-[30vw] font-cosmic whitespace-nowrap -translate-x-20 rtl:translate-x-20">{{ 'CONTACT.DECOR' | translate }}</h2>
      </div>
    </section>
  `,
  styles: [`
    @reference "../../../styles.css";
    :host { display: block; }
    input::placeholder, textarea::placeholder {
        @apply text-neon-cyan/20;
    }
    select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230a0a0f' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1.5rem center;
        background-size: 1rem;
    }
    html[lang="ar"] select {
        background-position: left 1.5rem center;
    }
  `]
})
export class Contact implements AfterViewInit {
  private fb = inject(FormBuilder);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    service: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = signal(false);
  isSuccess = signal(false);

  ngAfterViewInit() {
    this.setupAnimations();
  }

  setupAnimations() {
    gsap.from('.reveal-text', {
      opacity: 0,
      x: -50,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.5
    });

    gsap.from('.reveal-info', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.8
    });

    gsap.from('.reveal-form', {
      opacity: 0,
      x: 50,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.7
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
        this.contactForm.reset();
      }, 2000);
    }
  }

  resetForm() {
    this.isSuccess.set(false);
    this.contactForm.reset();
  }
}
