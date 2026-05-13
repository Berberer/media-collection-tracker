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
import { VolumeModel } from '../../../../features/volumes/model/volume.model';
import { Volumes } from '../../../../features/volumes/state/volumes.state.actions';
import { VolumesStateSelectors } from '../../../../features/volumes/state/volumes.state.selectors';
import { VolumeTagModel } from '../../../../features/tags/model/volume-tag.model';
import { TagsStateSelectors } from '../../../../features/tags/state/tags.state.selectors';
import { VolumeTags } from '../../../../features/tags/state/tags.state.actions';
import { ConfirmationPromptComponent } from '../../../components/core/confirmation-prompt/confirmation-prompt.component';
import { PurchaseMethodDialogComponent } from '../../../components/volumes/purchase-method-dialog/purchase-method-dialog.component';
import {
  VolumesTableComponent,
  VolumeViewMode,
} from '../../../components/volumes/volumes-table/volumes-table.component';
import { VolumeFormComponent } from '../../../components/volumes/volume-form/volume-form.component';
import { ModalDialogComponent } from '../../../components/core/modal-dialog/modal-dialog.component';
import { UpdateVolumeModel } from '../../../../features/volumes/model/update.volume.model';
import { CreateVolumeModel } from '../../../../features/volumes/model/create.volume.model';
import { SortableColumn } from '../../../components/volumes/volumes-table/services/volumes-table-data.service';
import { SortDirection } from '../../../components/core/sort-button/sort-button.component';
import { SeriesModel } from '../../../../features/series/model/series.model';

@Component({
  selector: 'app-missing-volumes-page',
  templateUrl: './missing-volumes.page.html',
  styleUrl: './missing-volumes.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslatePipe,
    ConfirmationPromptComponent,
    PurchaseMethodDialogComponent,
    VolumesTableComponent,
    VolumeFormComponent,
    ModalDialogComponent,
  ],
})
export class MissingVolumesPage implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly ngUnsubscribe = new Subject<void>();

  readonly volumeTags$ = this.store.select(TagsStateSelectors.volumeTags);
  readonly missingVolumes$ = this.store.select(VolumesStateSelectors.missingVolumes);

  readonly SortableColumn = SortableColumn;
  readonly SortDirection = SortDirection;

  readonly volumeViewMode = VolumeViewMode.NOT_BOUGHT;

  readonly volume = signal<VolumeModel | null>(null);
  readonly volumeToUpdate = signal<UpdateVolumeModel | null>(null);
  readonly allSeriesForAddingVolume = signal<readonly SeriesModel[] | null>(null);

  readonly loadingVolumeTags = signal(false);
  readonly loadingMissingVolumes = signal(false);
  readonly deletingVolume = signal(false);
  readonly savingVolume = signal(false);

  readonly showDeleteVolumeConfirmation = signal(false);
  readonly showPurchaseMethodDialog = signal(false);
  readonly showVolumeFormDialog = signal(false);

  constructor() {
    this.translate
      .get('titles.volumes.missing', { applicationName: environment.appTitle })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((title: string) => this.title.setTitle(title));
  }

  ngOnInit(): void {
    this.setUpGetVolumeTagsActionHandlers();
    this.setUpGetMissingVolumesActionHandlers();
    this.setUpDeleteVolumeActionHandlers();
    this.setUpUpdateVolumeActionHandlers();

    this.store.dispatch([VolumeTags.GetAll, Volumes.GetMissing]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  private setUpGetMissingVolumesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.GetMissing), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingMissingVolumes.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.GetMissing), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingMissingVolumes.set(false));
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
        this.volume.set(null);
        this.allSeriesForAddingVolume.set(null);
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
        this.showPurchaseMethodDialog.set(false);
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
    this.volume.set(volume);
    this.showDeleteVolumeConfirmation.set(true);
  }

  onConfirmedDeleteVolume(): void {
    const volume = this.volume();
    if (volume) {
      this.store.dispatch(new Volumes.Delete(volume.id));
    }
  }

  onCancelledDeleteVolume(): void {
    this.showDeleteVolumeConfirmation.set(false);
    this.volume.set(null);
    this.allSeriesForAddingVolume.set(null);
  }

  onMarkVolumeAsBought(volume: VolumeModel): void {
    this.volume.set(volume);
    this.showPurchaseMethodDialog.set(true);
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

  onConfirmedMarkVolumeAsBought(purchaseData: { purchaseDate: Date; inDelivery: boolean }): void {
    const volume = this.volume();
    if (volume) {
      this.store.dispatch(
        new Volumes.Update({
          ...volume,
          purchaseDate: purchaseData.purchaseDate,
          inDelivery: purchaseData.inDelivery,
        }),
      );
    }
  }

  onCancelledMarkVolumeAsBought(): void {
    this.showPurchaseMethodDialog.set(false);
    this.volume.set(null);
  }
}
