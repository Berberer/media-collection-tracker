import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { defaultVolumesState, VolumesStateModel } from './volumes.state.model';
import { GetMissingVolumeUseCase } from '../use-cases/get-missing.volume.use-case';
import { GetInDeliveryVolumeUseCase } from '../use-cases/get-in-delivery.volume.use-case';
import { GetReleasedVolumeUseCase } from '../use-cases/get-released.volume.use-case';
import { GetUpcomingVolumeUseCase } from '../use-cases/get-upcoming.volume.use-case';
import { GetCollectedVolumesUseCase } from '../use-cases/get-collected.volumes.use-case';
import { CreateVolumeUseCase } from '../use-cases/create.volume.use-case';
import { Volumes } from './volumes.state.actions';
import { UpdateVolumeUseCase } from '../use-cases/update.volume.use-case';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { DeleteVolumeUseCase } from '../use-cases/delete.volume.use-case';
import { VolumeStatusUtils } from '../utils/volume-status.utils';

@State<VolumesStateModel>({ name: 'volumes', defaults: defaultVolumesState })
@Injectable({ providedIn: 'root' })
export class VolumesState {
  private readonly getMissingVolumesUseCase = inject(GetMissingVolumeUseCase);
  private readonly getInDeliveryVolumesUseCase = inject(GetInDeliveryVolumeUseCase);
  private readonly getReleasedVolumesUseCase = inject(GetReleasedVolumeUseCase);
  private readonly getUpcomingVolumesUseCase = inject(GetUpcomingVolumeUseCase);
  private readonly getCollectedVolumesUseCase = inject(GetCollectedVolumesUseCase);
  private readonly createVolumeUseCase = inject(CreateVolumeUseCase);
  private readonly updateVolumeUseCase = inject(UpdateVolumeUseCase);
  private readonly deleteVolumeUseCase = inject(DeleteVolumeUseCase);

  @Action(Volumes.GetMissing)
  async getMissingVolumes(ctx: StateContext<VolumesStateModel>): Promise<void> {
    const missingVolumes = await this.getMissingVolumesUseCase.execute();

    ctx.patchState({ missingVolumes: [...missingVolumes] });
  }

  @Action(Volumes.GetCollected)
  async getCollectedVolumes(ctx: StateContext<VolumesStateModel>): Promise<void> {
    const collectedVolumes = await this.getCollectedVolumesUseCase.execute();

    ctx.patchState({ collectedVolumes: new Map(collectedVolumes) });
  }

  @Action(Volumes.GetInDelivery)
  async getInDeliveryVolumes(ctx: StateContext<VolumesStateModel>): Promise<void> {
    const inDeliveryVolumes = await this.getInDeliveryVolumesUseCase.execute();

    ctx.patchState({ inDeliveryVolumes: [...inDeliveryVolumes] });
  }

  @Action(Volumes.GetReleased)
  async getReleasedVolumes(ctx: StateContext<VolumesStateModel>): Promise<void> {
    const releasedVolumes = await this.getReleasedVolumesUseCase.execute();

    ctx.patchState({ releasedVolumes: [...releasedVolumes] });
  }

  @Action(Volumes.GetUpcoming)
  async getUpcomingVolumes(
    ctx: StateContext<VolumesStateModel>,
    { maxReleaseDate }: Volumes.GetUpcoming,
  ): Promise<void> {
    const upcomingVolumes = await this.getUpcomingVolumesUseCase.execute(maxReleaseDate);

    ctx.patchState({ upcomingVolumes: [...upcomingVolumes] });
  }

  @Action(Volumes.Create)
  async createVolume(
    ctx: StateContext<VolumesStateModel>,
    { createModel }: Volumes.Create,
  ): Promise<void> {
    const createdVolume = await this.createVolumeUseCase.execute(createModel);

    if (createdVolume) {
      if (VolumeStatusUtils.shouldBeInMissingVolumes(createdVolume)) {
        ctx.setState(
          patch({
            missingVolumes: append([createdVolume]),
          }),
        );
      } else if (VolumeStatusUtils.shouldBeInInDeliveryVolumes(createdVolume)) {
        ctx.setState(
          patch({
            inDeliveryVolumes: append([createdVolume]),
          }),
        );
      } else if (VolumeStatusUtils.shouldBeInReleasedVolumes(createdVolume)) {
        ctx.setState(
          patch({
            releasedVolumes: append([createdVolume]),
          }),
        );
      } else if (VolumeStatusUtils.shouldBeInUpcomingVolumes(createdVolume)) {
        ctx.setState(
          patch({
            upcomingVolumes: append([createdVolume]),
          }),
        );
      } else if (VolumeStatusUtils.shouldBeInCollectedVolumes(createdVolume)) {
        const collectedVolumes = await this.getCollectedVolumesUseCase.execute();

        ctx.patchState({ collectedVolumes: new Map(collectedVolumes) });
      }
    }
  }

  @Action(Volumes.Update)
  async updateVolume(
    ctx: StateContext<VolumesStateModel>,
    { updateModel }: Volumes.Update,
  ): Promise<void> {
    const updatedVolume = await this.updateVolumeUseCase.execute(updateModel);

    if (updatedVolume) {
      const missingVolumes = await this.getMissingVolumesUseCase.execute();
      const collectedVolumes = await this.getCollectedVolumesUseCase.execute();
      const inDeliveryVolumes = await this.getInDeliveryVolumesUseCase.execute();
      const releasedVolumes = await this.getReleasedVolumesUseCase.execute();
      const upcomingVolumes = await this.getUpcomingVolumesUseCase.execute();

      ctx.patchState({
        missingVolumes,
        inDeliveryVolumes,
        releasedVolumes,
        upcomingVolumes,
        collectedVolumes,
      });
    }
  }

  @Action(Volumes.Delete)
  async deleteVolume(ctx: StateContext<VolumesStateModel>, { id }: Volumes.Delete): Promise<void> {
    const successful = await this.deleteVolumeUseCase.execute(id);

    if (successful) {
      const collectedVolumes = await this.getCollectedVolumesUseCase.execute();

      ctx.setState(
        patch({
          missingVolumes: removeItem((item) => item.id === id),
          inDeliveryVolumes: removeItem((item) => item.id === id),
          releasedVolumes: removeItem((item) => item.id === id),
          upcomingVolumes: removeItem((item) => item.id === id),
          collectedVolumes,
        }),
      );
    }
  }
}
