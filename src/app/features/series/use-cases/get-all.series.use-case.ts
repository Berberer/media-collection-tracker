import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { SeriesModel } from '../model/series.model';
import { SeriesRepository } from '../repository/series.repository';

@Injectable({
  providedIn: 'root',
})
export class GetAllSeriesUseCase implements UseCase<void, readonly SeriesModel[]> {
  private readonly repository = inject(SeriesRepository);

  /**
   * Get all tracked series.
   * @returns A list of {@link SeriesModel}.
   */
  execute(): Promise<readonly SeriesModel[]> {
    return this.repository.getAllSeries();
  }
}
