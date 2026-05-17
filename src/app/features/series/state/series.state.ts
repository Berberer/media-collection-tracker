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
  private readonly deleteSeriesUseCase = inject(DeleteSeriesUseCase);

  @Action(Series.GetAll)
  async getAllSeries(ctx: StateContext<SeriesStateModel>): Promise<void> {
    const series = await this.getAllSeriesUseCase.execute();

    ctx.patchState({ series: [...series] });
  }

  @Action(Series.GetIncomplete)
  async getIncompleteSeries(ctx: StateContext<SeriesStateModel>): Promise<void> {
    const series = await this.getIncompleteSeriesUseCase.execute();

    ctx.patchState({ incompleteSeries: [...series] });
  }

  @Action(Series.GetOrphaned)
  async getOrphanedSeries(ctx: StateContext<SeriesStateModel>): Promise<void> {
    const series = await this.getOrphanedSeriesUseCase.execute();

    ctx.patchState({ orphanedSeries: [...series] });
  }

  @Action(Series.GetCompleted)
  async getCompletedSeries(ctx: StateContext<SeriesStateModel>): Promise<void> {
    const series = await this.getCompletedSeriesUseCase.execute();

    ctx.patchState({ completedSeries: [...series] });
  }

  @Action(Series.Create)
  async createSeries(
    ctx: StateContext<SeriesStateModel>,
    { createModel }: Series.Create,
  ): Promise<void> {
    const createdSeries = await this.createSeriesUseCase.execute(createModel);

    if (createdSeries) {
      ctx.setState(
        patch({
          series: append([createdSeries]),
          ...(createModel.completed && { completedSeries: append([createdSeries]) }),
          ...(!createModel.completed && { incompleteSeries: append([createdSeries]) }),
          ...(!createModel.completed && { orphanedSeries: append([createdSeries]) }),
        }),
      );

      // If the series has volume data, create the volume
      if (createModel.volumeModel) {
        ctx.dispatch(
          new Series.AddVolumeToSeries(
            createdSeries,
            new CreateVolumeModel({
              series: createdSeries,
              sequenceNumber: createModel.volumeModel.sequenceNumber,
              shoppingLink: createModel.volumeModel.shoppingLink,
              releaseDate: createModel.volumeModel.releaseDate,
              inDelivery: createModel.volumeModel.inDelivery,
              purchaseDate: createModel.volumeModel.purchaseDate,
              volumeTags: createModel.volumeModel.volumeTags,
            }),
          ),
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
  addVolumeToSeries(
    ctx: StateContext<SeriesStateModel>,
    { series, createVolumeModel }: Series.AddVolumeToSeries,
  ): void {
    const sequenceNumberUpdater: StateOperator<SeriesModel[]> = updateItem(
      (item) => item.id === series.id,
      (seriesModel) =>
        new SeriesModel({
          ...seriesModel,
          highestVolumeNumber: createVolumeModel.sequenceNumber,
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
