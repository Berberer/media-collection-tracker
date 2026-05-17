import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { SeriesModel } from '../model/series.model';
import { SeriesRepository } from '../repository/series.repository';

@Injectable({
  providedIn: 'root',
})
export class GetCompletedSeriesUseCase implements UseCase<void, readonly SeriesModel[]> {
  private readonly repository = inject(SeriesRepository);

  /**
   * Get all tracked completed series.
   * @returns A list of {@link SeriesModel}.
   */
  async execute(): Promise<readonly SeriesModel[]> {
    return this.repository.getCompletedSeries();
  }
}
