import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { CreateSeriesTagModel } from '../model/create.series-tag.model';
import { SeriesTagModel } from '../model/series-tag.model';
import { TagsRepository } from '../repository/tags.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateSeriesTagUseCase implements UseCase<CreateSeriesTagModel, SeriesTagModel> {
  private readonly repository = inject(TagsRepository);

  /**
   * Create a new series tag.
   * @param input The data to create the series tag with.
   * @return The newly created {@link SeriesTagModel}.
   */
  execute(input: CreateSeriesTagModel): Promise<SeriesTagModel> {
    return this.repository.createSeriesTag(input);
  }
}
