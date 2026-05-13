import { Routes } from '@angular/router';
import { SeriesTagsPage } from './series-tags/series-tags.page';
import { VolumeTagsPage } from './volume-tags/volume-tags.page';

enum TagsRoutes {
  Series = 'series',
  Volume = 'volume',
}

export const tagsRoutes: Routes = [
  {
    path: TagsRoutes.Series,
    component: SeriesTagsPage,
  },
  {
    path: TagsRoutes.Volume,
    component: VolumeTagsPage,
  },

  { path: '', redirectTo: TagsRoutes.Series, pathMatch: 'full' },
  { path: '**', redirectTo: TagsRoutes.Series, pathMatch: 'full' },
];
