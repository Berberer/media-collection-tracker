import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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

import { BaseError, markAsHandled } from '../../../../core/errors';
import { TitleService } from '../../../../core/services/title.service';
import { CreateSeriesTagModel } from '../../../../features/tags/model/create.series-tag.model';
import { SeriesTagModel } from '../../../../features/tags/model/series-tag.model';
import { SeriesTags } from '../../../../features/tags/state/tags.state.actions';
import { TagsStateSelectors } from '../../../../features/tags/state/tags.state.selectors';
import { ConfirmationPromptComponent } from '../../../components/core/confirmation-prompt/confirmation-prompt.component';
import { ModalDialogComponent } from '../../../components/core/modal-dialog/modal-dialog.component';
import { TagBadgeComponent } from '../../../components/tags/tag-badge/tag-badge.component';
import {
  TagCreationFormComponent,
  TagType,
} from '../../../components/tags/tag-creation-form/tag-creation-form.component';

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
  private readonly title = inject(TitleService);

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

  readonly errors = signal<BaseError[]>([]);

  constructor() {
    this.title.setTitleByTranslation('titles.tags.series');
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
      .subscribe(() => {
        this.savingSeriesTag.set(true);
        this.errors.set([]);
      });

    this.actions$
      .pipe(ofActionCompleted(SeriesTags.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingSeriesTag.set(false));

    this.actions$
      .pipe(ofActionSuccessful(SeriesTags.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showSeriesTagFormModal.set(false);
        this.errors.set([]);
      });

    this.actions$
      .pipe(ofActionErrored(SeriesTags.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(({ result }) => {
        this.savingSeriesTag.set(false);
        if (result.error && result.error instanceof BaseError) {
          markAsHandled(result.error);
          this.errors.set([result.error]);
        }
      });
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
    this.errors.set([]);
  }

  onCreateSeriesTag(): void {
    this.showSeriesTagFormModal.set(true);
    this.errors.set([]);
  }

  onDismissError(error: BaseError): void {
    this.errors.update((currentErrors) => currentErrors.filter((e) => e !== error));
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
