import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgStyle } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCheckSolid,
  heroPencilSolid,
  heroPlusSolid,
  heroTrashSolid,
} from '@ng-icons/heroicons/solid';
import { SeriesModel } from '../../../../features/series/model/series.model';
import { TagBadgeComponent } from '../../tags/tag-badge/tag-badge.component';
import { MediaTypeBadgeComponent } from '../../core/media-type-badge/media-type-badge.component';

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
  providers: [provideIcons({ heroCheckSolid, heroPencilSolid, heroPlusSolid, heroTrashSolid })],
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

  protected readonly SeriesViewMode = SeriesViewMode;
}
