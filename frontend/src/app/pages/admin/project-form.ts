import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, ProjectData, ProjectCategory } from '../../services/project.service';
import { Router } from '@angular/router';
import { Magnet } from '../../directives/magnet';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Magnet],
  template: `
    <div class="min-h-screen bg-zinc-50 pb-40">
      
      <!-- Upload Progress Overlay -->
      <div *ngIf="isUploading()" class="fixed inset-0 z-[100] bg-white/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in p-10">
          <div class="w-full max-w-lg space-y-12">
              <div class="text-center">
                  <p class="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-cyan/60 mb-4 animate-pulse">Syncing Visual Data</p>
                  <h2 class="text-6xl md:text-8xl font-body font-black tracking-tighter uppercase leading-none">
                     {{ uploadProgress() }} <span class="text-neon-cyan/20">%</span>
                  </h2>
              </div>
              
              <!-- Core Progress Bar -->
              <div class="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div class="h-full bg-black transition-all duration-300 ease-out" [style.width.%]="uploadProgress()"></div>
              </div>

              <div class="flex justify-between font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50">
                  <span>Uploading to Core</span>
                  <span>Session Active</span>
              </div>
          </div>
      </div>

      <!-- Sticky Header -->
      <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-3xl border-b border-black/5 px-6 md:px-16 py-8 flex items-center justify-between">
          <div class="flex items-center gap-12">
              <button (click)="router.navigate(['/admin/dashboard'])" class="font-mono text-[9px] uppercase tracking-widest text-neon-cyan/60 hover:text-black transition-colors flex items-center gap-4 group">
                  <svg class="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  <span>Return to Command</span>
              </button>
              <h2 class="font-body font-black text-3xl md:text-5xl tracking-tighter uppercase leading-none mt-1">Project Build <span class="text-neon-cyan/20">0.1</span></h2>
          </div>

          <div class="flex items-center gap-6">
               <span class="font-mono text-[10px] uppercase tracking-widest text-neon-cyan/30 mr-4">State: Draft</span>
               <button 
                  (click)="submitProject()" 
                  class="bg-black text-white px-10 py-5 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] font-black hover:bg-zinc-800 transition-all shadow-2xl disabled:opacity-50"
                  [disabled]="loading"
                  appMagnet [appMagnetStrength]="0.1"
                >
                  Confirm & Instantiate
               </button>
          </div>
      </header>

      <main class="max-w-7xl mx-auto mt-24 px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          <!-- Left Column: Primary Config -->
          <div class="lg:col-span-7 space-y-24">
              
              <!-- Core Data -->
              <div class="space-y-12">
                  <h3 class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/60 font-black border-l-4 border-neon-cyan pl-6">Core Identifiers</h3>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-2">
                          <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Project Designation</label>
                          <input type="text" [(ngModel)]="project.title" placeholder="Project Name" class="w-full bg-white border border-black/5 rounded-[2rem] px-8 py-5 text-zinc-900 font-body text-xl focus:outline-none focus:border-neon-cyan focus:shadow-xl transition-all">
                      </div>
                      <div class="space-y-2">
                          <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Client Identity</label>
                          <input type="text" [(ngModel)]="project.client" placeholder="Client Name" class="w-full bg-white border border-black/5 rounded-[2rem] px-8 py-5 text-zinc-900 font-body text-xl focus:outline-none focus:border-neon-cyan focus:shadow-xl transition-all">
                      </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-2">
                          <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Primary Category</label>
                          <select [(ngModel)]="project.cat" class="w-full bg-white border border-black/5 rounded-[2rem] px-8 py-5 text-zinc-900 font-body focus:outline-none focus:border-neon-cyan focus:shadow-xl transition-all appearance-none">
                              <option *ngFor="let c of cats" [value]="c">{{ c }}</option>
                          </select>
                      </div>
                      <div class="space-y-2">
                          <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Public URL</label>
                          <input type="text" [(ngModel)]="project.website" placeholder="https://..." class="w-full bg-white border border-black/5 rounded-[2rem] px-8 py-5 text-zinc-900 font-body focus:outline-none focus:border-neon-cyan focus:shadow-xl transition-all">
                      </div>
                  </div>
              </div>

              <!-- Content Architecture -->
              <div class="space-y-12">
                   <h3 class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/60 font-black border-l-4 border-neon-cyan pl-6">Content Architecture</h3>
                   
                   <div class="space-y-4">
                        <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Dynamic Hero Title (Split into 3 for styling)</label>
                        <div class="grid grid-cols-3 gap-4">
                            <input type="text" [(ngModel)]="project.mainHeadingStart" placeholder="Start" class="bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 text-zinc-900 font-body focus:outline-none focus:border-neon-cyan transition-all">
                            <input type="text" [(ngModel)]="project.mainHeadingMute" placeholder="Muted Part" class="bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 text-neon-cyan/60 font-body focus:outline-none focus:border-neon-cyan transition-all">
                            <input type="text" [(ngModel)]="project.mainHeadingEnd" placeholder="End" class="bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 text-zinc-900 font-body focus:outline-none focus:border-neon-cyan transition-all">
                        </div>
                   </div>

                   <div class="space-y-2">
                        <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Brief Narrative</label>
                        <textarea [(ngModel)]="project.description" rows="6" placeholder="Project Description..." class="w-full bg-white border border-black/5 rounded-[2rem] p-8 text-zinc-900 font-body leading-relaxed focus:outline-none focus:border-neon-cyan focus:shadow-xl transition-all"></textarea>
                   </div>
              </div>

              <!-- Visual Assets -->
              <div class="space-y-12">
                   <h3 class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/60 font-black border-l-4 border-neon-cyan pl-6">Visual Pipeline</h3>
                   
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <!-- Primary Static Image -->
                       <div class="space-y-4">
                           <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Primary Static Image</label>
                           <div 
                              (click)="imgInput.click()" 
                              class="w-full aspect-video rounded-[1.5rem] bg-zinc-100 border-2 border-dashed border-black/5 hover:border-neon-cyan/30 transition-all cursor-pointer overflow-hidden flex items-center justify-center relative"
                           >
                               <img *ngIf="previews.img" [src]="previews.img" class="absolute inset-0 w-full h-full object-cover">
                               <div *ngIf="!previews.img" class="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-100">
                                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                                   <span class="font-mono text-[8px] uppercase tracking-widest">Select Image</span>
                               </div>
                               <input #imgInput type="file" (change)="onFileSelect($event, 'img')" class="hidden" accept="image/*">
                           </div>
                       </div>

                       <!-- Cinematic Banner -->
                       <div class="space-y-4">
                           <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Cinematic Banner</label>
                           <div 
                              (click)="bannerInput.click()" 
                              class="w-full aspect-video rounded-[1.5rem] bg-zinc-100 border-2 border-dashed border-black/5 hover:border-neon-cyan/30 transition-all cursor-pointer overflow-hidden flex items-center justify-center relative"
                           >
                               <img *ngIf="previews.banner" [src]="previews.banner" class="absolute inset-0 w-full h-full object-cover">
                               <div *ngIf="!previews.banner" class="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-100">
                                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                                   <span class="font-mono text-[8px] uppercase tracking-widest">Select Banner</span>
                               </div>
                               <input #bannerInput type="file" (change)="onFileSelect($event, 'banner')" class="hidden" accept="image/*">
                           </div>
                       </div>
                   </div>

                   <!-- Gallery Logic -->
                   <div class="space-y-4">
                        <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Exhibition Gallery (Multiple Selection Supported)</label>
                        <div 
                          (click)="galleryInput.click()"
                          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-8 bg-zinc-100 border-2 border-dashed border-black/5 rounded-[2rem] hover:border-neon-cyan/30 transition-all cursor-pointer"
                        >
                            <div *ngFor="let g of previews.gallery; let i = index" class="aspect-square rounded-xl overflow-hidden relative group">
                                <img [src]="g" class="w-full h-full object-cover">
                                <button (click)="$event.stopPropagation(); removeGalleryFile(i)" class="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <div class="aspect-square flex flex-col items-center justify-center border border-black/5 rounded-xl bg-white/50 opacity-40 hover:opacity-100 transition-opacity">
                                <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                            </div>
                            <input #galleryInput type="file" (change)="onGallerySelect($event)" multiple class="hidden" accept="image/*">
                        </div>
                   </div>
              </div>

          </div>

          <!-- Right Column: Secondary Tech Specs & States -->
          <div class="lg:col-span-5 space-y-12">
              
              <!-- States -->
              <div class="bg-black text-white rounded-[3rem] p-12 space-y-10 shadow-3xl relative overflow-hidden">
                   <div class="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 blur-3xl pointer-events-none"></div>
                   
                   <h4 class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/60">State Vectors</h4>
                   
                   <div class="space-y-6">
                        <label class="flex items-center gap-6 cursor-pointer group">
                             <div class="w-16 h-8 bg-zinc-800 rounded-full relative transition-colors" [class.bg-neon-cyan]="project.featured">
                                 <div class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform" [class.translate-x-8]="project.featured"></div>
                             </div>
                             <input type="checkbox" [(ngModel)]="project.featured" class="hidden">
                             <div class="flex-1">
                                 <p class="font-body font-bold text-xl">Featured Release</p>
                                 <p class="font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50">Highlight on priority grids</p>
                             </div>
                        </label>

                        <label class="flex items-center gap-6 cursor-pointer group">
                             <div class="w-16 h-8 bg-zinc-800 rounded-full relative transition-colors" [class.bg-neon-cyan]="hasVideo()">
                                 <div class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform" [class.translate-x-8]="hasVideo()"></div>
                             </div>
                             <input type="checkbox" (change)="hasVideo.set(!hasVideo())" [checked]="hasVideo()" class="hidden">
                             <div class="flex-1">
                                 <p class="font-body font-bold text-xl">Cinematic Component</p>
                                 <p class="font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50">Enable video exhibition section</p>
                             </div>
                        </label>
                   </div>
              </div>

              <!-- Metadata Categories -->
              <div class="bg-white border border-black/5 rounded-[3rem] p-12 space-y-10 shadow-2xl">
                   <div class="flex items-center justify-between">
                        <h4 class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/60">Metric Categories</h4>
                        <button (click)="addCategory()" class="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                   </div>

                   <div class="space-y-8">
                       <div *ngFor="let cat of project.categories; let i = index" class="space-y-4 pb-8 border-b border-black/5 last:border-0 relative group">
                            <button (click)="removeCategory(i)" class="absolute -right-4 -top-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                            
                            <input type="text" [(ngModel)]="cat.name" placeholder="Category Name (e.g. Design)" class="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 font-body font-bold focus:outline-none focus:border-neon-cyan transition-all">
                            <textarea (input)="updateTags(i, $event)" [value]="cat.tags.join(', ')" placeholder="Tags (comma separated)" class="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-black/60 focus:outline-none focus:border-neon-cyan transition-all"></textarea>
                       </div>
                   </div>
              </div>

              <!-- Video Pipeline (Conditional) -->
              <div *ngIf="hasVideo()" class="bg-white border border-black/5 rounded-[3rem] p-12 space-y-10 shadow-2xl animate-fade-in">
                   <h4 class="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/60">Cinematic Pipeline Data</h4>
                   
                   <div class="space-y-6">
                       <div class="space-y-2">
                           <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Video Narrative Heading</label>
                           <input type="text" [(ngModel)]="project.videoHeading" placeholder="Heading" class="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 font-body font-bold focus:outline-none focus:border-neon-cyan transition-all">
                       </div>
                       
                       <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <!-- Video Thumbnail -->
                           <div class="space-y-4">
                               <label class="block font-mono text-[9px] uppercase tracking-widest text-neon-cyan/50 ml-4">Video Thumbnail</label>
                               <div 
                                  (click)="vThumbInput.click()" 
                                  class="w-full aspect-video rounded-[1.5rem] bg-zinc-50 border border-black/5 hover:border-neon-cyan transition-all cursor-pointer overflow-hidden flex items-center justify-center relative"
                               >
                                   <img *ngIf="previews.videoThumb" [src]="previews.videoThumb" class="absolute inset-0 w-full h-full object-cover">
                                   <div *ngIf="!previews.videoThumb" class="flex flex-col items-center gap-2 opacity-30">
                                       <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                                       <span class="font-mono text-[8px] uppercase tracking-widest">Select Thumb</span>
                                   </div>
                                   <input #vThumbInput type="file" (change)="onFileSelect($event, 'videoThumb')" class="hidden" accept="image/*">
                               </div>
                           </div>

                           <!-- Primary Video File -->
                           <div class="space-y-4">
                               <label class="block font-mono text-[9px] uppercase tracking-widest text-black/30 ml-4">Cinematic Video File</label>
                               <div 
                                  (click)="videoInput.click()" 
                                  class="w-full aspect-video rounded-[1.5rem] bg-zinc-50 border border-black/5 hover:border-neon-cyan transition-all cursor-pointer overflow-hidden flex items-center justify-center relative"
                               >
                                   <video *ngIf="previews.video" [src]="previews.video" class="absolute inset-0 w-full h-full object-cover" muted></video>
                                   <div *ngIf="!previews.video" class="flex flex-col items-center gap-2 opacity-30">
                                       <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l5-5v14l-5-5H5V10h10z"/></svg>
                                       <span class="font-mono text-[8px] uppercase tracking-widest">Select Video</span>
                                   </div>
                                   <input #videoInput type="file" (change)="onFileSelect($event, 'video')" class="hidden" accept="video/*">
                               </div>
                           </div>
                       </div>
                   </div>
              </div>

          </div>

      </main>

    </div>
  `,
  styles: [`
    :host { display: block; }
    @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectForm {
  projectService = inject(ProjectService);
  router = inject(Router);

  loading = false;
  uploadProgress = signal(0);
  isUploading = signal(false);
  hasVideo = signal(false);
  cats = ['Brand', 'Development', 'Marketing', 'Content'];

  project: ProjectData = {
    title: '',
    client: '',
    bannerImg: '',
    img: '',
    cat: 'Brand',
    mainHeadingStart: '',
    mainHeadingMute: '',
    mainHeadingEnd: '',
    description: '',
    categories: [{ name: 'Services', tags: [] }],
    gallery: [],
    featured: false,
    video: ''
  };

  files: { 
    img: File | null; 
    banner: File | null; 
    videoThumb: File | null;
    video: File | null;
  } = {
    img: null,
    banner: null,
    videoThumb: null,
    video: null
  };
  galleryFiles: File[] = [];

  previews: {
    img: any;
    banner: any;
    videoThumb: any;
    video: any;
    gallery: any[];
  } = {
    img: null,
    banner: null,
    videoThumb: null,
    video: null,
    gallery: []
  };

  onFileSelect(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      if (type === 'img') this.files.img = file;
      if (type === 'banner') this.files.banner = file;
      if (type === 'videoThumb') this.files.videoThumb = file;
      if (type === 'video') this.files.video = file;
      this.generatePreview(file, type);
    }
  }

  onGallerySelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.galleryFiles = [...this.galleryFiles, ...files];
    files.forEach(f => this.generateGalleryPreview(f));
  }

  generatePreview(file: File, type: string) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
        if (type === 'img') this.previews.img = e.target.result;
        if (type === 'banner') this.previews.banner = e.target.result;
        if (type === 'videoThumb') this.previews.videoThumb = e.target.result;
        if (type === 'video') this.previews.video = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  generateGalleryPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => this.previews.gallery.push(e.target.result);
    reader.readAsDataURL(file);
  }

  removeGalleryFile(index: number) {
    this.galleryFiles.splice(index, 1);
    this.previews.gallery.splice(index, 1);
  }

  addCategory() {
    this.project.categories.push({ name: '', tags: [] });
  }

  removeCategory(index: number) {
    this.project.categories.splice(index, 1);
  }

  updateTags(index: number, event: any) {
    const val = event.target.value;
    this.project.categories[index].tags = val.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
  }

  submitProject() {
    if (!this.project.title || !this.project.client) {
        alert('Designation and Client Identity are Mandatory.');
        return;
    }

    this.loading = true;
    this.isUploading.set(true);
    this.uploadProgress.set(0);

    // Construct FormData
    const formData = new FormData();
    
    // Append each top-level project property individually to match backend validation
    formData.append('title', this.project.title);
    formData.append('client', this.project.client);
    formData.append('cat', this.project.cat);
    formData.append('mainHeadingStart', this.project.mainHeadingStart);
    formData.append('mainHeadingMute', this.project.mainHeadingMute);
    formData.append('mainHeadingEnd', this.project.mainHeadingEnd);
    formData.append('description', this.project.description);
    if (this.project.website) formData.append('website', this.project.website);
    
    // Stringify array/object fields so they can be parsed by backend if needed
    formData.append('categories', JSON.stringify(this.project.categories));
    formData.append('featured', String(this.project.featured));
    
    // Append single image files
    if (this.files.img) formData.append('img', this.files.img);
    if (this.files.banner) formData.append('bannerImg', this.files.banner);

    if (this.hasVideo()) {
        formData.append('videoHeading', this.project.videoHeading || '');
        if (this.files.videoThumb) formData.append('videoThumb', this.files.videoThumb);
        if (this.files.video) formData.append('video', this.files.video);
    }

    // Append gallery files
    this.galleryFiles.forEach((f) => {
        formData.append('gallery', f);
    });

    this.projectService.addProject(formData).subscribe({
        next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
                const progress = Math.round(100 * event.loaded / (event.total || 1));
                this.uploadProgress.set(progress);
            } else if (event.type === HttpEventType.Response) {
                this.uploadProgress.set(100);
                setTimeout(() => {
                    this.router.navigate(['/admin/dashboard']);
                }, 1000);
            }
        },
        error: (err: any) => {
            alert(err?.error?.message || 'Failed to instantiate project.');
            this.loading = false;
            this.isUploading.set(false);
        }
    });
  }
}
