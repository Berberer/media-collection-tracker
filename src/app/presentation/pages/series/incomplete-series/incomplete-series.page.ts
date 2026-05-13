import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  Actions,
  ofActionCompleted,
  ofActionDispatched,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { SeriesModel } from '../../../../features/series/model/series.model';
import { SeriesStateSelectors } from '../../../../features/series/state/series.state.selectors';
import { Series } from '../../../../features/series/state/series.state.actions';
import { SeriesFormComponent } from '../../../components/series/series-form/series-form.component';
import { CreateSeriesModel } from '../../../../features/series/model/create.series.model';
import { UpdateSeriesModel } from '../../../../features/series/model/update.series.model';
import { ModalDialogComponent } from '../../../components/core/modal-dialog/modal-dialog.component';
import { environment } from '../../../../../environments/environment';
import { SeriesViewMode } from '../../../components/series/series-card/series-card.component';
import { TagsStateSelectors } from '../../../../features/tags/state/tags.state.selectors';
import { SeriesMediaTypes } from '../../../../features/series/model/media-type.model';
import { SeriesTags, VolumeTags } from '../../../../features/tags/state/tags.state.actions';
import { ConfirmationPromptComponent } from '../../../components/core/confirmation-prompt/confirmation-prompt.component';
import { VolumeFormComponent } from '../../../components/volumes/volume-form/volume-form.component';
import { CreateVolumeModel } from '../../../../features/volumes/model/create.volume.model';
import { UpdateVolumeModel } from '../../../../features/volumes/model/update.volume.model';
import { CreateSeriesVolumeModel } from '../../../../features/series/model/create.series-volume.model';
import { SeriesCardsGalleryComponent } from '../../../components/series/series-cards-gallery/series-cards-gallery.component';

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
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

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
  readonly selectedMediaType = signal<SeriesMediaTypes.SeriesMediaType | null>(null);

  constructor() {
    this.translate
      .get('titles.series.incomplete', { applicationName: environment.appTitle })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((title: string) => this.title.setTitle(title));
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
      .subscribe(() => this.savingSeries.set(true));

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
  }

  private setUpAddVolumeToSeriesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Series.AddVolumeToSeries), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingVolume.set(true));

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

  onMediaTypeFilterChange(mediaType: SeriesMediaTypes.SeriesMediaType | null): void {
    this.selectedMediaType.set(mediaType);
    if (mediaType !== null) {
      this.store.dispatch(new Series.GetIncomplete(mediaType));
    } else {
      this.store.dispatch(new Series.GetIncomplete());
    }
  }
}
