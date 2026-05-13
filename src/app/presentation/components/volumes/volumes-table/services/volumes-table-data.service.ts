import { computed, Injectable, signal } from '@angular/core';
import { VolumeModel } from '../../../../../features/volumes/model/volume.model';
import { VolumeTagModel } from '../../../../../features/tags/model/volume-tag.model';
import { SortDirection } from '../../../core/sort-button/sort-button.component';

export enum SortableColumn {
  SERIES_NAME = 'SERIES_NAME',
  SEQUENCE_NUMBER = 'SEQUENCE_NUMBER',
  RELEASE_DATE = 'RELEASE_DATE',
  PURCHASE_DATE = 'PURCHASE_DATE',
}

@Injectable({
  providedIn: 'root',
})
export class VolumesTableDataService {
  readonly volumes = signal<readonly VolumeModel[]>([]);
  readonly volumeTags = signal<readonly VolumeTagModel[]>([]);

  readonly sortColumn = signal<SortableColumn | null>(null);
  readonly sortDirections = signal<Record<SortableColumn, SortDirection>>({
    [SortableColumn.SERIES_NAME]: SortDirection.NONE,
    [SortableColumn.SEQUENCE_NUMBER]: SortDirection.NONE,
    [SortableColumn.RELEASE_DATE]: SortDirection.NONE,
    [SortableColumn.PURCHASE_DATE]: SortDirection.NONE,
  });

  readonly sortingApplied = computed<boolean>(
    () =>
      this.sortColumn() !== null &&
      this.sortDirections()[this.sortColumn()!] !== SortDirection.NONE,
  );

  readonly filteredSeriesNames = signal<Set<string>>(new Set());
  readonly filteredTagIds = signal<Set<string>>(new Set());

  readonly filterApplied = computed<boolean>(
    () => this.filteredSeriesNames().size > 0 || this.filteredTagIds().size > 0,
  );

  readonly availableSeriesNames = computed(() => {
    const names = new Set(this.volumes().map((v) => v.series.name));
    return Array.from(names).sort();
  });

  readonly availableTags = computed(() => {
    return [...this.volumeTags()].sort((a, b) => a.label.localeCompare(b.label));
  });

  readonly filteredAndSortedVolumes = computed(() => {
    let volumes = this.volumes();

    // Filtering
    const seriesFilters = this.filteredSeriesNames();
    if (seriesFilters.size > 0) {
      volumes = volumes.filter((v) => seriesFilters.has(v.series.name));
    }

    const tagFilters = this.filteredTagIds();
    if (tagFilters.size > 0) {
      volumes = volumes.filter((v) => v.volumeTags.some((tag) => tagFilters.has(tag.id)));
    }

    // Sorting
    if (this.sortingApplied()) {
      const column = this.sortColumn()!;
      const direction = this.sortDirections()[column];

      volumes = [...volumes].sort((a, b) => {
        if (column === SortableColumn.SERIES_NAME) {
          const compareName = a.series.name.localeCompare(b.series.name);
          if (compareName !== 0) {
            return direction === SortDirection.ASC ? compareName : -compareName;
          }
        } else if (column === SortableColumn.SEQUENCE_NUMBER) {
          const compareNumber = a.sequenceNumber - b.sequenceNumber;
          if (compareNumber !== 0) {
            return direction === SortDirection.ASC ? compareNumber : -compareNumber;
          }
        } else if (column === SortableColumn.RELEASE_DATE) {
          return this.compareDates(a.releaseDate, b.releaseDate, direction);
        } else if (column === SortableColumn.PURCHASE_DATE) {
          return this.compareDates(a.purchaseDate, b.purchaseDate, direction);
        }

        return 0;
      });
    }

    return volumes;
  });

  private compareDates(d1: Date | null, d2: Date | null, direction: SortDirection): number {
    // If one has date and other doesn't, the one without date always comes last
    if (d1 !== null && d2 === null) return -1;
    if (d1 === null && d2 !== null) return 1;

    if (d1 !== null && d2 !== null && d1.getTime() !== d2.getTime()) {
      const compareDate = d1.getTime() - d2.getTime();
      return direction === SortDirection.ASC ? compareDate : -compareDate;
    }

    return 0;
  }

  initialize(
    volumes: readonly VolumeModel[],
    volumeTags: readonly VolumeTagModel[],
    defaultSortColumn: SortableColumn | null,
    defaultSortDirection: SortDirection | null,
  ): void {
    this.volumes.set(volumes);
    this.volumeTags.set(volumeTags);

    if (defaultSortColumn !== null && defaultSortDirection !== null) {
      this.updateSort(defaultSortColumn, defaultSortDirection);
    }
  }

  updateSort(column: SortableColumn, direction: SortDirection): void {
    this.sortColumn.set(column);
    this.sortDirections.set({
      ...{
        [SortableColumn.SERIES_NAME]: SortDirection.NONE,
        [SortableColumn.SEQUENCE_NUMBER]: SortDirection.NONE,
        [SortableColumn.RELEASE_DATE]: SortDirection.NONE,
        [SortableColumn.PURCHASE_DATE]: SortDirection.NONE,
      },
      [column]: direction,
    });
  }

  toggleSeriesFilter(name: string): void {
    this.filteredSeriesNames.update((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  toggleTagFilter(tagId: string): void {
    this.filteredTagIds.update((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  }

  resetFilters(): void {
    this.filteredSeriesNames.set(new Set());
    this.filteredTagIds.set(new Set());
  }

  resetSort(): void {
    this.sortColumn.set(null);
    this.sortDirections.set({
      [SortableColumn.SERIES_NAME]: SortDirection.NONE,
      [SortableColumn.SEQUENCE_NUMBER]: SortDirection.NONE,
      [SortableColumn.RELEASE_DATE]: SortDirection.NONE,
      [SortableColumn.PURCHASE_DATE]: SortDirection.NONE,
    });
  }
}
