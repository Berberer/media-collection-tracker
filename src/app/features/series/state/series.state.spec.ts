import { TestBed } from '@angular/core/testing';
import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';

import { SeriesMediaTypes } from '../model/media-type.model';
import { SeriesModel } from '../model/series.model';
import { CreateSeriesUseCase } from '../use-cases/create.series.use-case';
import { DeleteSeriesUseCase } from '../use-cases/delete.series.use-case';
import { GetAllSeriesUseCase } from '../use-cases/get-all.series.use-case';
import { GetSeriesByIdUseCase } from '../use-cases/get-by-id.series.use-case';
import { GetCompletedSeriesUseCase } from '../use-cases/get-completed.series.use-case';
import { GetIncompleteSeriesUseCase } from '../use-cases/get-incomplete.series.use-case';
import { GetOrphanedSeriesUseCase } from '../use-cases/get-orphaned.series.use-case';
import { UpdateSeriesUseCase } from '../use-cases/update.series.use-case';
import { SeriesState } from './series.state';
import { defaultSeriesStateModel } from './series.state.model';
import SeriesMediaType = SeriesMediaTypes.SeriesMediaType;
import { CreateVolumeModel } from '../../volumes/model/create.volume.model';
import { Volumes } from '../../volumes/state/volumes.state.actions';
import { CreateSeriesModel } from '../model/create.series.model';
import { CreateSeriesVolumeModel } from '../model/create.series-volume.model';
import { UpdateSeriesModel } from '../model/update.series.model';
import { Series } from './series.state.actions';
import { SeriesStateSelectors } from './series.state.selectors';

