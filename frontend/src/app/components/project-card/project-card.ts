import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-card',
  standalone: true,
  template: `
    <div class="project-card flex-shrink-0 w-[80vw] md:w-[45vw] h-[60vh] md:h-[55vh] p-4 relative group cursor-pointer overflow-hidden border border-cosmic-text/5 bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-700 hover:border-neon-cyan/20">
      
      <!-- Top info -->
      <div class="flex justify-between items-start mb-8 relative z-10">
        <div>
           <span class="font-mono text-[10px] uppercase tracking-widest text-cosmic-text/40 mb-1 block">{{ category }}</span>
           <h3 class="font-cosmic text-2xl tracking-tighter">{{ title }}</h3>
        </div>
        <div class="font-mono text-[10px] text-cosmic-text/30 items-center gap-2 hidden md:flex uppercase">
            <span>{{ year }}</span>
            <span class="w-1 h-1 rounded-full bg-cosmic-text/10"></span>
            <span>Case Study</span>
        </div>
      </div>

      <!-- Main Visual Placeholder (Gradient for now) -->
      <div class="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-magenta/5 opacity-40 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <!-- Reveal Bottom info -->
      <div class="absolute bottom-6 left-6 z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
          <p class="font-mono text-[11px] uppercase tracking-widest text-neon-cyan">View Details →</p>
      </div>

    </div>
  `,
  styles: [`
    :host {
        display: block;
    }
  `],
})
export class ProjectCard {
  @Input() title: string = "Project Title";
  @Input() category: string = "Digital Experience";
  @Input() year: string = "2026";
}
