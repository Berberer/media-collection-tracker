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
import {
  Actions,
  ofActionCompleted,
  ofActionDispatched,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ModalDialogComponent } from '../../../components/core/modal-dialog/modal-dialog.component';
import {
  TagCreationFormComponent,
  TagType,
} from '../../../components/tags/tag-creation-form/tag-creation-form.component';
import { TagsStateSelectors } from '../../../../features/tags/state/tags.state.selectors';
import { TagBadgeComponent } from '../../../components/tags/tag-badge/tag-badge.component';
import { SeriesTags } from '../../../../features/tags/state/tags.state.actions';
import { SeriesTagModel } from '../../../../features/tags/model/series-tag.model';
import { CreateSeriesTagModel } from '../../../../features/tags/model/create.series-tag.model';
import { ConfirmationPromptComponent } from '../../../components/core/confirmation-prompt/confirmation-prompt.component';

@Component({
  selector: 'app-series-tags-page',
  templateUrl: './series-tags.page.html',
  styleUrl: './series-tags.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslatePipe,
    ModalDialogComponent,
    TagCreationFormComponent,
    TagBadgeComponent,
    ConfirmationPromptComponent,
  ],
})
export class SeriesTagsPage implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly ngUnsubscribe = new Subject<void>();

  readonly seriesTags$ = this.store.select(TagsStateSelectors.seriesTags);

  readonly tagType = TagType.SERIES;

  readonly seriesTag = signal<SeriesTagModel | null>(null);

  readonly loadingSeriesTags = signal(false);
  readonly savingSeriesTag = signal(false);
  readonly deletingSeriesTag = signal(false);

  readonly showSeriesTagFormModal = signal(false);
  readonly showDeleteSeriesTagConfirmation = signal(false);

  constructor() {
    this.translate
      .get('titles.tags.series', { applicationName: environment.appTitle })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((title: string) => this.title.setTitle(title));
  }

  ngOnInit(): void {
    this.setUpGetAllSeriesTagsActionHandlers();
    this.setUpCreateSeriesTagActionHandlers();
    this.setUpDeleteSeriesTagActionHandlers();

    this.store.dispatch(SeriesTags.GetAll);
  }

  private setUpGetAllSeriesTagsActionHandlers(): void {
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

  private setUpCreateSeriesTagActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(SeriesTags.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingSeriesTag.set(true));

    this.actions$
      .pipe(ofActionCompleted(SeriesTags.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingSeriesTag.set(false));

    this.actions$
      .pipe(ofActionSuccessful(SeriesTags.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.showSeriesTagFormModal.set(false));
  }

  private setUpDeleteSeriesTagActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(SeriesTags.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingSeriesTag.set(true));

    this.actions$
      .pipe(ofActionCompleted(SeriesTags.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingSeriesTag.set(false));

    this.actions$
      .pipe(ofActionSuccessful(SeriesTags.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showDeleteSeriesTagConfirmation.set(false);
        this.seriesTag.set(null);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onCloseSeriesTagModal(): void {
    this.showSeriesTagFormModal.set(false);
  }

  onCreateSeriesTag(): void {
    this.showSeriesTagFormModal.set(true);
  }

  onSaveSeriesTag(tag: CreateSeriesTagModel): void {
    this.store.dispatch(new SeriesTags.Create(tag));
  }

  onDeleteSeriesTag(tag: SeriesTagModel): void {
    this.seriesTag.set(tag);
    this.showDeleteSeriesTagConfirmation.set(true);
  }

  onConfirmedDeleteSeriesTag(): void {
    const seriesTag = this.seriesTag();
    if (seriesTag) {
      this.store.dispatch(new SeriesTags.Delete(seriesTag.id));
    }
  }

  onCancelledDeleteSeriesTag(): void {
    this.showDeleteSeriesTagConfirmation.set(false);
    this.seriesTag.set(null);
  }
}
