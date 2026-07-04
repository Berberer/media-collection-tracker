import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowPathSolid,
  heroArrowRightEndOnRectangleSolid,
  heroFunnelSolid,
  heroPencilSolid,
  heroShoppingCartSolid,
  heroTrashSolid,
  heroXMarkSolid,
} from '@ng-icons/heroicons/solid';
import { TranslatePipe } from '@ngx-translate/core';

import { SeriesModel } from '../../../../features/series/model/series.model';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { VolumeModel } from '../../../../features/volumes/model/volume.model';
import { SortButtonComponent, SortDirection } from '../../core/sort-button/sort-button.component';
import { SeriesBadgeComponent } from '../../series/series-badge/series-badge.component';
import { TagAssignmentComponent } from '../../tags/tag-assignment/tag-assignment.component';
import { TagBadgeComponent } from '../../tags/tag-badge/tag-badge.component';
import { SortableColumn, VolumesTableDataService } from './services/volumes-table-data.service';

export enum VolumeViewMode {
  IN_DELIVERY = 'IN_DELIVERY',
  NOT_BOUGHT = 'NOT_BOUGHT',
  COLLECTED = 'COLLECTED',
  SERIES_DETAILS = 'SERIES_DETAILS',
}

@Component({
  selector: 'app-volumes-table',
  templateUrl: './volumes-table.component.html',
  styleUrl: './volumes-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslatePipe,
    NgIcon,
    SeriesBadgeComponent,
    TagAssignmentComponent,
    TagBadgeComponent,
    SortButtonComponent,
  ],
  providers: [
    VolumesTableDataService,
    provideIcons({
      heroArrowPathSolid,
      heroShoppingCartSolid,
      heroArrowRightEndOnRectangleSolid,
      heroPencilSolid,
      heroTrashSolid,
      heroFunnelSolid,
      heroXMarkSolid,
    }),
  ],
})
export class VolumesTableComponent {
  private readonly dataService = inject(VolumesTableDataService);

  readonly volumes = input.required<readonly VolumeModel[]>();
  readonly volumeTags = input.required<readonly VolumeTagModel[]>();
  readonly defaultSortColumn = input<SortableColumn | null>(null);
  readonly defaultSortDirection = input<SortDirection | null>(null);
  readonly viewMode = input.required<VolumeViewMode>();

  readonly volumeTagAdded = output<{
    volume: VolumeModel;
    tag: VolumeTagModel;
  }>();
  readonly volumeTagRemoved = output<{
    volume: VolumeModel;
    tag: VolumeTagModel;
  }>();
  readonly volumeMarkedAsBought = output<VolumeModel>();
  readonly volumeMarkedAsDelivered = output<VolumeModel>();
  readonly volumeEdited = output<VolumeModel>();
  readonly volumeDeleted = output<VolumeModel>();
  readonly seriesViewDetails = output<SeriesModel>();

  readonly SortableColumn = SortableColumn;
  readonly sortDirections = this.dataService.sortDirections;
  readonly sortingApplied = this.dataService.sortingApplied;
  readonly filteredSeriesNames = this.dataService.filteredSeriesNames;
  readonly filteredTagIds = this.dataService.filteredTagIds;
  readonly filterApplied = this.dataService.filterApplied;
  readonly availableSeriesNames = this.dataService.availableSeriesNames;
  readonly availableTags = this.dataService.availableTags;
  readonly filteredAndSortedVolumes = this.dataService.filteredAndSortedVolumes;

  readonly updateSort = this.dataService.updateSort.bind(this.dataService);
  readonly toggleSeriesFilter = this.dataService.toggleSeriesFilter.bind(this.dataService);
  readonly toggleTagFilter = this.dataService.toggleTagFilter.bind(this.dataService);
  readonly resetFilters = this.dataService.resetFilters.bind(this.dataService);
  readonly resetSort = this.dataService.resetSort.bind(this.dataService);

  readonly VolumeViewMode = VolumeViewMode;

  constructor() {
    effect(() => {
      this.dataService.initialize(
        this.volumes(),
        this.volumeTags(),
        this.defaultSortColumn(),
        this.defaultSortDirection(),
      );
    });
  }

  onVolumeTagAdded(volume: VolumeModel, tag: VolumeTagModel): void {
    this.volumeTagAdded.emit({ volume, tag });
  }

  onVolumeTagRemoved(volume: VolumeModel, tag: VolumeTagModel): void {
    this.volumeTagRemoved.emit({ volume, tag });
  }
}
