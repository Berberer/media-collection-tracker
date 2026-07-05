import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  Actions,
  ofActionCompleted,
  ofActionDispatched,
  ofActionErrored,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { filter, Subject, takeUntil } from 'rxjs';

import { AppRoutes } from '../../../../app.routes';
import { BaseError, markAsHandled } from '../../../../core/errors';
import { TitleService } from '../../../../core/services/title.service';
import { CreateSeriesModel } from '../../../../features/series/model/create.series.model';
import { CreateSeriesVolumeModel } from '../../../../features/series/model/create.series-volume.model';
import { SeriesModel } from '../../../../features/series/model/series.model';
import { UpdateSeriesModel } from '../../../../features/series/model/update.series.model';
import { Series } from '../../../../features/series/state/series.state.actions';
import { SeriesStateSelectors } from '../../../../features/series/state/series.state.selectors';
import { SeriesTags, VolumeTags } from '../../../../features/tags/state/tags.state.actions';
import { TagsStateSelectors } from '../../../../features/tags/state/tags.state.selectors';
import { CreateVolumeModel } from '../../../../features/volumes/model/create.volume.model';
import { UpdateVolumeModel } from '../../../../features/volumes/model/update.volume.model';
import { ConfirmationPromptComponent } from '../../../components/core/confirmation-prompt/confirmation-prompt.component';
import { ModalDialogComponent } from '../../../components/core/modal-dialog/modal-dialog.component';
import { SeriesViewMode } from '../../../components/series/series-card/series-card.component';
import { SeriesCardsGalleryComponent } from '../../../components/series/series-cards-gallery/series-cards-gallery.component';
import { SeriesFormComponent } from '../../../components/series/series-form/series-form.component';
import { VolumeFormComponent } from '../../../components/volumes/volume-form/volume-form.component';

@Component({
  selector: 'app-incomplete-series-page',
  templateUrl: './incomplete-series.page.html',
  styleUrl: './incomplete-series.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslatePipe,
    ModalDialogComponent,
    SeriesFormComponent,
    ConfirmationPromptComponent,
    VolumeFormComponent,
    SeriesCardsGalleryComponent,
  ],
})
export class IncompleteSeriesPage implements OnInit, OnDestroy {
  private readonly title = inject(TitleService);
  private readonly router = inject(Router);

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly ngUnsubscribe = new Subject<void>();

  readonly seriesTags$ = this.store.select(TagsStateSelectors.seriesTags);
  readonly volumeTags$ = this.store.select(TagsStateSelectors.volumeTags);
  readonly incompleteSeries$ = this.store.select(SeriesStateSelectors.incompleteSeries);

  readonly seriesViewMode = SeriesViewMode.INCOMPLETE;

  readonly loadingSeriesTags = signal(false);
  readonly loadingVolumeTags = signal(false);
  readonly loadingSeries = signal(false);

  readonly seriesModel = signal<SeriesModel | UpdateSeriesModel | null>(null);
  readonly savingSeries = signal(false);
  readonly deletingSeries = signal(false);
  readonly showSeriesFormModal = signal(false);

  readonly volumeModel = signal<CreateVolumeModel | null>(null);
  readonly allSeriesForAddingVolume = signal<readonly SeriesModel[] | null>(null);
  readonly savingVolume = signal(false);
  readonly showVolumeFormModal = signal(false);

  readonly showDeleteSeriesConfirmation = signal(false);

  readonly errors = signal<BaseError[]>([]);

  constructor() {
    this.title.setTitleByTranslation('titles.series.incomplete');
  }

  ngOnInit(): void {
    this.setUpGetSeriesTagsActionHandlers();
    this.setUpGetVolumeTagsActionHandlers();
    this.setUpGetIncompleteSeriesActionHandlers();
    this.setUpUpdateSeriesActionHandlers();
    this.setUpAddVolumeToSeriesActionHandlers();
    this.setUpDeleteSeriesActionHandlers();

    this.store.dispatch([SeriesTags.GetAll, VolumeTags.GetAll, new Series.GetIncomplete()]);
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

  private setUpGetIncompleteSeriesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Series.GetIncomplete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingSeries.set(true));

    this.actions$
      .pipe(ofActionCompleted(Series.GetIncomplete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingSeries.set(false));
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
      .subscribe((update) => {
        this.showSeriesFormModal.set(false);
        this.seriesModel.set(null);

        if (update.updateModel.completed) {
          this.store.dispatch(new Series.GetIncomplete());
        }
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
      });
  }

  onCloseSeriesModal(): void {
    this.showSeriesFormModal.set(false);
    this.errors.set([]);
  }

  onDismissError(error: BaseError): void {
    this.errors.update((currentErrors) => currentErrors.filter((e) => e !== error));
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

  onCloseVolumeModal(): void {
    this.showVolumeFormModal.set(false);
    this.errors.set([]);
  }

  onAddVolume(series: SeriesModel): void {
    this.store.dispatch(VolumeTags.GetAll);

    this.volumeModel.set(CreateVolumeModel.createNextSeriesVolume(series));
    this.allSeriesForAddingVolume.set([series]);
    this.showVolumeFormModal.set(true);
  }

  onSaveVolume(volume: CreateVolumeModel | UpdateVolumeModel): void {
    if (volume instanceof CreateVolumeModel) {
      this.store.dispatch(
        new Series.AddVolumeToSeries(volume.series, new CreateSeriesVolumeModel(volume)),
      );
    }
  }

  onDeleteSeries(series: SeriesModel): void {
    this.seriesModel.set(series);
    this.showDeleteSeriesConfirmation.set(true);
  }

  onConfirmedDeleteSeries(): void {
    const seriesModel = this.seriesModel();
    if (seriesModel !== undefined && seriesModel instanceof SeriesModel) {
      this.store.dispatch(new Series.Delete(seriesModel.id));
    }
  }

  onCancelledDeleteSeries(): void {
    this.showDeleteSeriesConfirmation.set(false);
    this.seriesModel.set(null);
  }

  async onViewSeriesDetails(series: SeriesModel): Promise<void> {
    await this.router.navigate([AppRoutes.Series, series.id]);
  }
}
