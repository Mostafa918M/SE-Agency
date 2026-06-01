import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, ProjectData } from '../../services/project.service';
import { ClientService, ClientData } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Magnet } from '../../directives/magnet';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, Magnet, FormsModule],
  template: `
    <div class="min-h-screen bg-zinc-50 flex">
      
      <!-- Sidebar -->
      <aside class="w-64 md:w-80 bg-black text-white p-12 flex flex-col justify-between sticky top-0 h-screen hidden md:flex overflow-hidden">
        
        <div class="space-y-20 relative z-10">
            <h1 class="text-4xl font-body font-black tracking-tighter uppercase leading-[0.8]">
              NOIR <br/> SIGNAL <br/> <span class="text-zinc-600">ADMIN</span>
            </h1>

            <nav class="space-y-4">
               <button (click)="activeTab.set('projects')" 
                       class="w-full text-left block font-mono text-[10px] uppercase tracking-[0.3em] font-black py-3 border-b border-white/5 transition-all flex items-center gap-3"
                       [class.text-neon-cyan]="activeTab() === 'projects'"
                       [class.text-neon-cyan/50]="activeTab() !== 'projects'">
                  <span *ngIf="activeTab() === 'projects'" class="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                  Projects
               </button>
               <button (click)="activeTab.set('clients')" 
                       class="w-full text-left block font-mono text-[10px] uppercase tracking-[0.3em] font-black py-3 border-b border-white/5 transition-all flex items-center gap-3"
                       [class.text-neon-cyan]="activeTab() === 'clients'"
                       [class.text-neon-cyan/50]="activeTab() !== 'clients'">
                  <span *ngIf="activeTab() === 'clients'" class="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                  Clients
               </button>
               <a class="block font-mono text-[10px] uppercase tracking-[0.3em] font-black text-neon-cyan/50 py-3 border-b border-white/5 hover:text-white transition-colors">Users</a>
               <a class="block font-mono text-[10px] uppercase tracking-[0.3em] font-black text-neon-cyan/50 py-3 border-b border-white/5 hover:text-white transition-colors">Settings</a>
            </nav>
        </div>

        <div class="relative z-10">
            <div class="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 group overflow-hidden relative">
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-neon-cyan/5 blur-3xl pointer-events-none group-hover:bg-neon-cyan/10 transition-colors"></div>
                <p class="font-mono text-[8px] uppercase tracking-widest text-neon-cyan/40 mb-1">Session Identity</p>
                <h3 class="font-body font-bold text-lg text-white mb-4">{{ authService.currentUser()?.username }}</h3>
                <button (click)="onLogout()" class="font-mono text-[9px] uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Terminate Session</button>
            </div>
            
            <p class="font-mono text-[8px] uppercase tracking-[0.5em] text-neon-cyan/20">V 1.0.42_CORE</p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-16 lg:p-24 overflow-y-auto">
        
        <!-- Tab: Projects -->
        <ng-container *ngIf="activeTab() === 'projects'">
            <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-24">
                <div>
                    <p class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/40 mb-4">Management Dashboard</p>
                    <h2 class="text-4xl md:text-7xl lg:text-8xl font-body font-black tracking-tighter text-zinc-900 leading-[0.8]">PROJECT <br/> <span class="text-neon-cyan/10">CATALOGUE</span></h2>
                </div>
                
                <button (click)="router.navigate(['/admin/projects/new'])" class="bg-black text-white px-10 py-6 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] font-black hover:bg-zinc-800 transition-all shadow-2xl flex items-center gap-4 group" appMagnet [appMagnetStrength]="0.1">
                    <span>Instantiate Project</span>
                    <span class="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"></path></svg>
                    </span>
                </button>
            </header>

            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-8 px-10 py-4 font-mono text-[10px] uppercase tracking-widest text-neon-cyan/40 hidden md:grid">
                    <div class="col-span-1">Ref</div>
                    <div class="col-span-5">Project Designation</div>
                    <div class="col-span-3">Category</div>
                    <div class="col-span-1">State</div>
                    <div class="col-span-2 text-right">Actions</div>
                </div>

                <div *ngFor="let p of projects(); let i = index" class="grid grid-cols-1 md:grid-cols-12 items-center gap-8 bg-white border border-black/5 rounded-[2rem] p-10 hover:shadow-2xl hover:border-black/10 transition-all duration-500 group animate-slide-up" [style.animationDelay]="(i * 100) + 'ms'">
                    <div class="col-span-1 font-mono text-xs text-neon-cyan/20">#{{ i + 1 }}</div>
                    
                    <div class="col-span-5 flex items-center gap-6">
                        <div class="w-16 h-16 rounded-2xl bg-zinc-100 bg-cover bg-center border border-black/5" [style.backgroundImage]="'url(' + p.img + ')'"></div>
                        <div>
                            <h4 class="font-body font-black text-2xl tracking-tight text-zinc-900 leading-none mb-1 group-hover:text-neon-cyan transition-colors">{{ p.title }}</h4>
                            <p class="font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50">{{ p.client }}</p>
                        </div>
                    </div>

                    <div class="col-span-3">
                        <span class="px-5 py-2 bg-zinc-100 rounded-full font-mono text-[9px] uppercase tracking-widest text-black/60">{{ p.cat }}</span>
                    </div>

                    <div class="col-span-1">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full" [class.bg-green-400]="p.featured" [class.bg-zinc-300]="!p.featured"></span>
                            <span class="font-mono text-[9px] uppercase tracking-widest text-black/40">{{ p.featured ? 'Featured' : 'Standard' }}</span>
                        </div>
                    </div>

                    <div class="col-span-2 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button (click)="router.navigate(['/admin/projects/edit', p.id])" class="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button (click)="deleteProject(p.id)" class="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </ng-container>

        <!-- Tab: Clients -->
        <ng-container *ngIf="activeTab() === 'clients'">
            <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-24">
                <div>
                    <p class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/40 mb-4">Relationship Management</p>
                    <h2 class="text-4xl md:text-7xl lg:text-8xl font-body font-black tracking-tighter text-zinc-900 leading-[0.8]">CLIENT <br/> <span class="text-neon-cyan/10">PARTNERS</span></h2>
                </div>

                <div class="flex flex-col gap-4">
                    <div class="flex flex-col md:flex-row gap-4 items-end">
                        <div class="flex-1 space-y-2">
                             <label class="font-mono text-[8px] uppercase tracking-widest text-neon-cyan/50 px-4">Partner Designation</label>
                             <input [(ngModel)]="newClientName" 
                                    placeholder="e.g. SPACE X" 
                                    class="w-full bg-white border border-black/5 rounded-full px-8 py-4 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-neon-cyan transition-colors shadow-sm">
                        </div>
                        
                        <div class="space-y-2">
                             <label class="font-mono text-[8px] uppercase tracking-widest text-neon-cyan/50 px-4">Logo Attribute</label>
                             <div class="relative">
                                <input type="file" #logoInput (change)="onLogoSelected($event)" class="hidden" accept="image/*">
                                <button (click)="logoInput.click()" 
                                        class="bg-zinc-100 hover:bg-zinc-200 text-black/60 px-8 py-4 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] font-black transition-all border border-black/5 flex items-center gap-3">
                                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path></svg>
                                    {{ selectedLogo ? selectedLogo.name.substring(0, 10) + '...' : 'Upload' }}
                                </button>
                             </div>
                        </div>

                        <button (click)="addClient()"
                                [disabled]="!newClientName"
                                class="bg-black text-white px-10 py-4 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] font-black hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl h-[52px]">
                            Commit Partner
                        </button>
                    </div>
                </div>
            </header>

            <!-- Clients List -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div *ngFor="let c of clients(); let i = index" 
                     class="bg-white border border-black/5 rounded-[2.5rem] p-10 hover:shadow-2xl hover:border-black/10 transition-all duration-500 group animate-slide-up"
                     [style.animationDelay]="(i * 50) + 'ms'">
                    
                    <div class="flex flex-col justify-between h-full gap-10">
                        <div class="flex justify-between items-start">
                            <span class="font-mono text-[9px] uppercase tracking-[0.4em] text-neon-cyan/20">Ref #{{ i + 1 }}</span>
                            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button (click)="editClient(c)" class="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button (click)="deleteClient(c._id)" class="w-10 h-10 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path></svg>
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center gap-6">
                            <div *ngIf="c.logo" class="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center p-3 border border-black/5">
                                <img [src]="getImageUrl(c.logo)" [alt]="c.name" class="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                            </div>

                            <div *ngIf="!c.logo" class="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center border border-dashed border-black/10">
                                <svg class="w-5 h-5 text-neon-cyan/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7m4 0h6m-3-3v6M3 16l5-5c.9-.9 2.1-.9 3 0l5 5"></path><circle cx="9" cy="9" r="2"></circle></svg>
                            </div>
                            <div>
                                <h4 class="font-body font-black text-2xl tracking-tight text-zinc-900 group-hover:text-neon-cyan transition-colors uppercase select-all">{{ c.name }}</h4>
                                <div class="w-12 h-[2px] bg-black/5 mt-2 group-hover:w-full group-hover:bg-neon-cyan transition-all duration-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </ng-container>

      </main>

    </div>
  `,
  styles: [`
    :host { display: block; }
    @keyframes slide-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboard implements OnInit {
  projectService = inject(ProjectService);
  clientService = inject(ClientService);
  authService = inject(AuthService);
  router = inject(Router);

  activeTab = signal<'projects' | 'clients'>('projects');
  projects = this.projectService.projects;
  clients = this.clientService.clients;

  newClientName = '';
  selectedLogo: File | null = null;

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


  ngOnInit() {
    this.projectService.refreshProjects();
    this.clientService.refreshClients();
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedLogo = file;
    }
  }

  onLogout() {
    this.authService.logout().subscribe({
        next: () => {
            this.router.navigate(['/admin/login']);
        },
        error: (err: any) => {
            console.error('Logout failed', err);
            this.router.navigate(['/admin/login']);
        }
    });
  }

  deleteProject(id: string | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this project? This action is irreversible.')) {
        this.projectService.deleteProject(id).subscribe({
            next: () => {
                alert('Project deleted successfully.');
                this.projectService.refreshProjects();
            },
            error: (err: any) => {
                alert(err?.error?.message || 'Failed to delete project.');
            }
        });
    }
  }

  addClient() {
    if (!this.newClientName) return;
    
    const formData = new FormData();
    formData.append('name', this.newClientName);
    if (this.selectedLogo) {
      formData.append('logo', this.selectedLogo);
    }

    this.clientService.addClient(formData).subscribe({
        next: () => {
            this.newClientName = '';
            this.selectedLogo = null;
            alert('Client added successfully.');
        },
        error: (err: any) => {
            alert(err?.error?.message || 'Failed to add client.');
        }
    });
  }

  editClient(client: ClientData) {
    const newName = prompt('Enter new client name:', client.name);
    if (newName && newName !== client.name && client._id) {
        this.clientService.updateClient(client._id, { name: newName }).subscribe({
            next: () => {
                alert('Client updated successfully.');
            },
            error: (err: any) => {
                alert(err?.error?.message || 'Failed to update client.');
            }
        });
    }
  }

  deleteClient(id: string | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this client?')) {
        this.clientService.deleteClient(id).subscribe({
            next: () => {
                alert('Client deleted successfully.');
            },
            error: (err: any) => {
                alert(err?.error?.message || 'Failed to delete client.');
            }
        });
    }
  }
}

