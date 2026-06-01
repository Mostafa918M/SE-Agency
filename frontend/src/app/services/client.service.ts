import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap, map } from 'rxjs';

export interface ClientData {
  _id?: string;
  name: string;
  logo?: string;
  order?: number;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;
  
  clients = signal<ClientData[]>([]);

  constructor(private http: HttpClient) {
    this.refreshClients();
  }

  private get baseUrl() {
    try {
      return new URL(environment.apiUrl).origin;
    } catch {
      return environment.apiUrl.replace(/\/api$/, '');
    }
  }

  /**
   * Prepend base URL to logo paths if they are relative.
   */
  private formatClientPaths(c: ClientData): ClientData {
    if (!c.logo) return c;
    if (c.logo.startsWith('http')) return c;
    const cleanPath = c.logo.startsWith('/') ? c.logo : `/${c.logo}`;
    return {
      ...c,
      logo: `${this.baseUrl}${cleanPath}`
    };
  }

  /**
   * Fetch all clients from the backend.
   */
  refreshClients() {
    this.http.get<ApiResponse<{ clients: ClientData[] }>>(this.apiUrl)
      .pipe(
        map(res => res.data.clients.map(c => this.formatClientPaths(c))),
        tap(clients => this.clients.set(clients))
      )
      .subscribe();
  }

  addClient(data: ClientData | FormData): Observable<ApiResponse<{ client: ClientData }>> {
    return this.http.post<ApiResponse<{ client: ClientData }>>(this.apiUrl, data, { withCredentials: true })
      .pipe(tap(() => this.refreshClients()));
  }

  updateClient(id: string, data: Partial<ClientData> | FormData): Observable<ApiResponse<{ client: ClientData }>> {
    return this.http.patch<ApiResponse<{ client: ClientData }>>(`${this.apiUrl}/${id}`, data, { withCredentials: true })
      .pipe(tap(() => this.refreshClients()));
  }

  deleteClient(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`, { withCredentials: true })
      .pipe(tap(() => this.refreshClients()));
  }
}

