import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, NgStyle } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Actions, ofActionCompleted, ofActionDispatched, Store } from '@ngxs/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { VolumeModel } from '../../../../features/volumes/model/volume.model';
import { SeriesModel } from '../../../../features/series/model/series.model';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { Volumes } from '../../../../features/volumes/state/volumes.state.actions';
import { VolumeTags } from '../../../../features/tags/state/tags.state.actions';
import {
  VolumesTableComponent,
  VolumeViewMode,
} from '../../../components/volumes/volumes-table/volumes-table.component';
import { VolumesStateSelectors } from '../../../../features/volumes/state/volumes.state.selectors';
import { TagsStateSelectors } from '../../../../features/tags/state/tags.state.selectors';
import { MediaTypeBadgeComponent } from '../../../components/core/media-type-badge/media-type-badge.component';
import { ConfirmationPromptComponent } from '../../../components/core/confirmation-prompt/confirmation-prompt.component';
import { SortableColumn } from '../../../components/volumes/volumes-table/services/volumes-table-data.service';
import { SortDirection } from '../../../components/core/sort-button/sort-button.component';

@Component({
  selector: 'app-collected-volumes-page',
  templateUrl: './collected-volumes.page.html',
  styleUrl: './collected-volumes.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslatePipe,
    VolumesTableComponent,
    NgStyle,
    MediaTypeBadgeComponent,
    ConfirmationPromptComponent,
  ],
})
export class CollectedVolumesPage implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly ngUnsubscribe = new Subject<void>();

  readonly collectedVolumes$ = this.store.select(VolumesStateSelectors.collectedVolumes);
  readonly collectedVolumes = toSignal(this.collectedVolumes$, {
    initialValue: new Map<SeriesModel, VolumeModel[]>(),
  });

  readonly volumeTags$ = this.store.select(TagsStateSelectors.volumeTags);

  readonly SortableColumn = SortableColumn;
  readonly SortDirection = SortDirection;

  readonly sortedSeries = computed(() => {
    return Array.from(this.collectedVolumes().keys()).sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly loadingCollectedVolumes = signal(false);
  readonly loadingVolumeTags = signal(false);
  readonly deletingVolume = signal(false);

  readonly showDeleteVolumeConfirmation = signal(false);
  readonly volumeToDelete = signal<VolumeModel | null>(null);

  readonly volumeViewMode = VolumeViewMode.COLLECTED;

  constructor() {
    this.translate
      .get('titles.volumes.collected', { applicationName: environment.appTitle })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((title: string) => this.title.setTitle(title));
  }

  ngOnInit(): void {
    this.setUpGetCollectedVolumesActionHandlers();
    this.setUpGetVolumeTagsActionHandlers();
    this.setUpDeleteVolumeActionHandlers();

    this.store.dispatch([Volumes.GetCollected, VolumeTags.GetAll]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private setUpGetCollectedVolumesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.GetCollected), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingCollectedVolumes.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.GetCollected), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingCollectedVolumes.set(false));
  }

  private setUpGetVolumeTagsActionHandlers(): void {
    this.actions$
      .pipe(
        ofActionDispatched(VolumeTags.GetAll),
        filter(({ globalEvent }) => !globalEvent),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => this.loadingVolumeTags.set(true));

    this.actions$
      .pipe(ofActionCompleted(VolumeTags.GetAll), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingVolumeTags.set(false));
  }

  private setUpDeleteVolumeActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingVolume.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingVolume.set(false));

    this.actions$
      .pipe(ofActionCompleted(Volumes.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showDeleteVolumeConfirmation.set(false);
        this.volumeToDelete.set(null);
      });
  }

  onVolumeTagAdded({ volume, tag }: { volume: VolumeModel; tag: VolumeTagModel }): void {
    this.store.dispatch(
      new Volumes.Update({
        ...volume,
        volumeTags: [...volume.volumeTags, tag],
      }),
    );
  }

  onVolumeTagRemoved({ volume, tag }: { volume: VolumeModel; tag: VolumeTagModel }): void {
    this.store.dispatch(
      new Volumes.Update({
        ...volume,
        volumeTags: volume.volumeTags.filter((t) => t.id !== tag.id),
      }),
    );
  }

  onDeleteVolume(volume: VolumeModel): void {
    this.volumeToDelete.set(volume);
    this.showDeleteVolumeConfirmation.set(true);
  }

  confirmDelete(): void {
    const volume = this.volumeToDelete();
    if (volume) {
      this.store.dispatch(new Volumes.Delete(volume.id));
    }
  }

  cancelDelete(): void {
    this.showDeleteVolumeConfirmation.set(false);
    this.volumeToDelete.set(null);
  }
}
