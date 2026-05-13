import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateOperator } from '@ngxs/store';
import { defaultSeriesStateModel, SeriesStateModel } from './series.state.model';
import { GetAllSeriesUseCase } from '../use-cases/get-all.series.use-case';
import { Series } from './series.state.actions';
import { CreateSeriesUseCase } from '../use-cases/create.series.use-case';
import { UpdateSeriesUseCase } from '../use-cases/update.series.use-case';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { GetIncompleteSeriesUseCase } from '../use-cases/get-incomplete.series.use-case';
import { GetOrphanedSeriesUseCase } from '../use-cases/get-orphaned.series.use-case';
import { GetCompletedSeriesUseCase } from '../use-cases/get-completed.series.use-case';
import { CreateVolumeUseCase } from '../../volumes/use-cases/create.volume.use-case';
import { DeleteSeriesUseCase } from '../use-cases/delete.series.use-case';
import { SeriesModel } from '../model/series.model';
import { CreateVolumeModel } from '../../volumes/model/create.volume.model';
import { Volumes } from '../../volumes/state/volumes.state.actions';

@State<SeriesStateModel>({
  name: 'series',
  defaults: defaultSeriesStateModel,
})
@Injectable({ providedIn: 'root' })
export class SeriesState {
  private readonly getAllSeriesUseCase = inject(GetAllSeriesUseCase);
  private readonly getIncompleteSeriesUseCase = inject(GetIncompleteSeriesUseCase);
  private readonly getOrphanedSeriesUseCase = inject(GetOrphanedSeriesUseCase);
  private readonly getCompletedSeriesUseCase = inject(GetCompletedSeriesUseCase);
  private readonly createSeriesUseCase = inject(CreateSeriesUseCase);
  private readonly updateSeriesUseCase = inject(UpdateSeriesUseCase);
  private readonly createVolumeUseCase = inject(CreateVolumeUseCase);
  private readonly deleteSeriesUseCase = inject(DeleteSeriesUseCase);

  @Action(Series.GetAll)
  async getAllSeries(ctx: StateContext<SeriesStateModel>): Promise<void> {
    const series = await this.getAllSeriesUseCase.execute();

    ctx.patchState({ series: [...series] });
  }

  @Action(Series.GetIncomplete)
  async getIncompleteSeries(
    ctx: StateContext<SeriesStateModel>,
    { mediaType }: Series.GetIncomplete,
  ): Promise<void> {
    const series = await this.getIncompleteSeriesUseCase.execute(mediaType);

    ctx.patchState({ incompleteSeries: [...series] });
  }

  @Action(Series.GetOrphaned)
  async getOrphanedSeries(
    ctx: StateContext<SeriesStateModel>,
    { mediaType }: Series.GetOrphaned,
  ): Promise<void> {
    const series = await this.getOrphanedSeriesUseCase.execute(mediaType);

    ctx.patchState({ orphanedSeries: [...series] });
  }

  @Action(Series.GetCompleted)
  async getCompletedSeries(
    ctx: StateContext<SeriesStateModel>,
    { mediaType }: Series.GetCompleted,
  ): Promise<void> {
    const series = await this.getCompletedSeriesUseCase.execute(mediaType);

    ctx.patchState({ completedSeries: [...series] });
  }

