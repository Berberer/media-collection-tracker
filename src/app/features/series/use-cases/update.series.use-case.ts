import { inject, Injectable } from '@angular/core';

import { UseCase } from '../../../core/use-case';
import { SeriesModel } from '../model/series.model';
import { UpdateSeriesModel } from '../model/update.series.model';
import { SeriesRepository } from '../repository/series.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateSeriesUseCase implements UseCase<UpdateSeriesModel, SeriesModel> {
  private readonly repository = inject(SeriesRepository);

  /**
   * Update an existing series specified via ID.
   * @param input The data to update the series incl. the ID.
   * @returns The updated {@link SeriesModel}.
   */
  execute(input: UpdateSeriesModel): Promise<SeriesModel> {
    return this.repository.updateSeries(input);
  }
}
