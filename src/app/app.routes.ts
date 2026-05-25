import { Routes } from '@angular/router';

import { seriesRoutes } from './presentation/pages/series/series.page.routes';
import { tagsRoutes } from './presentation/pages/tags/tags.page.routes';
import { volumesRoutes } from './presentation/pages/volumes/volumes.page.routes';

export enum AppRoutes {
  Series = 'series',
  Tags = 'tags',
  Volumes = 'volumes',
}

export const routes: Routes = [
  {
    path: AppRoutes.Series,
    children: seriesRoutes,
  },
  {
    path: AppRoutes.Tags,
    children: tagsRoutes,
  },
  {
    path: AppRoutes.Volumes,
    children: volumesRoutes,
  },

  { path: '', redirectTo: AppRoutes.Volumes, pathMatch: 'full' },
  { path: '**', redirectTo: AppRoutes.Volumes, pathMatch: 'full' },
];
