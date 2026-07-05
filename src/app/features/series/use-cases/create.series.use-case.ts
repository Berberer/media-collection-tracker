import { inject, Service } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { CreateSeriesModel } from '../model/create.series.model';
import { SeriesModel } from '../model/series.model';
import { SeriesRepository } from '../repository/series.repository';

@Service()
export class CreateSeriesUseCase implements UseCase<CreateSeriesModel, SeriesModel> {
  private readonly repository = inject(SeriesRepository);

  /**
   * Create a new series.
   * @param input The data to create the series with.
   * @returns The newly created {@link SeriesModel}.
   */
  execute(input: CreateSeriesModel): Promise<SeriesModel> {
    return this.repository.createSeries(input);
  }
}
