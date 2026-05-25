import { CommonModule } from '@angular/common';
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
import { ModalDialogComponent } from '../../../components/core/modal-dialog/modal-dialog.component';
import { SortDirection } from '../../../components/core/sort-button/sort-button.component';
import { PurchaseMethodDialogComponent } from '../../../components/volumes/purchase-method-dialog/purchase-method-dialog.component';
import { VolumeFormComponent } from '../../../components/volumes/volume-form/volume-form.component';
import { SortableColumn } from '../../../components/volumes/volumes-table/services/volumes-table-data.service';
import {
  VolumesTableComponent,
  VolumeViewMode,
} from '../../../components/volumes/volumes-table/volumes-table.component';

@Component({
  selector: 'app-volumes-tracking-dashboard-page',
  templateUrl: './volumes-tracking-dashboard.page.html',
  styleUrl: './volumes-tracking-dashboard.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    VolumesTableComponent,
    TranslatePipe,
    ConfirmationPromptComponent,
    ModalDialogComponent,
    PurchaseMethodDialogComponent,
    VolumeFormComponent,
  ],
})
export class VolumesTrackingDashboardPage implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  private readonly ngUnsubscribe = new Subject<void>();

  readonly volumeTags$ = this.store.select(TagsStateSelectors.volumeTags);
  readonly inDeliveryVolumes$ = this.store.select(VolumesStateSelectors.inDeliveryVolumes);
  readonly releasedVolumes$ = this.store.select(VolumesStateSelectors.releasedVolumes);
  readonly upcomingVolumes$ = this.store.select(VolumesStateSelectors.upcomingVolumes);
  readonly upcomingVolumes = toSignal(this.upcomingVolumes$, { initialValue: [] });

  readonly VolumeViewMode = VolumeViewMode;
  readonly SortableColumn = SortableColumn;
  readonly SortDirection = SortDirection;

  readonly volume = signal<VolumeModel | null>(null);
  readonly volumeToUpdate = signal<UpdateVolumeModel | null>(null);
  readonly allSeriesForAddingVolume = signal<SeriesModel[] | null>(null);
  readonly volumeToMarkAsBought = signal<VolumeModel | null>(null);

  readonly loadingVolumeTags = signal(false);
  readonly loadingInDeliveryVolumes = signal(false);
  readonly loadingReleasedVolumes = signal(false);
  readonly loadingUpcomingVolumes = signal(false);

  readonly deletingVolume = signal(false);
  readonly savingVolume = signal(false);

  readonly showDeleteVolumeConfirmation = signal(false);
  readonly showMarkAsDeliveredConfirmation = signal(false);
  readonly showMarkAsBoughtConfirmation = signal(false);

  readonly showPurchaseMethodDialog = signal(false);
  readonly showVolumeFormDialog = signal(false);

  readonly volumeToDelete = signal<VolumeModel | null>(null);
  readonly volumeToMarkAsDelivered = signal<VolumeModel | null>(null);

  readonly selectedUpcomingTimeframe = signal<number | null>(null);

  readonly filteredUpcomingVolumes = computed(() => {
    const timeframeDays = this.selectedUpcomingTimeframe();

    if (timeframeDays !== null) {
      const maxReleaseDate = new Date();
      maxReleaseDate.setDate(maxReleaseDate.getDate() + timeframeDays);

      return this.upcomingVolumes().filter(
        (volume) => volume.releaseDate !== null && volume.releaseDate <= maxReleaseDate,
      );
    } else {
      return this.upcomingVolumes();
    }
  });

  constructor() {
    this.translate
      .get('titles.volumes.tracking-dashboard', { applicationName: environment.appTitle })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((title: string) => this.title.setTitle(title));
  }

  ngOnInit(): void {
    this.setUpGetVolumeTagsActionHandlers();
    this.setUpGetInDeliveryVolumesActionHandlers();
    this.setUpGetReleasedVolumesActionHandlers();
    this.setUpGetUpcomingVolumesActionHandlers();
    this.setUpDeleteVolumeActionHandlers();
    this.setUpUpdateVolumeActionHandlers();

    this.store.dispatch([
      VolumeTags.GetAll,
      Volumes.GetInDelivery,
      Volumes.GetReleased,
      Volumes.GetUpcoming,
    ]);
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

  private setUpGetInDeliveryVolumesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.GetInDelivery), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingInDeliveryVolumes.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.GetInDelivery), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingInDeliveryVolumes.set(false));
  }

  private setUpGetReleasedVolumesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.GetReleased), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingReleasedVolumes.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.GetReleased), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingReleasedVolumes.set(false));
  }

  private setUpGetUpcomingVolumesActionHandlers(): void {
    this.actions$
      .pipe(ofActionDispatched(Volumes.GetUpcoming), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingUpcomingVolumes.set(true));

    this.actions$
      .pipe(ofActionCompleted(Volumes.GetUpcoming), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.loadingUpcomingVolumes.set(false));
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
        this.showPurchaseMethodDialog.set(false);
        this.showVolumeFormDialog.set(false);
        this.showMarkAsDeliveredConfirmation.set(false);
        this.volumeToUpdate.set(null);
        this.volumeToMarkAsDelivered.set(null);
        this.volumeToMarkAsBought.set(null);
        this.allSeriesForAddingVolume.set(null);
      });
  }

  onVolumeMarkedAsDelivered(volume: VolumeModel): void {
    this.volumeToMarkAsDelivered.set(volume);
    this.showMarkAsDeliveredConfirmation.set(true);
  }

  onVolumeMarkedAsBought(volume: VolumeModel): void {
    this.volumeToMarkAsBought.set(volume);
    this.showPurchaseMethodDialog.set(true);
  }

  onConfirmedMarkVolumeAsBought(purchaseData: { purchaseDate: Date; inDelivery: boolean }): void {
    const volume = this.volumeToMarkAsBought();
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
    this.volumeToMarkAsBought.set(null);
  }

  onUpcomingTimeframeChange(days: number | null): void {
    this.selectedUpcomingTimeframe.set(days);
  }

  confirmMarkAsDelivered(): void {
    const volume = this.volumeToMarkAsDelivered();
    if (volume) {
      const updateModel = new UpdateVolumeModel({
        ...volume,
        inDelivery: false,
      });
      this.store.dispatch(new Volumes.Update(updateModel));
    }
  }

  cancelMarkAsDelivered(): void {
    this.showMarkAsDeliveredConfirmation.set(false);
    this.volumeToMarkAsDelivered.set(null);
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

  onVolumeEdited(volume: VolumeModel): void {
    this.volumeToUpdate.set(new UpdateVolumeModel(volume));
    this.allSeriesForAddingVolume.set([volume.series]);
    this.showVolumeFormDialog.set(true);
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

  onCancelledEditVolume(): void {
    this.showVolumeFormDialog.set(false);
    this.volumeToUpdate.set(null);
    this.allSeriesForAddingVolume.set(null);
  }

  onVolumeSaved(savedVolume: CreateVolumeModel | UpdateVolumeModel): void {
    if (savedVolume instanceof UpdateVolumeModel) {
      this.store.dispatch(new Volumes.Update(savedVolume));
    }
  }
}
