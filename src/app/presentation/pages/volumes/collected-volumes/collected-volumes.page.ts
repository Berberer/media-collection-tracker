import { CommonModule, NgStyle } from '@angular/common';
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
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlassSolid } from '@ng-icons/heroicons/solid';
import { TranslatePipe } from '@ngx-translate/core';
import {
  Actions,
  ofActionCompleted,
  ofActionDispatched,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { filter, Subject, takeUntil } from 'rxjs';

import { AppRoutes } from '../../../../app.routes';
import { TitleService } from '../../../../core/services/title.service';
import { SeriesModel } from '../../../../features/series/model/series.model';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { VolumeTags } from '../../../../features/tags/state/tags.state.actions';
import { TagsStateSelectors } from '../../../../features/tags/state/tags.state.selectors';
import { CreateVolumeModel } from '../../../../features/volumes/model/create.volume.model';
import { UpdateVolumeModel } from '../../../../features/volumes/model/update.volume.model';
import { VolumeModel } from '../../../../features/volumes/model/volume.model';
import { Volumes } from '../../../../features/volumes/state/volumes.state.actions';
import { VolumesStateSelectors } from '../../../../features/volumes/state/volumes.state.selectors';
import { ConfirmationPromptComponent } from '../../../components/core/confirmation-prompt/confirmation-prompt.component';
import { MediaTypeBadgeComponent } from '../../../components/core/media-type-badge/media-type-badge.component';
import { ModalDialogComponent } from '../../../components/core/modal-dialog/modal-dialog.component';
import { SortDirection } from '../../../components/core/sort-button/sort-button.component';
import { VolumeFormComponent } from '../../../components/volumes/volume-form/volume-form.component';
import { SortableColumn } from '../../../components/volumes/volumes-table/services/volumes-table-data.service';
import {
  VolumesTableComponent,
  VolumeViewMode,
} from '../../../components/volumes/volumes-table/volumes-table.component';

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
    ModalDialogComponent,
    VolumeFormComponent,
    NgIcon,
  ],
  providers: [provideIcons({ heroMagnifyingGlassSolid })],
})
export class CollectedVolumesPage implements OnInit, OnDestroy {
  private readonly title = inject(TitleService);
  private readonly router = inject(Router);

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

  readonly volumeToDelete = signal<VolumeModel | null>(null);
  readonly volumeToUpdate = signal<UpdateVolumeModel | null>(null);
  readonly allSeriesForAddingVolume = signal<readonly SeriesModel[] | null>(null);

  readonly loadingCollectedVolumes = signal(false);
  readonly loadingVolumeTags = signal(false);
  readonly deletingVolume = signal(false);
  readonly savingVolume = signal(false);

  readonly showDeleteVolumeConfirmation = signal(false);
  readonly showVolumeFormDialog = signal(false);

  readonly volumeViewMode = VolumeViewMode.COLLECTED;

  constructor() {
    this.title.setTitleByTranslation('titles.volumes.collected');
  }

  ngOnInit(): void {
    this.setUpGetCollectedVolumesActionHandlers();
    this.setUpGetVolumeTagsActionHandlers();
    this.setUpDeleteVolumeActionHandlers();
    this.setUpUpdateVolumeActionHandlers();

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

  private setUpUpdateVolumeActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.Update), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingVolume.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.Update), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingVolume.set(false));

    this.actions$
      .pipe(ofActionSuccessful(Volumes.Update), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showVolumeFormDialog.set(false);
        this.volumeToUpdate.set(null);
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

  onVolumeEdited(volume: VolumeModel): void {
    this.volumeToUpdate.set(new UpdateVolumeModel(volume));
    this.allSeriesForAddingVolume.set([volume.series]);
    this.showVolumeFormDialog.set(true);
  }

  onVolumeSaved(savedVolume: CreateVolumeModel | UpdateVolumeModel): void {
    if (savedVolume instanceof UpdateVolumeModel) {
      this.store.dispatch(new Volumes.Update(savedVolume));
    }
  }

  onCancelledEditVolume(): void {
    this.showVolumeFormDialog.set(false);
    this.volumeToUpdate.set(null);
    this.allSeriesForAddingVolume.set(null);
  }

  async onViewSeriesDetails(series: SeriesModel): Promise<void> {
    await this.router.navigate([AppRoutes.Series, series.id]);
  }
}
