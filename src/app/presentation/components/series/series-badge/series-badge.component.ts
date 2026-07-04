import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { SeriesModel } from '../../../../features/series/model/series.model';
import { SeriesCardComponent, SeriesViewMode } from '../series-card/series-card.component';

@Component({
  selector: 'app-series-badge',
  templateUrl: './series-badge.component.html',
  styleUrl: './series-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, SeriesCardComponent, NgClass],
})
export class SeriesBadgeComponent {
  readonly series = input.required<SeriesModel>();
  readonly tooltipPlacement = input<
    'tooltip-top' | 'tooltip-bottom' | 'tooltip-left' | 'tooltip-right'
  >('tooltip-bottom');
  readonly viewMode = input<SeriesViewMode>();

  readonly viewDetails = output<void>();

  protected readonly resolvedViewMode = computed(() => {
    const providedMode = this.viewMode();
    if (providedMode) {
      return providedMode;
    }

    if (this.series().completed) {
      return SeriesViewMode.COMPLETED;
    }

    return SeriesViewMode.INCOMPLETE;
  });
}
