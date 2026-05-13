import { Selector } from '@ngxs/store';
import { TagsStateModel } from './tags.state.model';
import { TagsState } from './tags.state';
import { SeriesTagModel } from '../model/series-tag.model';
import { VolumeTagModel } from '../model/volume-tag.model';

export abstract class TagsStateSelectors {
  @Selector([TagsState])
  static stateModel(stateModel: TagsStateModel): TagsStateModel {
    return stateModel;
  }

  @Selector([TagsState])
  static seriesTags({ seriesTags }: TagsStateModel): readonly SeriesTagModel[] {
    return seriesTags;
  }

  @Selector([TagsState])
  static volumeTags({ volumeTags }: TagsStateModel): readonly VolumeTagModel[] {
    return volumeTags;
  }
}
