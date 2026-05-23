import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { CreateSeriesTagModel } from '../model/create.series-tag.model';
import { SeriesTagModel } from '../model/series-tag.model';
import { TagsRepository } from '../repository/tags.repository';
import { TagAlreadyExistsError } from '../errors/tags.errors';

@Injectable({
  providedIn: 'root',
})
export class CreateSeriesTagUseCase implements UseCase<CreateSeriesTagModel, SeriesTagModel> {
  private readonly repository = inject(TagsRepository);

  /**
   * Create a new series tag.
   * @param input The data to create the series tag with.
   * @return The newly created {@link SeriesTagModel}.
   * @throws {TagAlreadyExistsError} If a tag with the same name already exists.
   */
  async execute(input: CreateSeriesTagModel): Promise<SeriesTagModel> {
    const existingTags = await this.repository.getAllSeriesTags();
    const tagExists = existingTags.some((tag) => tag.label === input.label);

    if (tagExists) {
      throw new TagAlreadyExistsError(input.label);
    }

    return this.repository.createSeriesTag(input);
  }
}
