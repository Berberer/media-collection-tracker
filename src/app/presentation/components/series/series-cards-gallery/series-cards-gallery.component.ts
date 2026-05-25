import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { SeriesMediaTypes } from '../../../../features/series/model/media-type.model';
import { SeriesModel } from '../../../../features/series/model/series.model';
import { MediaTypeBadgeComponent } from '../../core/media-type-badge/media-type-badge.component';
import { SeriesCardComponent, SeriesViewMode } from '../series-card/series-card.component';

@Component({
  selector: 'app-series-cards-gallery',
  templateUrl: './series-cards-gallery.component.html',
  styleUrl: './series-cards-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SeriesCardComponent, TranslatePipe, MediaTypeBadgeComponent],
})
export class SeriesCardsGalleryComponent {
  readonly series = input.required<readonly SeriesModel[]>();
  readonly seriesViewMode = input.required<SeriesViewMode>();
  readonly loading = input.required<boolean>();
  readonly noSeriesMessage = input.required<string>();
  readonly noSeriesForFilterTypeMessage = input.required<string>();

  readonly addVolume = output<SeriesModel>();
  readonly editSeries = output<SeriesModel>();
  readonly markCompleted = output<SeriesModel>();
  readonly deleteSeries = output<SeriesModel>();

  readonly SeriesMediaType = SeriesMediaTypes.SeriesMediaType;
  readonly selectedMediaType = signal<SeriesMediaTypes.SeriesMediaType | null>(null);

  readonly filteredSeries = computed(() => {
    const mediaTypeFilter = this.selectedMediaType();
    const allSeries = this.series();

    if (mediaTypeFilter !== null) {
      return allSeries.filter((series) => series.mediaType === mediaTypeFilter);
    } else {
      return allSeries;
    }
  });

  onMediaTypeFilterChange(mediaType: SeriesMediaTypes.SeriesMediaType | null): void {
    this.selectedMediaType.set(mediaType);
  }
}