describe('SeriesState', () => {
  let store: Store;
  let actions$: Actions;
  let getSeriesByIdUseCase: jest.Mocked<GetSeriesByIdUseCase>;
  let getAllSeriesUseCase: jest.Mocked<GetAllSeriesUseCase>;
  let getIncompleteSeriesUseCase: jest.Mocked<GetIncompleteSeriesUseCase>;
  let getOrphanedSeriesUseCase: jest.Mocked<GetOrphanedSeriesUseCase>;
  let getCompletedSeriesUseCase: jest.Mocked<GetCompletedSeriesUseCase>;
  let createSeriesUseCase: jest.Mocked<CreateSeriesUseCase>;
  let updateSeriesUseCase: jest.Mocked<UpdateSeriesUseCase>;
  let deleteSeriesUseCase: jest.Mocked<DeleteSeriesUseCase>;

  const mockSeries: SeriesModel[] = [
    new SeriesModel({
      id: '1',
      name: 'Test Series 1',
      mediaType: SeriesMediaType.BOOK,
      completed: false,
      highestVolumeNumber: 5,
      seriesTags: [],
      abbreviation: 'TS1',
      singleVolume: false,
    }),
    new SeriesModel({
      id: '2',
      name: 'Test Series 2',
      mediaType: SeriesMediaType.GAME,
      completed: true,
      highestVolumeNumber: 10,
      seriesTags: [],
      abbreviation: 'TS2',
      singleVolume: false,
    }),
  ];

  beforeEach(() => {
    const mockGetSeriesByIdUseCase = {
      execute: jest
        .fn()
        .mockImplementation((id: string) =>
          Promise.resolve(mockSeries.find((s) => s.id === id) ?? null),
        ),
    } as unknown as GetSeriesByIdUseCase;

    const mockGetAllSeriesUseCase = {
      execute: jest.fn().mockResolvedValue(mockSeries),
    } as unknown as GetAllSeriesUseCase;

    const mockGetIncompleteSeriesUseCase = {
      execute: jest.fn().mockResolvedValue([mockSeries[0]]),
    } as unknown as GetIncompleteSeriesUseCase;

    const mockGetOrphanedSeriesUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    } as unknown as GetOrphanedSeriesUseCase;

    const mockGetCompletedSeriesUseCase = {
      execute: jest.fn().mockResolvedValue([mockSeries[1]]),
    } as unknown as GetCompletedSeriesUseCase;

    const mockCreateSeriesUseCase = {
      execute: jest.fn().mockImplementation((input: CreateSeriesModel) => {
        return Promise.resolve(
          new SeriesModel({
            id: 'new-id',
            name: input.name,
            mediaType: input.mediaType,
            completed: input.completed,
            highestVolumeNumber: input.volumeModel ? input.volumeModel.sequenceNumber : 0,
            seriesTags: input.seriesTags,
            abbreviation: input.name.substring(0, 3).toUpperCase(),
            singleVolume: input.singleVolume,
          }),
        );
      }),
    } as unknown as CreateSeriesUseCase;

    const mockUpdateSeriesUseCase = {
      execute: jest.fn().mockImplementation((input: UpdateSeriesModel) => {
        return Promise.resolve(
          new SeriesModel({
            id: input.id,
            name: input.name,
            mediaType: input.mediaType,
            completed: input.completed,
            highestVolumeNumber: 0,
            seriesTags: input.seriesTags,
            abbreviation: input.name.substring(0, 3).toUpperCase(),
            singleVolume: input.singleVolume,
          }),
        );
      }),
    } as unknown as UpdateSeriesUseCase;

    const mockDeleteSeriesUseCase = {
      execute: jest.fn().mockResolvedValue(true),
    } as unknown as DeleteSeriesUseCase;

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SeriesState])],
      providers: [
        { provide: GetSeriesByIdUseCase, useValue: mockGetSeriesByIdUseCase },
        { provide: GetAllSeriesUseCase, useValue: mockGetAllSeriesUseCase },
        { provide: GetIncompleteSeriesUseCase, useValue: mockGetIncompleteSeriesUseCase },
        { provide: GetOrphanedSeriesUseCase, useValue: mockGetOrphanedSeriesUseCase },
        { provide: GetCompletedSeriesUseCase, useValue: mockGetCompletedSeriesUseCase },
        { provide: CreateSeriesUseCase, useValue: mockCreateSeriesUseCase },
        { provide: UpdateSeriesUseCase, useValue: mockUpdateSeriesUseCase },
        { provide: DeleteSeriesUseCase, useValue: mockDeleteSeriesUseCase },
      ],
    });

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
    getSeriesByIdUseCase = TestBed.inject(
      GetSeriesByIdUseCase,
    ) as jest.Mocked<GetSeriesByIdUseCase>;
    getAllSeriesUseCase = TestBed.inject(GetAllSeriesUseCase) as jest.Mocked<GetAllSeriesUseCase>;
    getIncompleteSeriesUseCase = TestBed.inject(
      GetIncompleteSeriesUseCase,
    ) as jest.Mocked<GetIncompleteSeriesUseCase>;
    getOrphanedSeriesUseCase = TestBed.inject(
      GetOrphanedSeriesUseCase,
    ) as jest.Mocked<GetOrphanedSeriesUseCase>;
    getCompletedSeriesUseCase = TestBed.inject(
      GetCompletedSeriesUseCase,
    ) as jest.Mocked<GetCompletedSeriesUseCase>;
    createSeriesUseCase = TestBed.inject(CreateSeriesUseCase) as jest.Mocked<CreateSeriesUseCase>;
    updateSeriesUseCase = TestBed.inject(UpdateSeriesUseCase) as jest.Mocked<UpdateSeriesUseCase>;
    deleteSeriesUseCase = TestBed.inject(DeleteSeriesUseCase) as jest.Mocked<DeleteSeriesUseCase>;
  });

  it('should have initial state', () => {
    const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
    expect(state).toEqual(defaultSeriesStateModel);
  });

  describe('getSeriesById', () => {
    it('should execute GetById use-case and update currentSeries in state', async () => {
      await firstValueFrom(store.dispatch(new Series.GetById('1')));

      expect(getSeriesByIdUseCase.execute).toHaveBeenCalledTimes(1);
      expect(getSeriesByIdUseCase.execute).toHaveBeenCalledWith('1');

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.currentSeries).toEqual(mockSeries[0]);
    });

    it('should update currentSeries selector after GetById action', async () => {
      await firstValueFrom(store.dispatch(new Series.GetById('2')));

      const currentSeries = store.selectSnapshot(SeriesStateSelectors.currentSeries);
      expect(currentSeries).toEqual(mockSeries[1]);
    });

    it('should handle GetById use-case returning null', async () => {
      getSeriesByIdUseCase.execute.mockResolvedValueOnce(null);

      await firstValueFrom(store.dispatch(new Series.GetById('nonexistent')));

      const currentSeries = store.selectSnapshot(SeriesStateSelectors.currentSeries);
      expect(currentSeries).toBeNull();
    });

    it('should not affect other series lists when getting series by id', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetById('1')));

      const series = store.selectSnapshot(SeriesStateSelectors.series);
      const incompleteSeries = store.selectSnapshot(SeriesStateSelectors.incompleteSeries);
      const orphanedSeries = store.selectSnapshot(SeriesStateSelectors.orphanedSeries);
      const completedSeries = store.selectSnapshot(SeriesStateSelectors.completedSeries);

      expect(series).toEqual(mockSeries);
      expect(incompleteSeries).toEqual([]);
      expect(orphanedSeries).toEqual([]);
      expect(completedSeries).toEqual([]);
    });
  });

  describe('getAllSeries', () => {
    it('should execute GetAll use-case and update series in state', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));

      expect(getAllSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toEqual(mockSeries);
      expect(state.incompleteSeries).toEqual([]);
      expect(state.orphanedSeries).toEqual([]);
      expect(state.completedSeries).toEqual([]);
    });

    it('should handle empty series array', async () => {
      getAllSeriesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Series.GetAll()));

      expect(getAllSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toEqual([]);
    });

    it('should update series selector after GetAll action', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));

      const series = store.selectSnapshot(SeriesStateSelectors.series);
      expect(series).toEqual(mockSeries);
    });

    it('should not affect other series lists when getting all series', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));

      const incompleteSeries = store.selectSnapshot(SeriesStateSelectors.incompleteSeries);
      const orphanedSeries = store.selectSnapshot(SeriesStateSelectors.orphanedSeries);
      const completedSeries = store.selectSnapshot(SeriesStateSelectors.completedSeries);
      const currentSeries = store.selectSnapshot(SeriesStateSelectors.currentSeries);

      expect(incompleteSeries).toEqual([]);
      expect(orphanedSeries).toEqual([]);
      expect(completedSeries).toEqual([]);
      expect(currentSeries).toBeNull();
    });
  });

  describe('getIncompleteSeries', () => {
    it('should execute GetIncomplete use-case and update incompleteSeries in state', async () => {
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));

      expect(getIncompleteSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.incompleteSeries).toEqual([mockSeries[0]]);
      expect(state.series).toEqual([]);
      expect(state.orphanedSeries).toEqual([]);
      expect(state.completedSeries).toEqual([]);
    });

    it('should handle empty incomplete series array', async () => {
      getIncompleteSeriesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));

      expect(getIncompleteSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.incompleteSeries).toEqual([]);
    });

    it('should update incompleteSeries selector after GetIncomplete action', async () => {
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));

      const incompleteSeries = store.selectSnapshot(SeriesStateSelectors.incompleteSeries);
      expect(incompleteSeries).toEqual([mockSeries[0]]);
    });

    it('should not affect other series lists when getting incomplete series', async () => {
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));

      const series = store.selectSnapshot(SeriesStateSelectors.series);
      const orphanedSeries = store.selectSnapshot(SeriesStateSelectors.orphanedSeries);
      const completedSeries = store.selectSnapshot(SeriesStateSelectors.completedSeries);
      const currentSeries = store.selectSnapshot(SeriesStateSelectors.currentSeries);

      expect(series).toEqual([]);
      expect(orphanedSeries).toEqual([]);
      expect(completedSeries).toEqual([]);
      expect(currentSeries).toBeNull();
    });
  });

  describe('getOrphanedSeries', () => {
    it('should execute GetOrphaned use-case and update orphanedSeries in state', async () => {
      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));

      expect(getOrphanedSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.orphanedSeries).toEqual([]);
      expect(state.series).toEqual([]);
      expect(state.incompleteSeries).toEqual([]);
      expect(state.completedSeries).toEqual([]);
    });

    it('should handle empty orphaned series array', async () => {
      getOrphanedSeriesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));

      expect(getOrphanedSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.orphanedSeries).toEqual([]);
    });

    it('should update orphanedSeries selector after GetOrphaned action', async () => {
      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));

      const orphanedSeries = store.selectSnapshot(SeriesStateSelectors.orphanedSeries);
      expect(orphanedSeries).toEqual([]);
    });

    it('should not affect other series lists when getting orphaned series', async () => {
      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));

      const series = store.selectSnapshot(SeriesStateSelectors.series);
      const incompleteSeries = store.selectSnapshot(SeriesStateSelectors.incompleteSeries);
      const completedSeries = store.selectSnapshot(SeriesStateSelectors.completedSeries);
      const currentSeries = store.selectSnapshot(SeriesStateSelectors.currentSeries);

      expect(series).toEqual([]);
      expect(incompleteSeries).toEqual([]);
      expect(completedSeries).toEqual([]);
      expect(currentSeries).toBeNull();
    });
  });

  describe('getCompletedSeries', () => {
    it('should execute GetCompleted use-case and update completedSeries in state', async () => {
      await firstValueFrom(store.dispatch(new Series.GetCompleted()));

      expect(getCompletedSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.completedSeries).toEqual([mockSeries[1]]);
      expect(state.series).toEqual([]);
      expect(state.incompleteSeries).toEqual([]);
      expect(state.orphanedSeries).toEqual([]);
    });

    it('should handle empty completed series array', async () => {
      getCompletedSeriesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Series.GetCompleted()));

      expect(getCompletedSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.completedSeries).toEqual([]);
    });

    it('should update completedSeries selector after GetCompleted action', async () => {
      await firstValueFrom(store.dispatch(new Series.GetCompleted()));

      const completedSeries = store.selectSnapshot(SeriesStateSelectors.completedSeries);
      expect(completedSeries).toEqual([mockSeries[1]]);
    });

    it('should not affect other series lists when getting completed series', async () => {
      await firstValueFrom(store.dispatch(new Series.GetCompleted()));

      const series = store.selectSnapshot(SeriesStateSelectors.series);
      const incompleteSeries = store.selectSnapshot(SeriesStateSelectors.incompleteSeries);
      const orphanedSeries = store.selectSnapshot(SeriesStateSelectors.orphanedSeries);
      const currentSeries = store.selectSnapshot(SeriesStateSelectors.currentSeries);

      expect(series).toEqual([]);
      expect(incompleteSeries).toEqual([]);
      expect(orphanedSeries).toEqual([]);
      expect(currentSeries).toBeNull();
    });
  });

  describe('getAllSeries combined', () => {
    it('should maintain all series lists in state after fetching all types', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));
      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));
      await firstValueFrom(store.dispatch(new Series.GetCompleted()));

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toEqual(mockSeries);
      expect(state.incompleteSeries).toEqual([mockSeries[0]]);
      expect(state.orphanedSeries).toEqual([]);
      expect(state.completedSeries).toEqual([mockSeries[1]]);
    });

    it('should allow fetching all series multiple times', async () => {
      const newSeries = [
        new SeriesModel({
          id: '3',
          name: 'Test Series 3',
          mediaType: SeriesMediaType.MOVIE,
          completed: false,
          highestVolumeNumber: 3,
          seriesTags: [],
          abbreviation: 'TS3',
          singleVolume: false,
        }),
      ];

      await firstValueFrom(store.dispatch(new Series.GetAll()));
      getAllSeriesUseCase.execute.mockResolvedValueOnce(newSeries);
      await firstValueFrom(store.dispatch(new Series.GetAll()));

      expect(getAllSeriesUseCase.execute).toHaveBeenCalledTimes(2);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toEqual(newSeries);
    });

    it('should allow fetching incomplete series multiple times', async () => {
      const newIncompleteSeries = [mockSeries[1]];

      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));
      getIncompleteSeriesUseCase.execute.mockResolvedValueOnce(newIncompleteSeries);
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));

      expect(getIncompleteSeriesUseCase.execute).toHaveBeenCalledTimes(2);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.incompleteSeries).toEqual(newIncompleteSeries);
    });

    it('should allow fetching orphaned series multiple times', async () => {
      const newOrphanedSeries = [mockSeries[0]];

      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));
      getOrphanedSeriesUseCase.execute.mockResolvedValueOnce(newOrphanedSeries);
      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));

      expect(getOrphanedSeriesUseCase.execute).toHaveBeenCalledTimes(2);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.orphanedSeries).toEqual(newOrphanedSeries);
    });

    it('should allow fetching completed series multiple times', async () => {
      const newCompletedSeries: SeriesModel[] = [];

      await firstValueFrom(store.dispatch(new Series.GetCompleted()));
      getCompletedSeriesUseCase.execute.mockResolvedValueOnce(newCompletedSeries);
      await firstValueFrom(store.dispatch(new Series.GetCompleted()));

      expect(getCompletedSeriesUseCase.execute).toHaveBeenCalledTimes(2);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.completedSeries).toEqual(newCompletedSeries);
    });
  });

  describe('createSeries', () => {
    it('should execute Create use-case and add series to state', async () => {
      const createModel = new CreateSeriesModel({
        name: 'New Series',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        singleVolume: false,
        seriesTags: [],
        volumeModel: null,
      });

      await firstValueFrom(store.dispatch(new Series.Create(createModel)));

      expect(createSeriesUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSeriesUseCase.execute).toHaveBeenCalledWith(createModel);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(1);
      expect(state.series[0].name).toBe('New Series');
      expect(state.incompleteSeries).toHaveLength(1);
      expect(state.orphanedSeries).toHaveLength(1);
      expect(state.completedSeries).toEqual([]);
    });

    it('should add completed series to completedSeries list when created as completed', async () => {
      const createModel = new CreateSeriesModel({
        name: 'Completed Series',
        mediaType: SeriesMediaType.GAME,
        completed: true,
        singleVolume: false,
        seriesTags: [],
        volumeModel: null,
      });

      await firstValueFrom(store.dispatch(new Series.Create(createModel)));

      expect(createSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(1);
      expect(state.completedSeries).toHaveLength(1);
      expect(state.incompleteSeries).toEqual([]);
      expect(state.orphanedSeries).toEqual([]);
    });

    it('should not add series if use-case returns null', async () => {
      createSeriesUseCase.execute.mockResolvedValueOnce(null);
      const createModel = new CreateSeriesModel({
        name: 'New Series',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        singleVolume: false,
        seriesTags: [],
        volumeModel: null,
      });

      await firstValueFrom(store.dispatch(new Series.Create(createModel)));

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toEqual([]);
      expect(state.incompleteSeries).toEqual([]);
      expect(state.orphanedSeries).toEqual([]);
      expect(state.completedSeries).toEqual([]);
    });

    it('should update series selector after Create action', async () => {
      const createModel = new CreateSeriesModel({
        name: 'New Series',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        singleVolume: false,
        seriesTags: [],
        volumeModel: null,
      });

      await firstValueFrom(store.dispatch(new Series.Create(createModel)));

      const series = store.selectSnapshot(SeriesStateSelectors.series);
      expect(series).toHaveLength(1);
      expect(series[0].name).toBe('New Series');
    });

    it('should dispatch AddVolumeToSeries action when creating series with volume model', async () => {
      const createModel = new CreateSeriesModel({
        name: 'Series With Volume',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        singleVolume: false,
        seriesTags: [],
        volumeModel: new CreateSeriesVolumeModel({
          sequenceNumber: 1,
          shoppingLink: null,
          releaseDate: null,
          inDelivery: false,
          purchaseDate: null,
          volumeTags: [],
        }),
      });

      store.dispatch(new Series.Create(createModel));

      const dispatchedAction = await firstValueFrom(
        actions$.pipe(ofActionDispatched(Series.AddVolumeToSeries)),
      );

      expect(dispatchedAction).toBeInstanceOf(Series.AddVolumeToSeries);
      expect(dispatchedAction.series.id).toBeDefined();
      expect(dispatchedAction.createVolumeModel.sequenceNumber).toBe(1);
    });

    it('should add to upcoming series when creating single volume series with volume not purchased and no release date', async () => {
      const createModel = new CreateSeriesModel({
        name: 'Single Volume Series',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        singleVolume: true,
        seriesTags: [],
        volumeModel: new CreateSeriesVolumeModel({
          sequenceNumber: 1,
          shoppingLink: null,
          releaseDate: null,
          inDelivery: false,
          purchaseDate: null,
          volumeTags: [],
        }),
      });

      await firstValueFrom(store.dispatch(new Series.Create(createModel)));

      expect(createSeriesUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSeriesUseCase.execute).toHaveBeenCalledWith(createModel);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(1);
      expect(state.series[0].name).toBe('Single Volume Series');
      expect(state.series[0].singleVolume).toBe(true);
      expect(state.series[0].highestVolumeNumber).toBe(1);
      expect(state.incompleteSeries).toHaveLength(1);
      expect(state.orphanedSeries).toHaveLength(0);
    });

    it('should add to missing series when creating single volume series with volume not purchased and past release date', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const createModel = new CreateSeriesModel({
        name: 'Single Volume Series with Release',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        singleVolume: true,
        seriesTags: [],
        volumeModel: new CreateSeriesVolumeModel({
          sequenceNumber: 2,
          shoppingLink: null,
          releaseDate: pastDate,
          inDelivery: false,
          purchaseDate: null,
          volumeTags: [],
        }),
      });

      await firstValueFrom(store.dispatch(new Series.Create(createModel)));

      expect(createSeriesUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSeriesUseCase.execute).toHaveBeenCalledWith(createModel);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(1);
      expect(state.series[0].name).toBe('Single Volume Series with Release');
      expect(state.series[0].singleVolume).toBe(true);
      expect(state.series[0].highestVolumeNumber).toBe(2);
      expect(state.incompleteSeries).toHaveLength(1);
      expect(state.orphanedSeries).toHaveLength(0);
    });

    it('should add to in delivery series when creating single volume series with volume not purchased but in delivery', async () => {
      const createModel = new CreateSeriesModel({
        name: 'Single Volume Series In Delivery',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        singleVolume: true,
        seriesTags: [],
        volumeModel: new CreateSeriesVolumeModel({
          sequenceNumber: 3,
          shoppingLink: null,
          releaseDate: null,
          inDelivery: true,
          purchaseDate: null,
          volumeTags: [],
        }),
      });

      await firstValueFrom(store.dispatch(new Series.Create(createModel)));

      expect(createSeriesUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSeriesUseCase.execute).toHaveBeenCalledWith(createModel);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(1);
      expect(state.series[0].name).toBe('Single Volume Series In Delivery');
      expect(state.series[0].singleVolume).toBe(true);
      expect(state.series[0].highestVolumeNumber).toBe(3);
      expect(state.incompleteSeries).toHaveLength(1);
      expect(state.orphanedSeries).toHaveLength(0);
    });

    it('should add to collected series when creating single volume series with volume purchased', async () => {
      const purchaseDate = new Date();

      const createModel = new CreateSeriesModel({
        name: 'Single Volume Series Purchased',
        mediaType: SeriesMediaType.BOOK,
        completed: true,
        singleVolume: true,
        seriesTags: [],
        volumeModel: new CreateSeriesVolumeModel({
          sequenceNumber: 4,
          shoppingLink: null,
          releaseDate: null,
          inDelivery: false,
          purchaseDate: purchaseDate,
          volumeTags: [],
        }),
      });

      await firstValueFrom(store.dispatch(new Series.Create(createModel)));

      expect(createSeriesUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSeriesUseCase.execute).toHaveBeenCalledWith(createModel);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(1);
      expect(state.series[0].name).toBe('Single Volume Series Purchased');
      expect(state.series[0].singleVolume).toBe(true);
      expect(state.series[0].highestVolumeNumber).toBe(4);
      expect(state.completedSeries).toHaveLength(1);
      expect(state.incompleteSeries).toEqual([]);
      expect(state.orphanedSeries).toEqual([]);
    });
  });

  describe('updateSeries', () => {
    it('should execute Update use-case and update series in state when marking as completed', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));
      getIncompleteSeriesUseCase.execute.mockResolvedValueOnce([mockSeries[0]]);
      getOrphanedSeriesUseCase.execute.mockResolvedValueOnce([mockSeries[0]]);
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));
      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));

      const updateModel = new UpdateSeriesModel({
        id: '1',
        name: 'Updated Series',
        mediaType: SeriesMediaType.BOOK,
        completed: true,
        singleVolume: false,
        seriesTags: [],
      });

      await firstValueFrom(store.dispatch(new Series.Update(updateModel)));

      expect(updateSeriesUseCase.execute).toHaveBeenCalledTimes(1);
      expect(updateSeriesUseCase.execute).toHaveBeenCalledWith(updateModel);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(2);
      expect(state.series[0].name).toBe('Updated Series');
      expect(state.completedSeries).toHaveLength(1);
      expect(state.incompleteSeries).toEqual([]);
      expect(state.orphanedSeries).toEqual([]);
    });

    it('should execute Update use-case and update series in state when marking as incomplete', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetCompleted()));

      const updateModel = new UpdateSeriesModel({
        id: '2',
        name: 'Updated Series',
        mediaType: SeriesMediaType.GAME,
        completed: false,
        singleVolume: false,
        seriesTags: [],
      });

      getIncompleteSeriesUseCase.execute.mockResolvedValueOnce([
        new SeriesModel({
          id: '2',
          name: 'Updated Series',
          mediaType: SeriesMediaType.GAME,
          completed: false,
          highestVolumeNumber: 10,
          seriesTags: [],
          abbreviation: 'US',
          singleVolume: false,
        }),
      ]);
      getOrphanedSeriesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Series.Update(updateModel)));

      expect(updateSeriesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(2);
      expect(state.incompleteSeries).toHaveLength(1);
      expect(state.completedSeries).toEqual([]);
      expect(state.orphanedSeries).toEqual([]);
    });

    it('should not update series if use-case returns null', async () => {
      updateSeriesUseCase.execute.mockResolvedValueOnce(null);
      const updateModel = new UpdateSeriesModel({
        id: '1',
        name: 'Updated Series',
        mediaType: SeriesMediaType.BOOK,
        completed: true,
        singleVolume: false,
        seriesTags: [],
      });

      await firstValueFrom(store.dispatch(new Series.Update(updateModel)));

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toEqual([]);
    });

    it('should update series selector after Update action', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));

      const updateModel = new UpdateSeriesModel({
        id: '1',
        name: 'Updated Series',
        mediaType: SeriesMediaType.BOOK,
        completed: true,
        singleVolume: false,
        seriesTags: [],
      });

      await firstValueFrom(store.dispatch(new Series.Update(updateModel)));

      const series = store.selectSnapshot(SeriesStateSelectors.series);
      expect(series).toHaveLength(2);
      expect(series[0].name).toBe('Updated Series');
    });

    it('should update currentSeries when updating the current series', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetById('1')));

      const stateBefore = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(stateBefore.currentSeries?.id).toBe('1');

      const updateModel = new UpdateSeriesModel({
        id: '1',
        name: 'Updated Current Series',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        singleVolume: false,
        seriesTags: [],
      });

      getSeriesByIdUseCase.execute.mockResolvedValueOnce(
        new SeriesModel({
          id: '1',
          name: 'Updated Current Series',
          mediaType: SeriesMediaType.BOOK,
          completed: false,
          highestVolumeNumber: 0,
          seriesTags: [],
          abbreviation: 'UCS',
          singleVolume: false,
        }),
      );

      await firstValueFrom(store.dispatch(new Series.Update(updateModel)));

      const stateAfter = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(stateAfter.currentSeries?.name).toBe('Updated Current Series');
      expect(stateAfter.currentSeries?.id).toBe('1');
    });

    it('should not update currentSeries when updating a different series', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetById('1')));

      const stateBefore = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(stateBefore.currentSeries?.id).toBe('1');

      const updateModel = new UpdateSeriesModel({
        id: '2',
        name: 'Updated Other Series',
        mediaType: SeriesMediaType.GAME,
        completed: false,
        singleVolume: false,
        seriesTags: [],
      });

      await firstValueFrom(store.dispatch(new Series.Update(updateModel)));

      const stateAfter = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(stateAfter.currentSeries?.id).toBe('1');
      expect(stateAfter.currentSeries?.name).toBe('Test Series 1');
    });
  });

  describe('addVolumeToSeries', () => {
    it('should update series sequence number and remove from orphaned when volume is added', async () => {
      const seriesWithVolume = new SeriesModel({
        id: '1',
        name: 'Test Series',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        highestVolumeNumber: 0,
        seriesTags: [],
        abbreviation: 'TS',
        singleVolume: false,
      });

      getAllSeriesUseCase.execute.mockResolvedValueOnce([seriesWithVolume]);
      getIncompleteSeriesUseCase.execute.mockResolvedValueOnce([seriesWithVolume]);
      getOrphanedSeriesUseCase.execute.mockResolvedValueOnce([seriesWithVolume]);

      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));
      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));

      await firstValueFrom(
        store.dispatch(
          new Series.AddVolumeToSeries(
            seriesWithVolume,
            new CreateVolumeModel({
              series: seriesWithVolume,
              sequenceNumber: 5,
              shoppingLink: null,
              releaseDate: null,
              inDelivery: false,
              purchaseDate: null,
              volumeTags: [],
            }),
          ),
        ),
      );

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(1);
      expect(state.series[0].highestVolumeNumber).toBe(5);
      expect(state.incompleteSeries).toHaveLength(1);
      expect(state.incompleteSeries[0].highestVolumeNumber).toBe(5);
      expect(state.orphanedSeries).toEqual([]);
    });

    it('should not decrease highestVolumeNumber when adding a lower volume number', async () => {
      const seriesWithVolume = new SeriesModel({
        id: '1',
        name: 'Test Series',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        highestVolumeNumber: 10,
        seriesTags: [],
        abbreviation: 'TS',
        singleVolume: false,
      });

      getAllSeriesUseCase.execute.mockResolvedValueOnce([seriesWithVolume]);
      getIncompleteSeriesUseCase.execute.mockResolvedValueOnce([seriesWithVolume]);

      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));

      await firstValueFrom(
        store.dispatch(
          new Series.AddVolumeToSeries(
            seriesWithVolume,
            new CreateVolumeModel({
              series: seriesWithVolume,
              sequenceNumber: 3,
              shoppingLink: null,
              releaseDate: null,
              inDelivery: false,
              purchaseDate: null,
              volumeTags: [],
            }),
          ),
        ),
      );

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series[0].highestVolumeNumber).toBe(10);
      expect(state.incompleteSeries[0].highestVolumeNumber).toBe(10);
    });

    it('should update currentSeries highestVolumeNumber when adding a volume to the current series', async () => {
      const seriesWithVolume = new SeriesModel({
        id: '1',
        name: 'Test Series',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        highestVolumeNumber: 0,
        seriesTags: [],
        abbreviation: 'TS',
        singleVolume: false,
      });

      await firstValueFrom(store.dispatch(new Series.GetById('1')));
      getSeriesByIdUseCase.execute.mockResolvedValueOnce(seriesWithVolume);
      await firstValueFrom(store.dispatch(new Series.GetById('1')));

      let state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.currentSeries?.highestVolumeNumber).toBe(0);

      await firstValueFrom(
        store.dispatch(
          new Series.AddVolumeToSeries(
            seriesWithVolume,
            new CreateVolumeModel({
              series: seriesWithVolume,
              sequenceNumber: 7,
              shoppingLink: null,
              releaseDate: null,
              inDelivery: false,
              purchaseDate: null,
              volumeTags: [],
            }),
          ),
        ),
      );

      state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.currentSeries?.highestVolumeNumber).toBe(7);
    });

    it('should not update currentSeries when adding a volume to a different series', async () => {
      const series1 = new SeriesModel({
        id: '1',
        name: 'Test Series 1',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        highestVolumeNumber: 0,
        seriesTags: [],
        abbreviation: 'TS1',
        singleVolume: false,
      });

      const series2 = new SeriesModel({
        id: '2',
        name: 'Test Series 2',
        mediaType: SeriesMediaType.GAME,
        completed: true,
        highestVolumeNumber: 10,
        seriesTags: [],
        abbreviation: 'TS2',
        singleVolume: false,
      });

      getSeriesByIdUseCase.execute.mockResolvedValueOnce(series1);
      await firstValueFrom(store.dispatch(new Series.GetById('1')));

      await firstValueFrom(
        store.dispatch(
          new Series.AddVolumeToSeries(
            series2,
            new CreateVolumeModel({
              series: series2,
              sequenceNumber: 15,
              shoppingLink: null,
              releaseDate: null,
              inDelivery: false,
              purchaseDate: null,
              volumeTags: [],
            }),
          ),
        ),
      );

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.currentSeries?.highestVolumeNumber).toBe(0);
    });

    it('should preserve backgroundColorHex and textColorHex when updating highestVolumeNumber', async () => {
      const seriesWithColors = new SeriesModel({
        id: '1',
        name: 'Colored Series',
        mediaType: SeriesMediaType.BOOK,
        completed: false,
        highestVolumeNumber: 0,
        seriesTags: [],
        abbreviation: 'CS',
        singleVolume: false,
      });
      seriesWithColors.setColors({ backgroundColorHex: '#FF0000', textColorHex: '#FFFFFF' });

      getAllSeriesUseCase.execute.mockResolvedValueOnce([seriesWithColors]);
      getIncompleteSeriesUseCase.execute.mockResolvedValueOnce([seriesWithColors]);
      getOrphanedSeriesUseCase.execute.mockResolvedValueOnce([seriesWithColors]);

      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));
      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));

      await firstValueFrom(
        store.dispatch(
          new Series.AddVolumeToSeries(
            seriesWithColors,
            new CreateVolumeModel({
              series: seriesWithColors,
              sequenceNumber: 5,
              shoppingLink: null,
              releaseDate: null,
              inDelivery: false,
              purchaseDate: null,
              volumeTags: [],
            }),
          ),
        ),
      );

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series[0].backgroundColorHex).toBe('#FF0000');
      expect(state.series[0].textColorHex).toBe('#FFFFFF');
      expect(state.incompleteSeries[0].backgroundColorHex).toBe('#FF0000');
      expect(state.incompleteSeries[0].textColorHex).toBe('#FFFFFF');
      expect(state.orphanedSeries).toEqual([]);
    });
  });

  describe('updateSeriesState', () => {
    it('should remove series from orphaned when a volume is added and keep it in incomplete', async () => {
      const orphanedSeries = [mockSeries[0]];
      getOrphanedSeriesUseCase.execute.mockResolvedValueOnce(orphanedSeries);
      getIncompleteSeriesUseCase.execute.mockResolvedValueOnce([mockSeries[0]]);

      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));

      const createVolumeModel = new CreateVolumeModel({
        series: mockSeries[0],
        sequenceNumber: 1,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      await firstValueFrom(store.dispatch(new Volumes.Create(createVolumeModel)));

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.orphanedSeries).toEqual([]);
      expect(state.incompleteSeries).toEqual([mockSeries[0]]);
    });
  });

  describe('deleteSeries', () => {
    it('should execute Delete use-case and remove series from state', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));

      await firstValueFrom(store.dispatch(new Series.Delete('1')));

      expect(deleteSeriesUseCase.execute).toHaveBeenCalledTimes(1);
      expect(deleteSeriesUseCase.execute).toHaveBeenCalledWith('1');

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(1);
      expect(state.series[0].id).toBe('2');
      expect(state.incompleteSeries).toEqual([]);
      expect(state.orphanedSeries).toEqual([]);
      expect(state.completedSeries).toEqual([]);
    });

    it('should not remove series if use-case returns false', async () => {
      deleteSeriesUseCase.execute.mockResolvedValueOnce(false);
      await firstValueFrom(store.dispatch(new Series.GetAll()));

      await firstValueFrom(store.dispatch(new Series.Delete('1')));

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(2);
    });

    it('should update series selector after Delete action', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));

      await firstValueFrom(store.dispatch(new Series.Delete('1')));

      const series = store.selectSnapshot(SeriesStateSelectors.series);
      expect(series).toHaveLength(1);
      expect(series[0].id).toBe('2');
    });

    it('should remove series from all lists when deleted', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetIncomplete()));
      await firstValueFrom(store.dispatch(new Series.GetCompleted()));

      await firstValueFrom(store.dispatch(new Series.Delete('1')));

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.series).toHaveLength(1);
      expect(state.incompleteSeries).toEqual([]);
      expect(state.completedSeries).toEqual([mockSeries[1]]);
    });

    it('should remove series from orphaned list when deleted', async () => {
      getOrphanedSeriesUseCase.execute.mockResolvedValueOnce([mockSeries[0]]);
      await firstValueFrom(store.dispatch(new Series.GetOrphaned()));

      await firstValueFrom(store.dispatch(new Series.Delete('1')));

      const state = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(state.orphanedSeries).toEqual([]);
    });

    it('should set currentSeries to null when deleting the current series', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetById('1')));

      const stateBefore = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(stateBefore.currentSeries?.id).toBe('1');

      await firstValueFrom(store.dispatch(new Series.Delete('1')));

      const stateAfter = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(stateAfter.currentSeries).toBeNull();
    });

    it('should not affect currentSeries when deleting a different series', async () => {
      await firstValueFrom(store.dispatch(new Series.GetAll()));
      await firstValueFrom(store.dispatch(new Series.GetById('1')));

      const stateBefore = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(stateBefore.currentSeries?.id).toBe('1');

      await firstValueFrom(store.dispatch(new Series.Delete('2')));

      const stateAfter = store.selectSnapshot(SeriesStateSelectors.stateModel);
      expect(stateAfter.currentSeries?.id).toBe('1');
      expect(stateAfter.currentSeries?.name).toBe('Test Series 1');
    });
  });
});
