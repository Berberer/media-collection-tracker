import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../../core/use-case';
import { SeriesModel } from '../model/series.model';
import { SeriesRepository } from '../repository/series.repository';
import { SeriesMediaTypes } from '../model/media-type.model';

@Injectable({
  providedIn: 'root',
})
export class GetCompletedSeriesUseCase implements UseCase<
  SeriesMediaTypes.SeriesMediaType | undefined,
  readonly SeriesModel[]
> {
  private readonly repository = inject(SeriesRepository);

  /**
   * Get all tracked completed series.
   * @param mediaType Optional media type filter.
   * @returns A list of {@link SeriesModel}.
   */
  async execute(mediaType?: SeriesMediaTypes.SeriesMediaType): Promise<readonly SeriesModel[]> {
    const series = await this.repository.getCompletedSeries();
    return mediaType ? series.filter((s) => s.mediaType === mediaType) : series;
  }
}
