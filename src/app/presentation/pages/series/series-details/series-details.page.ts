import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeftSolid,
  heroCheckSolid,
  heroPencilSolid,
  heroPlusSolid,
  heroTrashSolid,
} from '@ng-icons/heroicons/solid';
import { TranslatePipe } from '@ngx-translate/core';
import {
  Actions,
  ofActionCompleted,
  ofActionDispatched,
  ofActionErrored,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { combineLatest, filter, map, Subject, takeUntil } from 'rxjs';

import { AppRoutes } from '../../../../app.routes';
import { BaseError, markAsHandled } from '../../../../core/errors';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';
import { TitleService } from '../../../../core/services/title.service';
import { SeriesRecordNotFoundError } from '../../../../features/series/errors';
import { CreateSeriesModel } from '../../../../features/series/model/create.series.model';
import { CreateSeriesVolumeModel } from '../../../../features/series/model/create.series-volume.model';
import { SeriesModel } from '../../../../features/series/model/series.model';
import { UpdateSeriesModel } from '../../../../features/series/model/update.series.model';
import { Series } from '../../../../features/series/state/series.state.actions';
import { SeriesStateSelectors } from '../../../../features/series/state/series.state.selectors';
import { SeriesTagModel } from '../../../../features/tags/model/series-tag.model';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { SeriesTags, VolumeTags } from '../../../../features/tags/state/tags.state.actions';
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
import { SeriesFormComponent } from '../../../components/series/series-form/series-form.component';
import { TagAssignmentComponent } from '../../../components/tags/tag-assignment/tag-assignment.component';
import { VolumeFormComponent } from '../../../components/volumes/volume-form/volume-form.component';
import { SortableColumn } from '../../../components/volumes/volumes-table/services/volumes-table-data.service';
import {
  VolumesTableComponent,
  VolumeViewMode,
} from '../../../components/volumes/volumes-table/volumes-table.component';

@Component({
  selector: 'app-series-details-page',
  templateUrl: './series-details.page.html',
  styleUrl: './series-details.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslatePipe,
    MediaTypeBadgeComponent,
    NgIcon,
    VolumesTableComponent,
    ModalDialogComponent,
    SeriesFormComponent,
    VolumeFormComponent,
    ConfirmationPromptComponent,
    TagAssignmentComponent,
  ],
  providers: [
    provideIcons({
      heroArrowLeftSolid,
      heroCheckSolid,
      heroPencilSolid,
      heroPlusSolid,
      heroTrashSolid,
    }),
  ],
})
export class SeriesDetailsPage implements OnInit, OnDestroy {
  private readonly title = inject(TitleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly navHistory = inject(NavigationHistoryService);

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly ngUnsubscribe = new Subject<void>();

  readonly series$ = this.store.select(SeriesStateSelectors.currentSeries);
  readonly volumes$ = this.store.select(VolumesStateSelectors.currentVolumes);
  readonly isOrphanedSeries$;

  readonly seriesTags$ = this.store.select(TagsStateSelectors.seriesTags);
  readonly volumeTags$ = this.store.select(TagsStateSelectors.volumeTags);

  readonly showBackButton = computed(() => this.navHistory.hasPrevious());

  readonly loadingSeriesTags = signal(false);
  readonly loadingVolumeTags = signal(false);
  readonly loadingSeries = signal(false);
  readonly loadingVolumes = signal(false);
  readonly seriesNotFound = signal(false);
  readonly savingSeries = signal(false);
  readonly savingVolume = signal(false);
  readonly deletingSeries = signal(false);
  readonly deletingVolume = signal(false);

  readonly showSeriesFormModal = signal(false);
  readonly showVolumeFormModal = signal(false);
  readonly showMarkSeriesCompletedConfirmation = signal(false);
  readonly showDeleteSeriesConfirmation = signal(false);
  readonly showDeleteVolumeConfirmation = signal(false);
  readonly allSeriesForAddingVolume = signal<readonly SeriesModel[] | null>(null);

  readonly seriesModel = signal<SeriesModel | UpdateSeriesModel | null>(null);
  readonly volumeModel = signal<VolumeModel | CreateVolumeModel | UpdateVolumeModel | null>(null);
  readonly errors = signal<BaseError[]>([]);

  readonly volumeViewMode = VolumeViewMode.SERIES_DETAILS;
  readonly SortableColumn = SortableColumn;
  readonly SortDirection = SortDirection;

  constructor() {
    this.title.setTitleByTranslation('titles.series.details');

    this.isOrphanedSeries$ = combineLatest([this.series$, this.volumes$]).pipe(
      map(
        ([series, volumes]) =>
          !series?.completed &&
          volumes.every((volume) => volume.purchaseDate !== null && !volume.inDelivery),
      ),
      takeUntil(this.ngUnsubscribe),
    );
  }

  ngOnInit(): void {
    this.setUpGetSeriesTagsActionHandlers();
    this.setUpGetVolumeTagsActionHandlers();
    this.setUpGetSeriesByIdActionHandlers();
    this.setUpGetVolumesOfSeriesActionHandlers();

    this.setUpUpdateSeriesActionHandlers();
    this.setUpUpdateVolumeActionHandlers();
    this.setUpAddVolumeToSeriesActionHandlers();
    this.setUpDeleteSeriesActionHandlers();
    this.setUpDeleteVolumeActionHandlers();

    this.store.dispatch([SeriesTags.GetAll, VolumeTags.GetAll]);

    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      if ('id' in params && typeof params['id'] === 'string') {
        const id = params['id'];
        this.store.dispatch([new Series.GetById(id), new Volumes.GetVolumesOfSeries(id)]);
      } else {
        this.loadingSeries.set(false);
        this.seriesNotFound.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private setUpGetSeriesTagsActionHandlers(): void {
    this.actions$
      .pipe(
        ofActionDispatched(SeriesTags.GetAll),
        filter(({ globalEvent }) => !globalEvent),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => this.loadingSeriesTags.set(true));

    this.actions$
      .pipe(ofActionCompleted(SeriesTags.GetAll), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingSeriesTags.set(false));
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

  private setUpGetSeriesByIdActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Series.GetById), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingSeries.set(true));

    this.actions$
      .pipe(ofActionCompleted(Series.GetById), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingSeries.set(false));

    this.actions$
      .pipe(ofActionErrored(Series.GetById), takeUntil(this.ngUnsubscribe))
      .subscribe(({ result }) => {
        if (result.error && result.error instanceof SeriesRecordNotFoundError) {
          this.seriesNotFound.set(true);
          markAsHandled(result.error);
        }
      });
  }

  private setUpGetVolumesOfSeriesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.GetVolumesOfSeries), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingVolumes.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.GetVolumesOfSeries), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingVolumes.set(false));
  }

  private setUpUpdateSeriesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Series.Update), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.savingSeries.set(true);
        this.errors.set([]);
      });

    this.actions$
      .pipe(ofActionCompleted(Series.Update), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingSeries.set(false));

    this.actions$
      .pipe(ofActionSuccessful(Series.Update), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showSeriesFormModal.set(false);
        this.showMarkSeriesCompletedConfirmation.set(false);
        this.seriesModel.set(null);
      });

    this.actions$
      .pipe(ofActionErrored(Series.Update), takeUntil(this.ngUnsubscribe))
      .subscribe(({ result }) => {
        this.savingSeries.set(false);
        if (result.error && result.error instanceof BaseError) {
          markAsHandled(result.error);
          this.errors.set([result.error]);
        }
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
        this.showVolumeFormModal.set(false);
        this.volumeModel.set(null);
      });
  }

  private setUpAddVolumeToSeriesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Series.AddVolumeToSeries), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.savingVolume.set(true);
        this.errors.set([]);
      });

    this.actions$
      .pipe(ofActionCompleted(Series.AddVolumeToSeries), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingVolume.set(false));

    this.actions$
      .pipe(ofActionSuccessful(Series.AddVolumeToSeries), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showVolumeFormModal.set(false);
        this.volumeModel.set(null);
        this.allSeriesForAddingVolume.set(null);
      });

    this.actions$
      .pipe(ofActionErrored(Series.AddVolumeToSeries), takeUntil(this.ngUnsubscribe))
      .subscribe(({ result }) => {
        this.savingVolume.set(false);
        if (result.error && result.error instanceof BaseError) {
          markAsHandled(result.error);
          this.errors.set([result.error]);
        }
      });
  }

  private setUpDeleteSeriesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Series.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingSeries.set(true));

    this.actions$
      .pipe(ofActionCompleted(Series.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingSeries.set(false));

    this.actions$
      .pipe(ofActionSuccessful(Series.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showDeleteSeriesConfirmation.set(false);
        this.seriesModel.set(null);
        void this.router.navigate([AppRoutes.Series]);
      });
  }

  private setUpDeleteVolumeActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingVolume.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingVolume.set(false));

    this.actions$
      .pipe(ofActionSuccessful(Volumes.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showDeleteVolumeConfirmation.set(false);
        this.volumeModel.set(null);
      });
  }

  onNavigateBack(): void {
    if (this.navHistory.hasPrevious()) {
      this.location.back();
    }
  }

  onSeriesTagAdded(series: SeriesModel, tag: SeriesTagModel): void {
    this.store.dispatch(new Series.Update({ ...series, seriesTags: [...series.seriesTags, tag] }));
  }

  onSeriesTagRemoved(series: SeriesModel, tag: SeriesTagModel): void {
    this.store.dispatch(
      new Series.Update({
        ...series,
        seriesTags: series.seriesTags.filter((t) => t.id !== tag.id),
      }),
    );
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

  onEditSeries(series: SeriesModel): void {
    this.store.dispatch(SeriesTags.GetAll);

    this.seriesModel.set(new UpdateSeriesModel({ ...series }));
    this.showSeriesFormModal.set(true);
  }

  onSaveSeries(series: CreateSeriesModel | UpdateSeriesModel): void {
    if (series instanceof UpdateSeriesModel) {
      this.store.dispatch(new Series.Update(series));
    }
  }

  onAddVolume(series: SeriesModel, volumes: VolumeModel[]): void {
    this.store.dispatch(VolumeTags.GetAll);

    let highestVolumeNumber = null;
    if (volumes.length > 0) {
      highestVolumeNumber = Math.max(...volumes.map((v) => v.sequenceNumber));
    }
    this.volumeModel.set(
      CreateVolumeModel.createNextSeriesVolume(new SeriesModel({ ...series, highestVolumeNumber })),
    );
    this.allSeriesForAddingVolume.set([series]);
    this.showVolumeFormModal.set(true);
  }

  onSaveVolume(volume: CreateVolumeModel | UpdateVolumeModel): void {
    if (volume instanceof CreateVolumeModel) {
      this.store.dispatch(
        new Series.AddVolumeToSeries(volume.series, new CreateSeriesVolumeModel(volume)),
      );
    } else if (volume instanceof UpdateVolumeModel) {
      this.store.dispatch(new Volumes.Update(volume));
    }
  }

  onMarkSeriesCompleted(series: SeriesModel): void {
    this.seriesModel.set(new UpdateSeriesModel({ ...series, completed: true }));
    this.showMarkSeriesCompletedConfirmation.set(true);
  }

  onConfirmedMarkSeriesCompleted(): void {
    const seriesModel = this.seriesModel();
    if (seriesModel !== null && seriesModel instanceof UpdateSeriesModel) {
      this.store.dispatch(new Series.Update(seriesModel));
    }
  }

  onCancelledMarkSeriesCompleted(): void {
    this.showMarkSeriesCompletedConfirmation.set(false);
    this.seriesModel.set(null);
  }

  onDeleteSeries(series: SeriesModel): void {
    this.seriesModel.set(series);
    this.showDeleteSeriesConfirmation.set(true);
  }

  onConfirmedDeleteSeries(): void {
    const seriesModel = this.seriesModel();
    if (seriesModel !== null && seriesModel instanceof SeriesModel) {
      this.store.dispatch(new Series.Delete(seriesModel.id));
    }
  }

  onCancelledDeleteSeries(): void {
    this.showDeleteSeriesConfirmation.set(false);
    this.seriesModel.set(null);
  }

  onEditVolume(volume: VolumeModel): void {
    this.volumeModel.set(new UpdateVolumeModel(volume));
    this.allSeriesForAddingVolume.set([volume.series]);
    this.showVolumeFormModal.set(true);
  }

  onDeleteVolume(volume: VolumeModel): void {
    this.volumeModel.set(volume);
    this.showDeleteVolumeConfirmation.set(true);
  }

  onConfirmedDeleteVolume(): void {
    const volumeModel = this.volumeModel();
    if (volumeModel !== undefined && volumeModel instanceof VolumeModel) {
      this.store.dispatch(new Volumes.Delete(volumeModel.id));
    }
  }

  onCancelledDeleteVolume(): void {
    this.showDeleteVolumeConfirmation.set(false);
    this.volumeModel.set(null);
  }

  onCloseSeriesModal(): void {
    this.showSeriesFormModal.set(false);
    this.errors.set([]);
  }

  onCloseVolumeModal(): void {
    this.showVolumeFormModal.set(false);
    this.errors.set([]);
  }

  onDismissError(error: BaseError): void {
    this.errors.update((currentErrors) => currentErrors.filter((e) => e !== error));
  }
}
