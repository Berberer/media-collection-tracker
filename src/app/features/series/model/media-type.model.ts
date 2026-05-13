import {
  AllMediaSeriesTypeOptions,
  CompletedMediaSeriesTypeOptions,
  IncompleteMediaSeriesTypeOptions,
  MediaSeriesTypeOptions,
  OrphanedMediaSeriesTypeOptions,
} from '../../../../pocketbase-types';

export namespace SeriesMediaTypes {
  export enum SeriesMediaType {
    BOOK = 'BOOK',
    GAME = 'GAME',
    MOVIE = 'MOVIE',
    SHOW = 'SHOW',
  }

  export function toEnum(
    typeOption:
      | MediaSeriesTypeOptions
      | AllMediaSeriesTypeOptions
      | IncompleteMediaSeriesTypeOptions
      | OrphanedMediaSeriesTypeOptions
      | CompletedMediaSeriesTypeOptions,
  ): SeriesMediaType {
    switch (typeOption) {
      case MediaSeriesTypeOptions.Book:
      case AllMediaSeriesTypeOptions.Book:
      case IncompleteMediaSeriesTypeOptions.Book:
      case OrphanedMediaSeriesTypeOptions.Book:
      case CompletedMediaSeriesTypeOptions.Book:
        return SeriesMediaType.BOOK;
      case MediaSeriesTypeOptions.Game:
      case AllMediaSeriesTypeOptions.Game:
      case IncompleteMediaSeriesTypeOptions.Game:
      case OrphanedMediaSeriesTypeOptions.Game:
      case CompletedMediaSeriesTypeOptions.Game:
        return SeriesMediaType.GAME;
      case MediaSeriesTypeOptions.Movie:
      case AllMediaSeriesTypeOptions.Movie:
      case IncompleteMediaSeriesTypeOptions.Movie:
      case OrphanedMediaSeriesTypeOptions.Movie:
      case CompletedMediaSeriesTypeOptions.Movie:
        return SeriesMediaType.MOVIE;
      case MediaSeriesTypeOptions.Show:
      case AllMediaSeriesTypeOptions.Show:
      case IncompleteMediaSeriesTypeOptions.Show:
      case OrphanedMediaSeriesTypeOptions.Show:
      case CompletedMediaSeriesTypeOptions.Show:
        return SeriesMediaType.SHOW;
    }
  }

  export function fromEnum(typeEnum: SeriesMediaType): MediaSeriesTypeOptions {
    switch (typeEnum) {
      case SeriesMediaType.BOOK:
        return MediaSeriesTypeOptions.Book;
      case SeriesMediaType.GAME:
        return MediaSeriesTypeOptions.Game;
      case SeriesMediaType.MOVIE:
        return MediaSeriesTypeOptions.Movie;
      case SeriesMediaType.SHOW:
        return MediaSeriesTypeOptions.Show;
    }
  }
}
