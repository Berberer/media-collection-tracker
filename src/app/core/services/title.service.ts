import { inject, Service, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../environments/environment';

@Service()
export class TitleService {
  readonly angularTitle = inject(Title);
  readonly translate = inject(TranslateService);
  readonly currentTitle = signal<string>('');

  constructor() {
    this.currentTitle.set(this.angularTitle.getTitle());
  }

  getTitle(): string {
    return this.currentTitle();
  }

  setTitle(newTitle: string): void {
    this.angularTitle.setTitle(newTitle);
    this.currentTitle.set(newTitle);
  }

  setTitleByTranslation(key: string, interpolateParams?: Record<string, unknown>): void {
    this.translate
      .get(key, { applicationName: environment.appTitle, ...interpolateParams })
      .subscribe((translated: string) => {
        this.angularTitle.setTitle(translated);
        this.currentTitle.set(translated);
      });
  }
}
