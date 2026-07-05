import { inject, Service, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Service()
export class NavigationHistoryService {
  private readonly history = signal<string[]>([]);

  constructor() {
    inject(Router)
      .events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.history.update((h) => [...h.slice(-10), e.urlAfterRedirects]));
  }

  hasPrevious(): boolean {
    return this.history().length > 1;
  }
}
