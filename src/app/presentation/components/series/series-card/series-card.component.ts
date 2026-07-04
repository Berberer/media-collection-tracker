import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCheckSolid,
  heroMagnifyingGlassSolid,
  heroPencilSolid,
  heroPlusSolid,
  heroTrashSolid,
} from '@ng-icons/heroicons/solid';
import { TranslatePipe } from '@ngx-translate/core';

import { SeriesModel } from '../../../../features/series/model/series.model';
import { MediaTypeBadgeComponent } from '../../core/media-type-badge/media-type-badge.component';
import { TagBadgeComponent } from '../../tags/tag-badge/tag-badge.component';

export enum SeriesViewMode {
  INCOMPLETE = 'INCOMPLETE',
  ORPHANED = 'ORPHANED',
  COMPLETED = 'COMPLETED',
}

@Component({
  selector: 'app-series-card',
  templateUrl: './series-card.component.html',
  styleUrl: './series-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, TranslatePipe, NgIcon, MediaTypeBadgeComponent, TagBadgeComponent],
  providers: [
    provideIcons({
      heroCheckSolid,
      heroMagnifyingGlassSolid,
      heroPencilSolid,
      heroPlusSolid,
      heroTrashSolid,
    }),
  ],
})
export class SeriesCardComponent {
  readonly series = input.required<SeriesModel>();
  readonly viewMode = input.required<SeriesViewMode>();
  readonly loading = input(false);
  readonly readonly = input(false);

  readonly addVolume = output();
  readonly editSeries = output();
  readonly markCompleted = output();
  readonly deleteSeries = output();
  readonly viewDetails = output<void>();

  protected readonly SeriesViewMode = SeriesViewMode;
}
