import {
  ApplicationConfig,
  enableProdMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore, NgxsUnhandledErrorHandler } from '@ngxs/store';
import { withNgxsRouterPlugin } from '@ngxs/router-plugin';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { SeriesState } from './features/series/state/series.state';
import { seriesDataSourceProvider } from './features/series/data-sources/series.data-source.provider';
import { TagsState } from './features/tags/state/tags.state';
import { tagsDataSourceProviders } from './features/tags/data-sources/tags.data-source.provider';
import { volumesDataSourceProviders } from './features/volumes/data-sources/volumes.data-source.provider';
import { VolumesState } from './features/volumes/state/volumes.state';
import { GlobalNgxsErrorHandler } from './core/errors/global-error.handler';

if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
        enforceLoading: true,
        useHttpBackend: true,
      }),
      lang: navigator.language.split('-')[0],
      fallbackLang: 'en',
    }),
    provideStore(
      [SeriesState, TagsState, VolumesState],
      environment.ngxsConfig,
      withNgxsRouterPlugin(),
    ),
    seriesDataSourceProvider,
    tagsDataSourceProviders,
    volumesDataSourceProviders,
    { provide: NgxsUnhandledErrorHandler, useClass: GlobalNgxsErrorHandler },
  ],
};