  @Action(Series.Create)
  async createSeries(
    ctx: StateContext<SeriesStateModel>,
    { createModel }: Series.Create,
  ): Promise<void> {
    const createdSeries = await this.createSeriesUseCase.execute(createModel);

    if (createdSeries) {
      const isCompleted = createModel.completed;
      const isIncomplete = !createModel.completed && createModel.volumeModel !== null;
      const isOrphaned = !createModel.completed && createModel.volumeModel === null;

      ctx.setState(
        patch({
          series: append([createdSeries]),
          ...(isCompleted && { completedSeries: append([createdSeries]) }),
          ...(isIncomplete && { incompleteSeries: append([createdSeries]) }),
          ...(isOrphaned && { orphanedSeries: append([createdSeries]) }),
        }),
      );

      // If the series has volume data, create the volume
      if (createModel.volumeModel) {
        const createdVolume = await this.createVolumeUseCase.execute(
          new CreateVolumeModel({
            series: createdSeries,
            sequenceNumber: createModel.volumeModel.sequenceNumber,
            shoppingLink: createModel.volumeModel.shoppingLink,
            releaseDate: createModel.volumeModel.releaseDate,
            inDelivery: createModel.volumeModel.inDelivery,
            purchaseDate: createModel.volumeModel.purchaseDate,
            volumeTags: createModel.volumeModel.volumeTags,
          }),
        );

        const sequenceNumberUpdater: StateOperator<SeriesModel[]> = updateItem(
          (item) => item.id === createdSeries.id,
          (seriesModel) =>
            new SeriesModel({
              ...seriesModel,
              highestVolumeNumber: createdVolume.sequenceNumber,
            }),
        );

        ctx.setState(
          patch({
            series: sequenceNumberUpdater,
            incompleteSeries: sequenceNumberUpdater,
          }),
        );
      }
    }
  }

  @Action(Series.Update)
  async updateSeries(
    ctx: StateContext<SeriesStateModel>,
    { updateModel }: Series.Update,
  ): Promise<void> {
    const updatedSeries = await this.updateSeriesUseCase.execute(updateModel);

    if (updatedSeries) {
      if (updatedSeries.completed) {
        const completedSeries = await this.getCompletedSeriesUseCase.execute();

        ctx.setState(
          patch({
            series: updateItem((item) => item.id === updatedSeries.id, updatedSeries),
            incompleteSeries: removeItem((item) => item.id === updatedSeries.id),
            orphanedSeries: removeItem((item) => item.id === updatedSeries.id),
            completedSeries: [...completedSeries],
          }),
        );
      } else {
        const incompleteSeries = await this.getIncompleteSeriesUseCase.execute();
        const orphanedSeries = await this.getOrphanedSeriesUseCase.execute();

        ctx.setState(
          patch({
            series: updateItem((item) => item.id === updatedSeries.id, updatedSeries),
            completedSeries: removeItem((item) => item.id === updatedSeries.id),
            incompleteSeries: [...incompleteSeries],
            orphanedSeries: [...orphanedSeries],
          }),
        );
      }
    }
  }

  @Action(Series.AddVolumeToSeries)
  async addVolumeToSeries(
    ctx: StateContext<SeriesStateModel>,
    { series, createVolumeModel }: Series.AddVolumeToSeries,
  ): Promise<void> {
    const createdVolume = await this.createVolumeUseCase.execute({
      series,
      ...createVolumeModel,
    });

    if (createdVolume) {
      const sequenceNumberUpdater: StateOperator<SeriesModel[]> = updateItem(
        (item) => item.id === series.id,
        (seriesModel) =>
          new SeriesModel({
            ...seriesModel,
            highestVolumeNumber: createdVolume.sequenceNumber,
          }),
      );

      ctx.setState(
        patch({
          series: sequenceNumberUpdater,
          incompleteSeries: sequenceNumberUpdater,
          orphanedSeries: removeItem((item) => item.id === series.id),
        }),
      );
    }
  }

  @Action(Series.Delete)
  async deleteSeries(ctx: StateContext<SeriesStateModel>, { id }: Series.Delete): Promise<void> {
    const successful = await this.deleteSeriesUseCase.execute(id);

    if (successful) {
      ctx.setState(
        patch({
          series: removeItem((item) => item.id === id),
          incompleteSeries: removeItem((item) => item.id === id),
          orphanedSeries: removeItem((item) => item.id === id),
          completedSeries: removeItem((item) => item.id === id),
        }),
      );
    }
  }

  @Action(Volumes.Create)
  updateSeriesState(ctx: StateContext<SeriesStateModel>, { createModel }: Volumes.Create): void {
    ctx.setState(
      patch({
        orphanedSeries: removeItem((item) => item.id === createModel.series.id),
      }),
    );
  }
}
