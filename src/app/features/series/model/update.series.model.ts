import { RemoveMethods } from '../../../core/typing-utilities/remove-methods';
import { SeriesTagModel } from '../../tags/model/series-tag.model';
import { SeriesMediaTypes } from './media-type.model';

export class UpdateSeriesModel {
  readonly id: string;
  readonly name: string;
  readonly singleVolume: boolean;
  readonly completed: boolean;
  readonly mediaType: SeriesMediaTypes.SeriesMediaType;
  readonly seriesTags: SeriesTagModel[];

  constructor(model: RemoveMethods<UpdateSeriesModel>) {
    this.id = model.id;
    this.name = model.name;
    this.singleVolume = model.singleVolume;
    this.completed = model.completed;
    this.mediaType = model.mediaType;
    this.seriesTags = model.seriesTags;
  }
}
