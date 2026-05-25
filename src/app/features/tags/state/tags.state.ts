import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem } from '@ngxs/store/operators';

import { CreateSeriesTagUseCase } from '../use-cases/create.series-tag.use-case';
import { CreateVolumeTagUseCase } from '../use-cases/create.volume-tag.use-case';
import { DeleteSeriesTagUseCase } from '../use-cases/delete.series-tag.use-case';
import { DeleteVolumeTagUseCase } from '../use-cases/delete.volume-tag.use-case';
import { GetAllSeriesTagUseCase } from '../use-cases/get-all.series-tag.use-case';
import { GetAllVolumeTagUseCase } from '../use-cases/get-all.volume-tag.use-case';
import { SeriesTags, VolumeTags } from './tags.state.actions';
import { defaultTagStateModel, TagsStateModel } from './tags.state.model';

@State<TagsStateModel>({
  name: 'volumeTags',
  defaults: defaultTagStateModel,
})
@Injectable({ providedIn: 'root' })
export class TagsState {
  private readonly getAllSeriesTagUseCase = inject(GetAllSeriesTagUseCase);
  private readonly getAllVolumeTagUseCase = inject(GetAllVolumeTagUseCase);
  private readonly createSeriesTagUseCase = inject(CreateSeriesTagUseCase);
  private readonly createVolumeTagUseCase = inject(CreateVolumeTagUseCase);
  private readonly deleteSeriesTagUseCase = inject(DeleteSeriesTagUseCase);
  private readonly deleteVolumeTagUseCase = inject(DeleteVolumeTagUseCase);

  @Action(SeriesTags.GetAll)
  async getAllSeriesTags(ctx: StateContext<TagsStateModel>): Promise<void> {
    const tags = await this.getAllSeriesTagUseCase.execute();

    ctx.patchState({ seriesTags: [...tags] });
  }

  @Action(VolumeTags.GetAll)
  async getAllVolumeTags(ctx: StateContext<TagsStateModel>): Promise<void> {
    const tags = await this.getAllVolumeTagUseCase.execute();

    ctx.patchState({ volumeTags: [...tags] });
  }

  @Action(SeriesTags.Create)
  async createSeriesTag(
    ctx: StateContext<TagsStateModel>,
    { createModel }: SeriesTags.Create,
  ): Promise<void> {
    const createdTag = await this.createSeriesTagUseCase.execute(createModel);

    if (createdTag) {
      ctx.setState(
        patch({
          seriesTags: append([createdTag]),
        }),
      );
    }
  }

  @Action(VolumeTags.Create)
  async createVolumeTag(
    ctx: StateContext<TagsStateModel>,
    { createModel }: VolumeTags.Create,
  ): Promise<void> {
    const createdTag = await this.createVolumeTagUseCase.execute(createModel);

    if (createdTag) {
      ctx.setState(
        patch({
          volumeTags: append([createdTag]),
        }),
      );
    }
  }

  @Action(SeriesTags.Delete)
  async deleteSeriesTag(
    ctx: StateContext<TagsStateModel>,
    { id }: SeriesTags.Delete,
  ): Promise<void> {
    const successful = await this.deleteSeriesTagUseCase.execute(id);

    if (successful) {
      ctx.setState(
        patch({
          seriesTags: removeItem((item) => item.id === id),
        }),
      );
    }
  }

  @Action(VolumeTags.Delete)
  async deleteVolumeTag(
    ctx: StateContext<TagsStateModel>,
    { id }: VolumeTags.Delete,
  ): Promise<void> {
    const successful = await this.deleteVolumeTagUseCase.execute(id);

    if (successful) {
      ctx.setState(
        patch({
          volumeTags: removeItem((item) => item.id === id),
        }),
      );
    }
  }
}
