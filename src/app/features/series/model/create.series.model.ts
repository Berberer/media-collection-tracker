import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';
import { SeriesTagModel } from '../../tags/model/series-tag.model';
import { CreateSeriesVolumeModel } from './create.series-volume.model';
import { SeriesMediaTypes } from './media-type.model';

export class CreateSeriesModel {
  readonly name: string;
  readonly singleVolume: boolean;
  readonly completed: boolean;
  readonly mediaType: SeriesMediaTypes.SeriesMediaType;
  readonly seriesTags: SeriesTagModel[];
  readonly volumeModel: CreateSeriesVolumeModel | null = null;

  constructor(model: RemoveMethods<CreateSeriesModel>) {
    this.name = model.name;
    this.singleVolume = model.singleVolume;
    this.completed = model.completed;
    this.mediaType = model.mediaType;
    this.seriesTags = model.seriesTags;
    this.volumeModel = model.volumeModel;
  }
}
