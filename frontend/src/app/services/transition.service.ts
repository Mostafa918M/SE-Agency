import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

export interface TransitionData {
    url: any[];
    title?: string;
    client?: string;
    callback?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class TransitionService {
  // A signal or subject to tell the root app to "Shutter In" and then navigate
  private transitionStart = new Subject<TransitionData>();
  public transition$ = this.transitionStart.asObservable();

  // Flag to prevent double-firing of shutter on NavigationStart
  public isTransitioning = false;

  constructor(private router: Router) {}

  public async navigateWithTransition(data: TransitionData) {
      this.isTransitioning = true;
      this.transitionStart.next(data);
  }
}
