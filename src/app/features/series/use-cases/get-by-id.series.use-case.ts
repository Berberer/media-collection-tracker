import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { SeriesModel } from '../model/series.model';
import { SeriesRepository } from '../repository/series.repository';

@Injectable({
  providedIn: 'root',
})
export class GetSeriesByIdUseCase implements UseCase<string, SeriesModel> {
  private readonly repository = inject(SeriesRepository);

  /**
   * Get a series by its ID.
   * @param id - The ID of the series to retrieve.
   * @returns The matching series as a {@link SeriesModel}.
   * @throws {SeriesRecordNotFoundError} If no series is found for the given ID.
   */
  execute(id: string): Promise<SeriesModel> {
    return this.repository.getSeriesById(id);
  }
}
