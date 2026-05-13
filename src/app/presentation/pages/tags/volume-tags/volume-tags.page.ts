import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  Actions,
  ofActionCompleted,
  ofActionDispatched,
  ofActionSuccessful,
  Store,
} from '@ngxs/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { ModalDialogComponent } from '../../../components/core/modal-dialog/modal-dialog.component';
import {
  TagCreationFormComponent,
  TagType,
} from '../../../components/tags/tag-creation-form/tag-creation-form.component';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { TagsStateSelectors } from '../../../../features/tags/state/tags.state.selectors';
import { CreateVolumeTagModel } from '../../../../features/tags/model/create.volume-tag.model';
import { TagBadgeComponent } from '../../../components/tags/tag-badge/tag-badge.component';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { VolumeTags } from '../../../../features/tags/state/tags.state.actions';
import { ConfirmationPromptComponent } from '../../../components/core/confirmation-prompt/confirmation-prompt.component';

@Component({
  selector: 'app-volume-tags-page',
  templateUrl: './volume-tags.page.html',
  styleUrl: './volume-tags.page.css',
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
export class VolumeTagsPage implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly ngUnsubscribe = new Subject<void>();

  readonly volumeTags$ = this.store.select(TagsStateSelectors.volumeTags);

  readonly tagType = TagType.VOLUME;

  readonly volumeTag = signal<VolumeTagModel | null>(null);

  readonly loadingVolumeTags = signal(false);
  readonly savingVolumeTag = signal(false);
  readonly deletingVolumeTag = signal(false);

  readonly showVolumeTagFormModal = signal(false);
  readonly showDeleteVolumeTagConfirmation = signal(false);

  constructor() {
    this.translate
      .get('titles.tags.volume', { applicationName: environment.appTitle })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((title: string) => this.title.setTitle(title));
  }

  ngOnInit(): void {
    this.setUpGetAllVolumeTagsActionHandlers();
    this.setUpCreateVolumeTagActionHandlers();
    this.setUpDeleteVolumeTagActionHandlers();

    this.store.dispatch(VolumeTags.GetAll);
  }

  private setUpGetAllVolumeTagsActionHandlers(): void {
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

  private setUpCreateVolumeTagActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(VolumeTags.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingVolumeTag.set(true));

    this.actions$
      .pipe(ofActionCompleted(VolumeTags.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.savingVolumeTag.set(false));

    this.actions$
      .pipe(ofActionSuccessful(VolumeTags.Create), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.showVolumeTagFormModal.set(false));
  }

  private setUpDeleteVolumeTagActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(VolumeTags.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingVolumeTag.set(true));

    this.actions$
      .pipe(ofActionCompleted(VolumeTags.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.deletingVolumeTag.set(false));

    this.actions$
      .pipe(ofActionSuccessful(VolumeTags.Delete), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.showDeleteVolumeTagConfirmation.set(false);
        this.volumeTag.set(null);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onCloseVolumeTagModal(): void {
    this.showVolumeTagFormModal.set(false);
  }

  onCreateVolumeTag(): void {
    this.showVolumeTagFormModal.set(true);
  }

  onSaveVolumeTag(tag: CreateVolumeTagModel): void {
    this.store.dispatch(new VolumeTags.Create(tag));
  }

  onDeleteVolumeTag(tag: VolumeTagModel): void {
    this.volumeTag.set(tag);
    this.showDeleteVolumeTagConfirmation.set(true);
  }

  onConfirmedDeleteVolumeTag(): void {
    const volumeTag = this.volumeTag();
    if (volumeTag) {
      this.store.dispatch(new VolumeTags.Delete(volumeTag.id));
    }
  }

  onCancelledDeleteVolumeTag(): void {
    this.showDeleteVolumeTagConfirmation.set(false);
    this.volumeTag.set(null);
  }
}
