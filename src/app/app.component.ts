import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCodeBracketSolid } from '@ng-icons/heroicons/solid';
import {
  Actions,
  ofActionCompleted,
  ofActionDispatched,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { filter, Subject, takeUntil } from 'rxjs';

import { environment } from '../environments/environment';
import { CreateSeriesModel } from './features/series/model/create.series.model';
import { SeriesMediaTypes } from './features/series/model/media-type.model';
import { UpdateSeriesModel } from './features/series/model/update.series.model';
import { Series } from './features/series/state/series.state.actions';
import { SeriesStateSelectors } from './features/series/state/series.state.selectors';
import { SeriesTags, VolumeTags } from './features/tags/state/tags.state.actions';
import { TagsStateSelectors } from './features/tags/state/tags.state.selectors';
import { CreateVolumeModel } from './features/volumes/model/create.volume.model';
import { UpdateVolumeModel } from './features/volumes/model/update.volume.model';
import { Volumes } from './features/volumes/state/volumes.state.actions';
import { ModalDialogComponent } from './presentation/components/core/modal-dialog/modal-dialog.component';
import { NavBarComponent } from './presentation/components/core/nav-bar/nav-bar.component';
import { SeriesFormComponent } from './presentation/components/series/series-form/series-form.component';
import { VolumeFormComponent } from './presentation/components/volumes/volume-form/volume-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    NavBarComponent,
    AsyncPipe,
    ModalDialogComponent,
    SeriesFormComponent,
    VolumeFormComponent,
    NgIcon,
  ],
  providers: [provideIcons({ heroCodeBracketSolid })],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly ngUnsubscribe = new Subject<void>();

  readonly series$ = this.store.select(SeriesStateSelectors.series);
  readonly seriesTags$ = this.store.select(TagsStateSelectors.seriesTags);
  readonly volumeTags$ = this.store.select(TagsStateSelectors.volumeTags);

  readonly loadingSeries = signal(false);
  readonly loadingSeriesTags = signal(false);
  readonly loadingVolumeTags = signal(false);

  readonly savingSeries = signal(false);
  readonly savingVolume = signal(false);

  readonly showSeriesCreationForm = signal(false);
  readonly showVolumeCreationForm = signal(false);

  readonly seriesCreationData = signal<CreateSeriesModel | null>(null);
  readonly volumeCreationData = signal<Partial<CreateVolumeModel> | null>(null);

  get appTitle(): string {
    return environment.appTitle;
  }

  get version(): string {
    return environment.version;
  }

  ngOnInit(): void {
    this.setUpGetSeriesActionHandlers();
    this.setUpGetSeriesTagsActionHandlers();
    this.setUpGetVolumeTagsActionHandlers();
    this.setUpCreateSeriesActionHandlers();
    this.setUpCreateVolumeActionHandlers();
  }

  private setUpGetSeriesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Series.GetAll), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingSeries.set(true));

    this.actions$
      .pipe(ofActionCompleted(Series.GetAll), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingSeries.set(false));
  }

  private setUpGetSeriesTagsActionHandlers(): void {
    this.actions$
      .pipe(
        ofActionDispatched(SeriesTags.GetAll),
        filter(({ globalEvent }) => globalEvent),
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
        filter(({ globalEvent }) => globalEvent),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => this.loadingVolumeTags.set(true));

    this.actions$
      .pipe(ofActionCompleted(VolumeTags.GetAll), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingVolumeTags.set(false));
  }

  private setUpCreateSeriesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Series.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingSeries.set(true));

    this.actions$
      .pipe(ofActionCompleted(Series.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingSeries.set(false));

    this.actions$
      .pipe(ofActionSuccessful(Series.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showSeriesCreationForm.set(false);
        this.seriesCreationData.set(null);
      });
  }

  private setUpCreateVolumeActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingVolume.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingVolume.set(false));

    this.actions$
      .pipe(ofActionSuccessful(Volumes.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showVolumeCreationForm.set(false);
        this.volumeCreationData.set(null);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onCreateSeries(): void {
    this.store.dispatch(new SeriesTags.GetAll(true));
    this.store.dispatch(new VolumeTags.GetAll(true));

    this.seriesCreationData.set(
      new CreateSeriesModel({
        name: '',
        singleVolume: false,
        completed: false,
        mediaType: SeriesMediaTypes.SeriesMediaType.BOOK,
        seriesTags: [],
        volumeModel: null,
      }),
    );
    this.showSeriesCreationForm.set(true);
  }

  onCancelCreateSeries(): void {
    this.showSeriesCreationForm.set(false);
    this.seriesCreationData.set(null);
  }

  onSaveSeries(series: CreateSeriesModel | UpdateSeriesModel): void {
    if (series instanceof CreateSeriesModel) {
      this.store.dispatch(new Series.Create(series));
    }
  }

  onCreateVolume(): void {
    this.store.dispatch(new VolumeTags.GetAll(true));
    this.store.dispatch(Series.GetAll);

    this.volumeCreationData.set({});
    this.showVolumeCreationForm.set(true);
  }

  onCancelCreateVolume(): void {
    this.showVolumeCreationForm.set(false);
    this.volumeCreationData.set(null);
  }

  onSaveVolume(volumeData: CreateVolumeModel | UpdateVolumeModel): void {
    if (volumeData instanceof CreateVolumeModel) {
      this.store.dispatch(new Volumes.Create(volumeData));
    }
  }
}
