import { inject, Injectable } from '@angular/core';
import { SeriesDataSource } from '../data-sources/series.data-source';
import { SeriesModel } from '../model/series.model';
import { CreateSeriesModel } from '../model/create.series.model';
import { UpdateSeriesModel } from '../model/update.series.model';
import { SeriesMediaTypes } from '../model/media-type.model';
import { ColorService } from '../../../core/services/color.service';
import { SeriesTagsRecord } from '../../../../pocketbase-types';
import { SeriesTagModel } from '../../tags/model/series-tag.model';

@Injectable({
  providedIn: 'root',
})
export class SeriesRepository {
  private readonly dataSource = inject(SeriesDataSource);
  private readonly colorService = inject(ColorService);

  async getAllSeries(): Promise<readonly SeriesModel[]> {
    const seriesRecords = await this.dataSource.getAllSeries();
    return seriesRecords.map(([seriesRecord, seriesTagRecords]) =>
      this.seriesModelFromRecord(
        seriesRecord,
        seriesTagRecords,
        SeriesModel.fromAllMediaSeriesRecord,
      ),
    );
  }

  async getIncompleteSeries(): Promise<SeriesModel[]> {
    const seriesRecords = await this.dataSource.getIncompleteSeries();
    return seriesRecords.map(([seriesRecord, seriesTagRecords]) =>
      this.seriesModelFromRecord(
        seriesRecord,
        seriesTagRecords,
        SeriesModel.fromIncompleteMediaSeriesRecord,
      ),
    );
  }

  async getOrphanedSeries(): Promise<SeriesModel[]> {
    const seriesRecords = await this.dataSource.getOrphanedSeries();
    return seriesRecords.map(([seriesRecord, seriesTagRecords]) =>
      this.seriesModelFromRecord(
        seriesRecord,
        seriesTagRecords,
        SeriesModel.fromOrphanedMediaSeriesRecord,
      ),
    );
  }

  async getCompletedSeries(): Promise<SeriesModel[]> {
    const seriesRecords = await this.dataSource.getCompletedSeries();
    return seriesRecords.map(([seriesRecord, seriesTagRecords]) =>
      this.seriesModelFromRecord(
        seriesRecord,
        seriesTagRecords,
        SeriesModel.fromCompletedMediaSeriesRecord,
      ),
    );
  }

  async createSeries(model: CreateSeriesModel): Promise<SeriesModel> {
    const [seriesRecord, seriesTagRecords] = await this.dataSource.createSeries({
      name: model.name,
      single_volume: model.singleVolume,
      completed: model.completed,
      type: SeriesMediaTypes.fromEnum(model.mediaType),
      seriesTags: model.seriesTags,
    });

    return this.seriesModelFromRecord(
      seriesRecord,
      seriesTagRecords,
      SeriesModel.fromMediaSeriesRecord,
    );
  }

  async updateSeries(model: UpdateSeriesModel): Promise<SeriesModel> {
    const [seriesRecord, seriesTagRecords] = await this.dataSource.updateSeries(model.id, {
      name: model.name,
      single_volume: model.singleVolume,
      completed: model.completed,
      type: SeriesMediaTypes.fromEnum(model.mediaType),
      seriesTags: model.seriesTags,
    });

    return this.seriesModelFromRecord(
      seriesRecord,
      seriesTagRecords,
      SeriesModel.fromMediaSeriesRecord,
    );
  }

  async deleteSeries(id: string): Promise<boolean> {
    return await this.dataSource.deleteSeries(id);
  }

  private seriesModelFromRecord<T>(
    seriesRecord: T,
    seriesTagRecords: SeriesTagsRecord[],
    seriesRecordMapper: (record: T, tags: SeriesTagModel[]) => SeriesModel,
  ): SeriesModel {
    const seriesTagModels = seriesTagRecords.map(
      (seriesTagRecord) => new SeriesTagModel(seriesTagRecord),
    );
    seriesTagModels.forEach((seriesTagModel) =>
      this.colorService.applyTextColorHashing(seriesTagModel),
    );

    const seriesModel = seriesRecordMapper(seriesRecord, seriesTagModels);
    this.colorService.applyTextColorHashing(seriesModel);

    return seriesModel;
  }
}
