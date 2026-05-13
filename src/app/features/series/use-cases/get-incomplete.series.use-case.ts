import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { SeriesModel } from '../model/series.model';
import { SeriesRepository } from '../repository/series.repository';
import { SeriesMediaTypes } from '../model/media-type.model';

@Injectable({
  providedIn: 'root',
})
export class GetIncompleteSeriesUseCase implements UseCase<
  SeriesMediaTypes.SeriesMediaType | undefined,
  readonly SeriesModel[]
> {
  private readonly repository = inject(SeriesRepository);

  /**
   * Get all tracked incomplete series.
   * @param mediaType Optional media type filter.
   * @returns A list of {@link SeriesModel}.
   */
  async execute(mediaType?: SeriesMediaTypes.SeriesMediaType): Promise<readonly SeriesModel[]> {
    const series = await this.repository.getIncompleteSeries();
    return mediaType ? series.filter((s) => s.mediaType === mediaType) : series;
  }
}
