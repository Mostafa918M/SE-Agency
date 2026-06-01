import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap, map } from 'rxjs';

export interface ProjectCategory {
  name: string;
  tags: string[];
}

export interface ProjectData {
  _id?: string; // MongoDB ID
  id?: string; // For compatibility
  slug?: string; // URL slug
  title: string;
  client: string;
  bannerImg: string;
  img: string; 
  cat: string; 
  mainHeadingStart: string;
  mainHeadingMute: string;
  mainHeadingEnd: string;
  description: string;
  website?: string;
  categories: ProjectCategory[];
  gallery: string[];
  video?: string; // Stored as path
  videoHeading?: string;
  videoThumb?: string;
  featured?: boolean;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;
  private get baseUrl() {
    try {
      return new URL(environment.apiUrl).origin;
    } catch {
      return environment.apiUrl.replace(/\/api$/, '');
    }
  }
  
  projects = signal<ProjectData[]>([]);

  constructor(private http: HttpClient) {
    this.refreshProjects();
  }

  /**
   * Prepend base URL to image/video paths if they are relative.
   */
  private formatProjectPaths(p: ProjectData): ProjectData {
    const format = (path?: string) => {
      if (!path) return path;
      if (path.startsWith('http')) return path;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${this.baseUrl}${cleanPath}`;
    };

    // Auto-generate slug if missing. Ensure it's never empty.
    const slug = (p.slug || p.title || 'project').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      ...p,
      id: p._id?.toString(),
      slug: slug || p._id?.toString() || 'unknown',
      bannerImg: format(p.bannerImg)!,
      img: format(p.img)!,
      videoThumb: format(p.videoThumb),
      video: format(p.video),
      gallery: p.gallery ? p.gallery.map(path => format(path)!) : []
    };
  }

  /**
   * Fetch all projects from the backend.
   */
  refreshProjects() {
    this.http.get<ApiResponse<{ projects: ProjectData[] }>>(this.apiUrl)
      .pipe(
        map(res => res.data.projects.map(p => this.formatProjectPaths(p))),
        tap(projects => this.projects.set(projects))
      )
      .subscribe();
  }

  /**
   * Get all featured projects.
   */
  getFeaturedProjects(): ProjectData[] {
    return this.projects().filter((p: ProjectData) => p.featured);
  }

  /**
   * Get a project by its ID from the local signal.
   */
  getProjectById(idOrSlug: string): ProjectData | undefined {
    return this.projects().find((p: ProjectData) => 
      p.id === idOrSlug || p._id === idOrSlug || p.slug === idOrSlug
    );
  }

  /**
   * Fetch a project by its ID from the backend.
   */
  fetchProjectById(id: string): Observable<ProjectData> {
    return this.http.get<ApiResponse<{ project: ProjectData }>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => this.formatProjectPaths(res.data.project))
      );
  }

  /**
   * Create a new project (Admin only).
   */
  addProject(project: FormData | ProjectData): Observable<HttpEvent<any>> {
    return this.http.post(this.apiUrl, project, { 
      withCredentials: true,
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Update an existing project (Admin only).
   */
  updateProject(id: string, project: FormData | Partial<ProjectData>): Observable<HttpEvent<any>> {
    return this.http.patch(`${this.apiUrl}/${id}`, project, { 
      withCredentials: true,
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Delete a project (Admin only).
   */
  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true })
      .pipe(
        tap(() => this.refreshProjects())
      );
  }
}
