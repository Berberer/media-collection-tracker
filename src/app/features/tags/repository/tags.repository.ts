import { inject, Injectable } from '@angular/core';
import { TagsDataSource } from '../data-sources/tags.data-source';
import { VolumeTagModel } from '../model/volume-tag.model';
import { CreateVolumeTagModel } from '../model/create.volume-tag.model';
import { SeriesTagsRecord, VolumeTagsRecord } from '../../../../pocketbase-types';
import { ColorService } from '../../../core/services/color.service';
import { SeriesTagModel } from '../model/series-tag.model';
import { CreateSeriesTagModel } from '../model/create.series-tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagsRepository {
  private readonly dataSource = inject(TagsDataSource);
  private readonly colorService = inject(ColorService);

  async getAllSeriesTags(): Promise<readonly SeriesTagModel[]> {
    const tagRecords = await this.dataSource.getAllSeriesTags();
    return tagRecords.map((r) => this.seriesTagModelFromRecord(r));
  }

  async getAllVolumeTags(): Promise<readonly VolumeTagModel[]> {
    const tagRecords = await this.dataSource.getAllVolumeTags();
    return tagRecords.map((r) => this.volumeTagModelFromRecord(r));
  }

  async createSeriesTag(model: CreateSeriesTagModel): Promise<SeriesTagModel> {
    const tagRecord = await this.dataSource.createSeriesTag({ ...model });
    return this.seriesTagModelFromRecord(tagRecord);
  }

  async createVolumeTag(model: CreateVolumeTagModel): Promise<VolumeTagModel> {
    const tagRecord = await this.dataSource.createVolumeTag({ ...model });
    return this.volumeTagModelFromRecord(tagRecord);
  }

  async deleteSeriesTag(id: string): Promise<boolean> {
    return this.dataSource.deleteSeriesTag(id);
  }

  async deleteVolumeTag(id: string): Promise<boolean> {
    return this.dataSource.deleteVolumeTag(id);
  }

  private seriesTagModelFromRecord(tagRecord: SeriesTagsRecord): SeriesTagModel {
    const tagModel = new SeriesTagModel({
      ...tagRecord,
    });

    this.colorService.applyTextColorHashing(tagModel);

    return tagModel;
  }

  private volumeTagModelFromRecord(tagRecord: VolumeTagsRecord): VolumeTagModel {
    const tagModel = new VolumeTagModel({
      ...tagRecord,
    });

    this.colorService.applyTextColorHashing(tagModel);

    return tagModel;
  }
}
