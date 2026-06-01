import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LuminaOrb } from '../../components/lumina-orb/lumina-orb';
import { Magnet } from '../../directives/magnet';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LuminaOrb, Magnet],
  template: `
    <section class="min-h-screen bg-zinc-50 flex items-center justify-center relative overflow-hidden px-6">
      
      <!-- Background Ornament -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-40 scale-150">
        <app-lumina-orb></app-lumina-orb>
      </div>

      <!-- Login Card -->
      <div class="relative z-10 w-full max-w-md bg-white border border-black/5 rounded-[3rem] p-12 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all duration-700 animate-fade-in group">
        
        <div class="text-center mb-12">
            <h1 class="text-5xl md:text-6xl font-body font-black tracking-tighter text-zinc-900 mb-4 uppercase select-none">
                ADMIN <br/> <span class="text-black/10">ACCESS</span>
            </h1>
            <p class="font-mono text-[10px] uppercase tracking-[0.4em] text-black/30">Secure Portal // SE.AGENCY</p>
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="space-y-8">
            <div class="space-y-2">
                <label class="block font-mono text-[9px] uppercase tracking-widest text-black/40 ml-4">Identifier</label>
                <input 
                  type="text" 
                  name="identifier"
                  [(ngModel)]="identifier"
                  required
                  class="w-full bg-zinc-50 border border-black/5 rounded-full px-8 py-5 text-zinc-900 font-body focus:outline-none focus:border-black/20 transition-all placeholder:text-black/10"
                  placeholder="Email or Username"
                >
            </div>

            <div class="space-y-2 relative">
                <label class="block font-mono text-[9px] uppercase tracking-widest text-black/40 ml-4">Passcode</label>
                <input 
                  [type]="showPassword() ? 'text' : 'password'" 
                  name="password"
                  [(ngModel)]="password"
                  required
                  class="w-full bg-zinc-50 border border-black/5 rounded-full px-8 py-5 text-zinc-900 font-body focus:outline-none focus:border-black/20 transition-all placeholder:text-black/10"
                  placeholder="••••••••"
                >
                <button 
                  type="button" 
                  (click)="showPassword.set(!showPassword())"
                  class="absolute right-6 top-[3.2rem] text-black/20 hover:text-black transition-colors"
                >
                   <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.hidden]="showPassword()"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                   <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.hidden]="!showPassword()"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
            </div>

            @if (error()) {
                <div class="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-mono text-[10px] tracking-wider uppercase text-center animate-shake">
                    {{ error() }}
                </div>
            }

            <button 
              type="submit" 
              class="w-full py-6 bg-black text-white rounded-full font-mono font-black uppercase text-xs tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-2xl relative overflow-hidden" 
              appMagnet [appMagnetStrength]="0.1"
              [disabled]="loading()"
            >
                <span [class.opacity-0]="loading()">Authorize Session</span>
                <div *ngIf="loading()" class="absolute inset-0 flex items-center justify-center">
                    <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            </button>
        </form>

        <div class="mt-20 text-center">
             <a href="/" class="font-mono text-[8px] uppercase tracking-[0.5em] text-black/20 hover:text-black transition-colors uppercase">Return to Main Site</a>
        </div>
      </div>

    </section>
  `,
  styles: [`
    :host { display: block; }
    @keyframes fade-in { 
      from { opacity: 0; transform: translateY(30px) scale(0.98); } 
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLogin {
  private authService = inject(AuthService);
  private router = inject(Router);

  identifier = '';
  password = '';
  showPassword = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  onLogin() {
    if (!this.identifier || !this.password) return;
    
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.identifier, this.password).subscribe({
        next: () => {
            this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
            this.error.set(err?.error?.message || 'Authentication Failed');
            this.loading.set(false);
        }
    });
  }
}
