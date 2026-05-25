import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { SeriesTagModel } from '../model/series-tag.model';
import { TagsRepository } from '../repository/tags.repository';

@Injectable({
  providedIn: 'root',
})
export class GetAllSeriesTagUseCase implements UseCase<void, readonly SeriesTagModel[]> {
  private readonly repository = inject(TagsRepository);

  /**
   * Get all available series tags.
   * @return A list of {@link SeriesTagModel}.
   */
  execute(): Promise<readonly SeriesTagModel[]> {
    return this.repository.getAllSeriesTags();
  }
}
