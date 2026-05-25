import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { SeriesRepository } from '../repository/series.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteSeriesUseCase implements UseCase<string, boolean> {
  private readonly repository = inject(SeriesRepository);

  /**
   * Delete an existing series including all volumes.
   * @param input The ID to identify the series that is supposed to be deleted.
   * @return Boolean flag whether a series was found and deleted for the ID.
   */
  execute(input: string): Promise<boolean> {
    return this.repository.deleteSeries(input);
  }
}
