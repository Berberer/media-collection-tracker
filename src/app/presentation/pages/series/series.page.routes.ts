import { Routes } from '@angular/router';

import { CompletedSeriesPage } from './completed-series/completed-series.page';
import { IncompleteSeriesPage } from './incomplete-series/incomplete-series.page';
import { OrphanedSeriesPage } from './orphaned-series/orphaned-series.page';

enum SeriesRoutes {
  Incomplete = 'incomplete',
  Orphans = 'orphans',
  Completed = 'completed',
}

export const seriesRoutes: Routes = [
  {
    path: SeriesRoutes.Incomplete,
    component: IncompleteSeriesPage,
  },
  {
    path: SeriesRoutes.Orphans,
    component: OrphanedSeriesPage,
  },
  {
    path: SeriesRoutes.Completed,
    component: CompletedSeriesPage,
  },

  { path: '', redirectTo: SeriesRoutes.Incomplete, pathMatch: 'full' },
  { path: '**', redirectTo: SeriesRoutes.Incomplete, pathMatch: 'full' },
];
