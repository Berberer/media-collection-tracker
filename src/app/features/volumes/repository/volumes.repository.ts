import { inject, Injectable } from '@angular/core';

import {
  MediaSeriesRecord,
  SeriesTagsRecord,
  VolumeTagsRecord,
} from '../../../../pocketbase-types';
import { ColorService } from '../../../core/services/color.service';
import { SeriesModel } from '../../series/model/series.model';
import { SeriesTagModel } from '../../tags/model/series-tag.model';
import { VolumeTagModel } from '../../tags/model/volume-tag.model';
import { VolumesDataSource } from '../data-sources/volumes.data-source';
import { CreateVolumeModel } from '../model/create.volume.model';
import { UpdateVolumeModel } from '../model/update.volume.model';
import { VolumeModel } from '../model/volume.model';

@Injectable({
  providedIn: 'root',
})
export class VolumesRepository {
  private readonly dataSource = inject(VolumesDataSource);
  private readonly colorService = inject(ColorService);

  async getMissingVolumes(): Promise<VolumeModel[]> {
    const volumeRecords = await this.dataSource.getMissingVolumes();
    return volumeRecords.map(([volumeRecord, seriesRecord, volumeTagRecords, seriesTagsRecords]) =>
      this.volumeModelFromRecord(
        volumeRecord,
        seriesRecord,
        volumeTagRecords,
        seriesTagsRecords,
        VolumeModel.fromMissingSeriesVolumeRecord,
      ),
    );
  }

  async getInDeliveryVolumes(): Promise<VolumeModel[]> {
    const volumeRecords = await this.dataSource.getInDeliveryVolumes();
    return volumeRecords.map(([volumeRecord, seriesRecord, volumeTagRecords, seriesTagsRecords]) =>
      this.volumeModelFromRecord(
        volumeRecord,
        seriesRecord,
        volumeTagRecords,
        seriesTagsRecords,
        VolumeModel.fromInDeliverySeriesVolumeRecord,
      ),
    );
  }

  async getReleasedVolumes(): Promise<VolumeModel[]> {
    const volumeRecords = await this.dataSource.getReleasedVolumes();
    return volumeRecords.map(([volumeRecord, seriesRecord, volumeTagRecords, seriesTagsRecords]) =>
      this.volumeModelFromRecord(
        volumeRecord,
        seriesRecord,
        volumeTagRecords,
        seriesTagsRecords,
        VolumeModel.fromReleasedSeriesVolumeRecord,
      ),
    );
  }

  async getUpcomingVolumes(): Promise<VolumeModel[]> {
    const volumeRecords = await this.dataSource.getUpcomingVolumes();
    return volumeRecords.map(([volumeRecord, seriesRecord, volumeTagRecords, seriesTagsRecords]) =>
      this.volumeModelFromRecord(
        volumeRecord,
        seriesRecord,
        volumeTagRecords,
        seriesTagsRecords,
        VolumeModel.fromUpcomingSeriesVolumeRecord,
      ),
    );
  }

  async getCollectedVolumes(): Promise<VolumeModel[]> {
    const volumeRecords = await this.dataSource.getCollectedVolumes();
    return volumeRecords.map(([volumeRecord, seriesRecord, volumeTagRecords, seriesTagsRecords]) =>
      this.volumeModelFromRecord(
        volumeRecord,
        seriesRecord,
        volumeTagRecords,
        seriesTagsRecords,
        VolumeModel.fromCollectedSeriesVolumeRecord,
      ),
    );
  }

  async createVolume(model: CreateVolumeModel): Promise<VolumeModel> {
    const [volumeRecord, seriesRecord, volumeTagRecords, seriesTagsRecords] =
      await this.dataSource.createVolume({
        ...model,
        sequence_number: model.sequenceNumber,
        shopping_link: model.shoppingLink ?? undefined,
        release_date: model.releaseDate ?? undefined,
        in_delivery: model.inDelivery,
        purchase_date: model.purchaseDate ?? undefined,
        volume_tags: model.volumeTags,
      });

    return this.volumeModelFromRecord(
      volumeRecord,
      seriesRecord,
      volumeTagRecords,
      seriesTagsRecords,
      VolumeModel.fromSeriesVolumeRecord,
    );
  }

  async updateVolume(model: UpdateVolumeModel): Promise<VolumeModel> {
    const [volumeRecord, seriesRecord, volumeTagRecords, seriesTagsRecords] =
      await this.dataSource.updateVolume({
        ...model,
        sequence_number: model.sequenceNumber,
        shopping_link: model.shoppingLink ?? undefined,
        release_date: model.releaseDate ?? undefined,
        in_delivery: model.inDelivery,
        purchase_date: model.purchaseDate ?? undefined,
        volume_tags: model.volumeTags,
      });

    return this.volumeModelFromRecord(
      volumeRecord,
      seriesRecord,
      volumeTagRecords,
      seriesTagsRecords,
      VolumeModel.fromSeriesVolumeRecord,
    );
  }

  async deleteVolume(id: string): Promise<boolean> {
    return await this.dataSource.deleteVolume(id);
  }

  private volumeModelFromRecord<T>(
    volumeRecord: T,
    seriesRecord: MediaSeriesRecord,
    volumeTagsRecords: VolumeTagsRecord[],
    seriesTagsRecords: SeriesTagsRecord[],
    volumeRecordMapper: (record: T, series: SeriesModel, tags: VolumeTagModel[]) => VolumeModel,
  ): VolumeModel {
    const seriesTagModels = seriesTagsRecords.map(
      (seriesTagRecord) => new SeriesTagModel(seriesTagRecord),
    );
    seriesTagModels.forEach((seriesTagModel) =>
      this.colorService.applyTextColorHashing(seriesTagModel),
    );

    const seriesModel = SeriesModel.fromMediaSeriesRecord(seriesRecord, seriesTagModels);
    this.colorService.applyTextColorHashing(seriesModel);

    const volumeTagModels = volumeTagsRecords.map(
      (volumeTagRecord) => new VolumeTagModel(volumeTagRecord),
    );
    volumeTagModels.forEach((volumeTagModel) =>
      this.colorService.applyTextColorHashing(volumeTagModel),
    );

    return volumeRecordMapper(volumeRecord, seriesModel, volumeTagModels);
  }
}
