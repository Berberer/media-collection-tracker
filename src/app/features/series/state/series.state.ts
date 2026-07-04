import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateOperator } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';

import { CreateVolumeModel } from '../../volumes/model/create.volume.model';
import { Volumes } from '../../volumes/state/volumes.state.actions';
import { SeriesModel } from '../model/series.model';
import { CreateSeriesUseCase } from '../use-cases/create.series.use-case';
import { DeleteSeriesUseCase } from '../use-cases/delete.series.use-case';
import { GetAllSeriesUseCase } from '../use-cases/get-all.series.use-case';
import { GetSeriesByIdUseCase } from '../use-cases/get-by-id.series.use-case';
import { GetCompletedSeriesUseCase } from '../use-cases/get-completed.series.use-case';
import { GetIncompleteSeriesUseCase } from '../use-cases/get-incomplete.series.use-case';
import { GetOrphanedSeriesUseCase } from '../use-cases/get-orphaned.series.use-case';
import { UpdateSeriesUseCase } from '../use-cases/update.series.use-case';
import { Series } from './series.state.actions';
import { defaultSeriesStateModel, SeriesStateModel } from './series.state.model';

@State<SeriesStateModel>({
  name: 'series',
  defaults: defaultSeriesStateModel,
})
@Injectable({ providedIn: 'root' })
export class SeriesState {
  private readonly getSeriesByIdUseCase = inject(GetSeriesByIdUseCase);
  private readonly getAllSeriesUseCase = inject(GetAllSeriesUseCase);
  private readonly getIncompleteSeriesUseCase = inject(GetIncompleteSeriesUseCase);
  private readonly getOrphanedSeriesUseCase = inject(GetOrphanedSeriesUseCase);
  private readonly getCompletedSeriesUseCase = inject(GetCompletedSeriesUseCase);
  private readonly createSeriesUseCase = inject(CreateSeriesUseCase);
  private readonly updateSeriesUseCase = inject(UpdateSeriesUseCase);
  private readonly deleteSeriesUseCase = inject(DeleteSeriesUseCase);

  @Action(Series.GetById)
  async getSeriesById(ctx: StateContext<SeriesStateModel>, { id }: Series.GetById): Promise<void> {
    ctx.patchState({ currentSeries: null });

    const series = await this.getSeriesByIdUseCase.execute(id);

    ctx.patchState({ currentSeries: series });
  }

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
      let currentSeries = ctx.getState().currentSeries;
      if (currentSeries?.id === updatedSeries.id) {
        currentSeries = updatedSeries;
      }

      if (updatedSeries.completed) {
        const completedSeries = await this.getCompletedSeriesUseCase.execute();

        ctx.setState(
          patch({
            series: updateItem((item) => item.id === updatedSeries.id, updatedSeries),
            incompleteSeries: removeItem((item) => item.id === updatedSeries.id),
            orphanedSeries: removeItem((item) => item.id === updatedSeries.id),
            completedSeries: [...completedSeries],
            currentSeries,
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
            currentSeries,
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
    const sequenceNumber = createVolumeModel.sequenceNumber;

    const updateHighestNumber: StateOperator<SeriesModel[]> = updateItem(
      (item) => item.id === series.id,
      (seriesModel) =>
        sequenceNumber > (seriesModel.highestVolumeNumber ?? 0)
          ? SeriesModel.copyWith(seriesModel, { highestVolumeNumber: sequenceNumber })
          : seriesModel,
    );

    ctx.setState(
      patch({
        series: updateHighestNumber,
        incompleteSeries: updateHighestNumber,
        orphanedSeries: removeItem((item) => item.id === series.id),
        currentSeries: (current: SeriesModel | null) =>
          current?.id === series.id && sequenceNumber > (current.highestVolumeNumber ?? 0)
            ? SeriesModel.copyWith(current, { highestVolumeNumber: sequenceNumber })
            : current,
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
          currentSeries:
            ctx.getState().currentSeries?.id === id ? null : ctx.getState().currentSeries,
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
