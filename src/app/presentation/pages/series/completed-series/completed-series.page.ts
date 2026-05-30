import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  Actions,
  ofActionCompleted,
  ofActionDispatched,
  ofActionErrored,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { filter, Subject, takeUntil } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { BaseError } from '../../../../core/errors';
import { CreateSeriesModel } from '../../../../features/series/model/create.series.model';
import { SeriesModel } from '../../../../features/series/model/series.model';
import { UpdateSeriesModel } from '../../../../features/series/model/update.series.model';
import { Series } from '../../../../features/series/state/series.state.actions';
import { SeriesStateSelectors } from '../../../../features/series/state/series.state.selectors';
import { SeriesTags, VolumeTags } from '../../../../features/tags/state/tags.state.actions';
import { TagsStateSelectors } from '../../../../features/tags/state/tags.state.selectors';
import { ConfirmationPromptComponent } from '../../../components/core/confirmation-prompt/confirmation-prompt.component';
import { ModalDialogComponent } from '../../../components/core/modal-dialog/modal-dialog.component';
import { SeriesViewMode } from '../../../components/series/series-card/series-card.component';
import { SeriesCardsGalleryComponent } from '../../../components/series/series-cards-gallery/series-cards-gallery.component';
import { SeriesFormComponent } from '../../../components/series/series-form/series-form.component';

@Component({
  selector: 'app-completed-series-page',
  templateUrl: './completed-series.page.html',
  styleUrl: './completed-series.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslatePipe,
    ConfirmationPromptComponent,
    ModalDialogComponent,
    SeriesFormComponent,
    SeriesCardsGalleryComponent,
  ],
})
export class CompletedSeriesPage implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly ngUnsubscribe = new Subject<void>();

  readonly seriesTags$ = this.store.select(TagsStateSelectors.seriesTags);
  readonly volumeTags$ = this.store.select(TagsStateSelectors.volumeTags);
  readonly completedSeries$ = this.store.select(SeriesStateSelectors.completedSeries);

  readonly seriesViewMode = SeriesViewMode.COMPLETED;

  readonly loadingSeriesTags = signal(false);
  readonly loadingVolumeTags = signal(false);
  readonly loadingSeries = signal(false);

  readonly seriesModel = signal<SeriesModel | UpdateSeriesModel | null>(null);
  readonly savingSeries = signal(false);
  readonly deletingSeries = signal(false);
  readonly showSeriesFormModal = signal(false);

  readonly showDeleteSeriesConfirmation = signal(false);

  readonly errors = signal<BaseError[]>([]);

  constructor() {
    this.translate
      .get('titles.series.completed', { applicationName: environment.appTitle })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((title: string) => this.title.setTitle(title));
  }

  ngOnInit(): void {
    this.setUpGetSeriesTagsActionHandlers();
    this.setUpGetVolumeTagsActionHandlers();
    this.setUpGetCompletedSeriesActionHandlers();
    this.setUpUpdateSeriesActionHandlers();
    this.setUpDeleteSeriesActionHandlers();

    this.store.dispatch([SeriesTags.GetAll, VolumeTags.GetAll, new Series.GetCompleted()]);
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

  private setUpGetCompletedSeriesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Series.GetCompleted), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingSeries.set(true));

    this.actions$
      .pipe(ofActionCompleted(Series.GetCompleted), takeUntil(this.ngUnsubscribe))
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
          this.store.dispatch(new Series.GetCompleted());
        }
      });

    this.actions$
      .pipe(ofActionErrored(Series.Update), takeUntil(this.ngUnsubscribe))
      .subscribe(({ result }) => {
        this.savingSeries.set(false);
        if (result.error && result.error instanceof BaseError) {
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
}
