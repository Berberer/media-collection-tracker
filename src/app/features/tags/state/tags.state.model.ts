import { SeriesTagModel } from '../model/series-tag.model';
import { VolumeTagModel } from '../model/volume-tag.model';

export interface TagsStateModel {
  seriesTags: SeriesTagModel[];
  volumeTags: VolumeTagModel[];
}

export const defaultTagStateModel: TagsStateModel = {
  seriesTags: [],
  volumeTags: [],
};
