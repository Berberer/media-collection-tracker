import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { SeriesMediaTypes } from '../../series/model/media-type.model';
import { SeriesModel } from '../../series/model/series.model';
import { VolumeModel } from '../model/volume.model';
import { CreateVolumeUseCase } from '../use-cases/create.volume.use-case';
import { DeleteVolumeUseCase } from '../use-cases/delete.volume.use-case';
import { GetCollectedVolumesUseCase } from '../use-cases/get-collected.volumes.use-case';
import { GetInDeliveryVolumeUseCase } from '../use-cases/get-in-delivery.volume.use-case';
import { GetMissingVolumeUseCase } from '../use-cases/get-missing.volume.use-case';
import { GetReleasedVolumeUseCase } from '../use-cases/get-released.volume.use-case';
import { GetUpcomingVolumeUseCase } from '../use-cases/get-upcoming.volume.use-case';
import { UpdateVolumeUseCase } from '../use-cases/update.volume.use-case';
import { VolumeStatusUtils } from '../utils/volume-status.utils';
import { VolumesState } from './volumes.state';
import { defaultVolumesState } from './volumes.state.model';
import SeriesMediaType = SeriesMediaTypes.SeriesMediaType;
import { firstValueFrom } from 'rxjs';

import { CreateSeriesVolumeModel } from '../../series/model/create.series-volume.model';
import { Series } from '../../series/state/series.state.actions';
import { CreateVolumeModel } from '../model/create.volume.model';
import { UpdateVolumeModel } from '../model/update.volume.model';
import { Volumes } from './volumes.state.actions';
import { VolumesStateSelectors } from './volumes.state.selectors';

describe('VolumesState', () => {
  let store: Store;
  let getMissingVolumesUseCase: jest.Mocked<GetMissingVolumeUseCase>;
  let getInDeliveryVolumesUseCase: jest.Mocked<GetInDeliveryVolumeUseCase>;
  let getReleasedVolumesUseCase: jest.Mocked<GetReleasedVolumeUseCase>;
  let getUpcomingVolumesUseCase: jest.Mocked<GetUpcomingVolumeUseCase>;
  let getCollectedVolumesUseCase: jest.Mocked<GetCollectedVolumesUseCase>;
  let createVolumeUseCase: jest.Mocked<CreateVolumeUseCase>;
  let updateVolumeUseCase: jest.Mocked<UpdateVolumeUseCase>;
  let deleteVolumeUseCase: jest.Mocked<DeleteVolumeUseCase>;

  const mockSeries = new SeriesModel({
    id: '1',
    name: 'Test Series',
    mediaType: SeriesMediaType.BOOK,
    completed: false,
    highestVolumeNumber: 5,
    seriesTags: [],
    abbreviation: 'TS',
    singleVolume: false,
  });

  const mockVolume: VolumeModel = new VolumeModel({
    id: '1',
    series: mockSeries,
    sequenceNumber: 1,
    shoppingLink: 'https://example.com',
    releaseDate: null,
    inDelivery: false,
    purchaseDate: null,
    volumeTags: [],
  });

  const mockVolumes: VolumeModel[] = [mockVolume];

  beforeEach(() => {
    const mockGetMissingVolumesUseCase = {
      execute: jest.fn().mockResolvedValue(mockVolumes),
    } as unknown as GetMissingVolumeUseCase;

    const mockGetInDeliveryVolumesUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    } as unknown as GetInDeliveryVolumeUseCase;

    const mockGetReleasedVolumesUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    } as unknown as GetReleasedVolumeUseCase;

    const mockGetUpcomingVolumesUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    } as unknown as GetUpcomingVolumeUseCase;

    const mockGetCollectedVolumesUseCase = {
      execute: jest.fn().mockResolvedValue(new Map()),
    } as unknown as GetCollectedVolumesUseCase;

    const mockCreateVolumeUseCase = {
      execute: jest.fn().mockImplementation((input: CreateVolumeModel) => {
        return Promise.resolve(
          new VolumeModel({
            id: 'new-volume-id',
            series: input.series,
            sequenceNumber: input.sequenceNumber,
            shoppingLink: input.shoppingLink,
            releaseDate: input.releaseDate,
            inDelivery: input.inDelivery,
            purchaseDate: input.purchaseDate,
            volumeTags: input.volumeTags,
          }),
        );
      }),
    } as unknown as CreateVolumeUseCase;

    const mockUpdateVolumeUseCase = {
      execute: jest.fn().mockImplementation((input: UpdateVolumeModel) => {
        return Promise.resolve(
          new VolumeModel({
            id: input.id,
            series: input.series,
            sequenceNumber: input.sequenceNumber,
            shoppingLink: input.shoppingLink,
            releaseDate: input.releaseDate,
            inDelivery: input.inDelivery,
            purchaseDate: input.purchaseDate,
            volumeTags: input.volumeTags,
          }),
        );
      }),
    } as unknown as UpdateVolumeUseCase;

    const mockDeleteVolumeUseCase = {
      execute: jest.fn().mockResolvedValue(true),
    } as unknown as DeleteVolumeUseCase;

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([VolumesState])],
      providers: [
        { provide: GetMissingVolumeUseCase, useValue: mockGetMissingVolumesUseCase },
        { provide: GetInDeliveryVolumeUseCase, useValue: mockGetInDeliveryVolumesUseCase },
        { provide: GetReleasedVolumeUseCase, useValue: mockGetReleasedVolumesUseCase },
        { provide: GetUpcomingVolumeUseCase, useValue: mockGetUpcomingVolumesUseCase },
        { provide: GetCollectedVolumesUseCase, useValue: mockGetCollectedVolumesUseCase },
        { provide: CreateVolumeUseCase, useValue: mockCreateVolumeUseCase },
        { provide: UpdateVolumeUseCase, useValue: mockUpdateVolumeUseCase },
        { provide: DeleteVolumeUseCase, useValue: mockDeleteVolumeUseCase },
        { provide: VolumeStatusUtils, useValue: VolumeStatusUtils },
      ],
    });

    store = TestBed.inject(Store);
    getMissingVolumesUseCase = TestBed.inject(
      GetMissingVolumeUseCase,
    ) as jest.Mocked<GetMissingVolumeUseCase>;
    getInDeliveryVolumesUseCase = TestBed.inject(
      GetInDeliveryVolumeUseCase,
    ) as jest.Mocked<GetInDeliveryVolumeUseCase>;
    getReleasedVolumesUseCase = TestBed.inject(
      GetReleasedVolumeUseCase,
    ) as jest.Mocked<GetReleasedVolumeUseCase>;
    getUpcomingVolumesUseCase = TestBed.inject(
      GetUpcomingVolumeUseCase,
    ) as jest.Mocked<GetUpcomingVolumeUseCase>;
    getCollectedVolumesUseCase = TestBed.inject(
      GetCollectedVolumesUseCase,
    ) as jest.Mocked<GetCollectedVolumesUseCase>;
    createVolumeUseCase = TestBed.inject(CreateVolumeUseCase) as jest.Mocked<CreateVolumeUseCase>;
    updateVolumeUseCase = TestBed.inject(UpdateVolumeUseCase) as jest.Mocked<UpdateVolumeUseCase>;
    deleteVolumeUseCase = TestBed.inject(DeleteVolumeUseCase) as jest.Mocked<DeleteVolumeUseCase>;
  });

  it('should have initial state', () => {
    const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
    expect(state).toEqual(defaultVolumesState);
  });

  describe('getMissingVolumes', () => {
    it('should execute GetMissing use-case and update missingVolumes in state', async () => {
      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));

      expect(getMissingVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toEqual(mockVolumes);
      expect(state.inDeliveryVolumes).toEqual([]);
      expect(state.releasedVolumes).toEqual([]);
      expect(state.upcomingVolumes).toEqual([]);
      expect(state.collectedVolumes).toEqual(new Map());
    });

    it('should handle empty missing volumes array', async () => {
      getMissingVolumesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));

      expect(getMissingVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toEqual([]);
    });

    it('should update missingVolumes selector after GetMissing action', async () => {
      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));

      const missingVolumes = store.selectSnapshot(VolumesStateSelectors.missingVolumes);
      expect(missingVolumes).toEqual(mockVolumes);
    });

    it('should not affect other volume lists when getting missing volumes', async () => {
      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));

      const inDeliveryVolumes = store.selectSnapshot(VolumesStateSelectors.inDeliveryVolumes);
      const releasedVolumes = store.selectSnapshot(VolumesStateSelectors.releasedVolumes);
      const upcomingVolumes = store.selectSnapshot(VolumesStateSelectors.upcomingVolumes);
      const collectedVolumes = store.selectSnapshot(VolumesStateSelectors.collectedVolumes);

      expect(inDeliveryVolumes).toEqual([]);
      expect(releasedVolumes).toEqual([]);
      expect(upcomingVolumes).toEqual([]);
      expect(collectedVolumes).toEqual(new Map());
    });
  });

  describe('getInDeliveryVolumes', () => {
    it('should execute GetInDelivery use-case and update inDeliveryVolumes in state', async () => {
      const inDeliveryVolume = new VolumeModel({
        ...mockVolume,
        id: 'in-delivery-1',
        inDelivery: true,
      });
      getInDeliveryVolumesUseCase.execute.mockResolvedValueOnce([inDeliveryVolume]);

      await firstValueFrom(store.dispatch(new Volumes.GetInDelivery()));

      expect(getInDeliveryVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.inDeliveryVolumes).toEqual([inDeliveryVolume]);
      expect(state.missingVolumes).toEqual([]);
      expect(state.releasedVolumes).toEqual([]);
      expect(state.upcomingVolumes).toEqual([]);
      expect(state.collectedVolumes).toEqual(new Map());
    });

    it('should handle empty in delivery volumes array', async () => {
      getInDeliveryVolumesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Volumes.GetInDelivery()));

      expect(getInDeliveryVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.inDeliveryVolumes).toEqual([]);
    });

    it('should update inDeliveryVolumes selector after GetInDelivery action', async () => {
      const inDeliveryVolume = new VolumeModel({
        ...mockVolume,
        id: 'in-delivery-1',
        inDelivery: true,
      });
      getInDeliveryVolumesUseCase.execute.mockResolvedValueOnce([inDeliveryVolume]);

      await firstValueFrom(store.dispatch(new Volumes.GetInDelivery()));

      const inDeliveryVolumes = store.selectSnapshot(VolumesStateSelectors.inDeliveryVolumes);
      expect(inDeliveryVolumes).toEqual([inDeliveryVolume]);
    });

    it('should not affect other volume lists when getting in delivery volumes', async () => {
      const inDeliveryVolume = new VolumeModel({
        ...mockVolume,
        id: 'in-delivery-1',
        inDelivery: true,
      });
      getInDeliveryVolumesUseCase.execute.mockResolvedValueOnce([inDeliveryVolume]);

      await firstValueFrom(store.dispatch(new Volumes.GetInDelivery()));

      const missingVolumes = store.selectSnapshot(VolumesStateSelectors.missingVolumes);
      const releasedVolumes = store.selectSnapshot(VolumesStateSelectors.releasedVolumes);
      const upcomingVolumes = store.selectSnapshot(VolumesStateSelectors.upcomingVolumes);
      const collectedVolumes = store.selectSnapshot(VolumesStateSelectors.collectedVolumes);

      expect(missingVolumes).toEqual([]);
      expect(releasedVolumes).toEqual([]);
      expect(upcomingVolumes).toEqual([]);
      expect(collectedVolumes).toEqual(new Map());
    });
  });

  describe('getReleasedVolumes', () => {
    it('should execute GetReleased use-case and update releasedVolumes in state', async () => {
      const releasedVolume = new VolumeModel({
        ...mockVolume,
        id: 'released-1',
        releaseDate: new Date('2020-01-01'),
        purchaseDate: null,
        inDelivery: false,
      });
      getReleasedVolumesUseCase.execute.mockResolvedValueOnce([releasedVolume]);

      await firstValueFrom(store.dispatch(new Volumes.GetReleased()));

      expect(getReleasedVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.releasedVolumes).toEqual([releasedVolume]);
      expect(state.missingVolumes).toEqual([]);
      expect(state.inDeliveryVolumes).toEqual([]);
      expect(state.upcomingVolumes).toEqual([]);
      expect(state.collectedVolumes).toEqual(new Map());
    });

    it('should handle empty released volumes array', async () => {
      getReleasedVolumesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Volumes.GetReleased()));

      expect(getReleasedVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.releasedVolumes).toEqual([]);
    });

    it('should update releasedVolumes selector after GetReleased action', async () => {
      const releasedVolume = new VolumeModel({
        ...mockVolume,
        id: 'released-1',
        releaseDate: new Date('2020-01-01'),
        purchaseDate: null,
        inDelivery: false,
      });
      getReleasedVolumesUseCase.execute.mockResolvedValueOnce([releasedVolume]);

      await firstValueFrom(store.dispatch(new Volumes.GetReleased()));

      const releasedVolumes = store.selectSnapshot(VolumesStateSelectors.releasedVolumes);
      expect(releasedVolumes).toEqual([releasedVolume]);
    });

    it('should not affect other volume lists when getting released volumes', async () => {
      const releasedVolume = new VolumeModel({
        ...mockVolume,
        id: 'released-1',
        releaseDate: new Date('2020-01-01'),
        purchaseDate: null,
        inDelivery: false,
      });
      getReleasedVolumesUseCase.execute.mockResolvedValueOnce([releasedVolume]);

      await firstValueFrom(store.dispatch(new Volumes.GetReleased()));

      const missingVolumes = store.selectSnapshot(VolumesStateSelectors.missingVolumes);
      const inDeliveryVolumes = store.selectSnapshot(VolumesStateSelectors.inDeliveryVolumes);
      const upcomingVolumes = store.selectSnapshot(VolumesStateSelectors.upcomingVolumes);
      const collectedVolumes = store.selectSnapshot(VolumesStateSelectors.collectedVolumes);

      expect(missingVolumes).toEqual([]);
      expect(inDeliveryVolumes).toEqual([]);
      expect(upcomingVolumes).toEqual([]);
      expect(collectedVolumes).toEqual(new Map());
    });
  });

  describe('getUpcomingVolumes', () => {
    it('should execute GetUpcoming use-case and update upcomingVolumes in state', async () => {
      const upcomingVolume = new VolumeModel({
        ...mockVolume,
        id: 'upcoming-1',
        releaseDate: new Date('2099-01-01'),
        purchaseDate: null,
        inDelivery: false,
      });
      getUpcomingVolumesUseCase.execute.mockResolvedValueOnce([upcomingVolume]);

      await firstValueFrom(store.dispatch(new Volumes.GetUpcoming()));

      expect(getUpcomingVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.upcomingVolumes).toEqual([upcomingVolume]);
      expect(state.missingVolumes).toEqual([]);
      expect(state.inDeliveryVolumes).toEqual([]);
      expect(state.releasedVolumes).toEqual([]);
      expect(state.collectedVolumes).toEqual(new Map());
    });

    it('should handle empty upcoming volumes array', async () => {
      getUpcomingVolumesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Volumes.GetUpcoming()));

      expect(getUpcomingVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.upcomingVolumes).toEqual([]);
    });

    it('should update upcomingVolumes selector after GetUpcoming action', async () => {
      const upcomingVolume = new VolumeModel({
        ...mockVolume,
        id: 'upcoming-1',
        releaseDate: new Date('2099-01-01'),
        purchaseDate: null,
        inDelivery: false,
      });
      getUpcomingVolumesUseCase.execute.mockResolvedValueOnce([upcomingVolume]);

      await firstValueFrom(store.dispatch(new Volumes.GetUpcoming()));

      const upcomingVolumes = store.selectSnapshot(VolumesStateSelectors.upcomingVolumes);
      expect(upcomingVolumes).toEqual([upcomingVolume]);
    });

    it('should not affect other volume lists when getting upcoming volumes', async () => {
      const upcomingVolume = new VolumeModel({
        ...mockVolume,
        id: 'upcoming-1',
        releaseDate: new Date('2099-01-01'),
        purchaseDate: null,
        inDelivery: false,
      });
      getUpcomingVolumesUseCase.execute.mockResolvedValueOnce([upcomingVolume]);

      await firstValueFrom(store.dispatch(new Volumes.GetUpcoming()));

      const missingVolumes = store.selectSnapshot(VolumesStateSelectors.missingVolumes);
      const inDeliveryVolumes = store.selectSnapshot(VolumesStateSelectors.inDeliveryVolumes);
      const releasedVolumes = store.selectSnapshot(VolumesStateSelectors.releasedVolumes);
      const collectedVolumes = store.selectSnapshot(VolumesStateSelectors.collectedVolumes);

      expect(missingVolumes).toEqual([]);
      expect(inDeliveryVolumes).toEqual([]);
      expect(releasedVolumes).toEqual([]);
      expect(collectedVolumes).toEqual(new Map());
    });
  });

  describe('getCollectedVolumes', () => {
    it('should execute GetCollected use-case and update collectedVolumes in state', async () => {
      const collectedVolume = new VolumeModel({
        ...mockVolume,
        id: 'collected-1',
        purchaseDate: new Date(),
        inDelivery: false,
      });
      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(
        new Map([[mockSeries, [collectedVolume]]]),
      );

      await firstValueFrom(store.dispatch(new Volumes.GetCollected()));

      expect(getCollectedVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.collectedVolumes.size).toBe(1);
      expect(state.missingVolumes).toEqual([]);
      expect(state.inDeliveryVolumes).toEqual([]);
      expect(state.releasedVolumes).toEqual([]);
      expect(state.upcomingVolumes).toEqual([]);
    });

    it('should handle empty collected volumes map', async () => {
      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(new Map());

      await firstValueFrom(store.dispatch(new Volumes.GetCollected()));

      expect(getCollectedVolumesUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.collectedVolumes).toEqual(new Map());
    });

    it('should update collectedVolumes selector after GetCollected action', async () => {
      const collectedVolume = new VolumeModel({
        ...mockVolume,
        id: 'collected-1',
        purchaseDate: new Date(),
        inDelivery: false,
      });
      const collectedMap = new Map<SeriesModel, VolumeModel[]>([[mockSeries, [collectedVolume]]]);
      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(collectedMap);

      await firstValueFrom(store.dispatch(new Volumes.GetCollected()));

      const collectedVolumes = store.selectSnapshot(VolumesStateSelectors.collectedVolumes);
      expect(collectedVolumes.size).toBe(1);
    });

    it('should not affect other volume lists when getting collected volumes', async () => {
      const collectedVolume = new VolumeModel({
        ...mockVolume,
        id: 'collected-1',
        purchaseDate: new Date(),
        inDelivery: false,
      });
      const collectedMap = new Map<SeriesModel, VolumeModel[]>([[mockSeries, [collectedVolume]]]);
      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(collectedMap);

      await firstValueFrom(store.dispatch(new Volumes.GetCollected()));

      const missingVolumes = store.selectSnapshot(VolumesStateSelectors.missingVolumes);
      const inDeliveryVolumes = store.selectSnapshot(VolumesStateSelectors.inDeliveryVolumes);
      const releasedVolumes = store.selectSnapshot(VolumesStateSelectors.releasedVolumes);
      const upcomingVolumes = store.selectSnapshot(VolumesStateSelectors.upcomingVolumes);

      expect(missingVolumes).toEqual([]);
      expect(inDeliveryVolumes).toEqual([]);
      expect(releasedVolumes).toEqual([]);
      expect(upcomingVolumes).toEqual([]);
    });
  });

  describe('createVolume', () => {
    it('should execute Create use-case and add volume to missingVolumes when missing', async () => {
      const createModel = new CreateVolumeModel({
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        ...createModel,
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);

      await firstValueFrom(store.dispatch(new Volumes.Create(createModel)));

      expect(createVolumeUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createVolumeUseCase.execute).toHaveBeenCalledWith(createModel);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toHaveLength(1);
      expect(state.missingVolumes[0].id).toBe('new-volume-id');
    });

    it('should add volume to inDeliveryVolumes when in delivery', async () => {
      const createModel = new CreateVolumeModel({
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: true,
        purchaseDate: null,
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        ...createModel,
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);

      await firstValueFrom(store.dispatch(new Volumes.Create(createModel)));

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.inDeliveryVolumes).toHaveLength(1);
      expect(state.inDeliveryVolumes[0].id).toBe('new-volume-id');
    });

    it('should add volume to collectedVolumes when collected', async () => {
      const createModel = new CreateVolumeModel({
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: new Date(),
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        ...createModel,
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);
      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(
        new Map([[mockSeries, [createdVolume]]]),
      );

      await firstValueFrom(store.dispatch(new Volumes.Create(createModel)));

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.collectedVolumes.size).toBe(1);
    });

    it('should not add volume if use-case returns null', async () => {
      createVolumeUseCase.execute.mockResolvedValueOnce(null);
      const createModel = new CreateVolumeModel({
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      await firstValueFrom(store.dispatch(new Volumes.Create(createModel)));

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toEqual([]);
      expect(state.inDeliveryVolumes).toEqual([]);
      expect(state.collectedVolumes).toEqual(new Map());
    });

    it('should update missingVolumes selector after Create action for missing volume', async () => {
      const createModel = new CreateVolumeModel({
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        ...createModel,
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);

      await firstValueFrom(store.dispatch(new Volumes.Create(createModel)));

      const missingVolumes = store.selectSnapshot(VolumesStateSelectors.missingVolumes);
      expect(missingVolumes).toHaveLength(1);
      expect(missingVolumes[0].id).toBe('new-volume-id');
    });
  });

  describe('createVolumeForSeries', () => {
    it('should execute Create use-case with series and createVolumeModel and add volume to missingVolumes when missing', async () => {
      const createSeriesVolumeModel = new CreateSeriesVolumeModel({
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);

      await firstValueFrom(
        store.dispatch(new Series.AddVolumeToSeries(mockSeries, createSeriesVolumeModel)),
      );

      expect(createVolumeUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createVolumeUseCase.execute).toHaveBeenCalledWith({
        series: mockSeries,
        ...createSeriesVolumeModel,
      });

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toHaveLength(1);
      expect(state.missingVolumes[0].id).toBe('new-volume-id');
    });

    it('should add volume to inDeliveryVolumes when in delivery', async () => {
      const createSeriesVolumeModel = new CreateSeriesVolumeModel({
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: true,
        purchaseDate: null,
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: true,
        purchaseDate: null,
        volumeTags: [],
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);

      await firstValueFrom(
        store.dispatch(new Series.AddVolumeToSeries(mockSeries, createSeriesVolumeModel)),
      );

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.inDeliveryVolumes).toHaveLength(1);
      expect(state.inDeliveryVolumes[0].id).toBe('new-volume-id');
    });

    it('should add volume to collectedVolumes when collected', async () => {
      const createSeriesVolumeModel = new CreateSeriesVolumeModel({
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: new Date(),
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: new Date(),
        volumeTags: [],
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);
      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(
        new Map([[mockSeries, [createdVolume]]]),
      );

      await firstValueFrom(
        store.dispatch(new Series.AddVolumeToSeries(mockSeries, createSeriesVolumeModel)),
      );

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.collectedVolumes.size).toBe(1);
    });

    it('should add volume to releasedVolumes when released', async () => {
      const createSeriesVolumeModel = new CreateSeriesVolumeModel({
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: new Date('2020-01-01'),
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: new Date('2020-01-01'),
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);

      await firstValueFrom(
        store.dispatch(new Series.AddVolumeToSeries(mockSeries, createSeriesVolumeModel)),
      );

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.releasedVolumes).toHaveLength(1);
      expect(state.releasedVolumes[0].id).toBe('new-volume-id');
    });

    it('should add volume to upcomingVolumes when upcoming', async () => {
      const createSeriesVolumeModel = new CreateSeriesVolumeModel({
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: new Date('2099-01-01'),
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: new Date('2099-01-01'),
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);

      await firstValueFrom(
        store.dispatch(new Series.AddVolumeToSeries(mockSeries, createSeriesVolumeModel)),
      );

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.upcomingVolumes).toHaveLength(1);
      expect(state.upcomingVolumes[0].id).toBe('new-volume-id');
    });

    it('should not add volume if use-case returns null', async () => {
      createVolumeUseCase.execute.mockResolvedValueOnce(null);
      const createSeriesVolumeModel = new CreateSeriesVolumeModel({
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      await firstValueFrom(
        store.dispatch(new Series.AddVolumeToSeries(mockSeries, createSeriesVolumeModel)),
      );

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toEqual([]);
      expect(state.inDeliveryVolumes).toEqual([]);
      expect(state.collectedVolumes).toEqual(new Map());
      expect(state.releasedVolumes).toEqual([]);
      expect(state.upcomingVolumes).toEqual([]);
    });

    it('should update missingVolumes selector after AddVolumeToSeries action for missing volume', async () => {
      const createSeriesVolumeModel = new CreateSeriesVolumeModel({
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);

      await firstValueFrom(
        store.dispatch(new Series.AddVolumeToSeries(mockSeries, createSeriesVolumeModel)),
      );

      const missingVolumes = store.selectSnapshot(VolumesStateSelectors.missingVolumes);
      expect(missingVolumes).toHaveLength(1);
      expect(missingVolumes[0].id).toBe('new-volume-id');
    });

    it('should update inDeliveryVolumes selector after AddVolumeToSeries action for in delivery volume', async () => {
      const createSeriesVolumeModel = new CreateSeriesVolumeModel({
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: true,
        purchaseDate: null,
        volumeTags: [],
      });

      const createdVolume = new VolumeModel({
        id: 'new-volume-id',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: null,
        inDelivery: true,
        purchaseDate: null,
        volumeTags: [],
      });
      createVolumeUseCase.execute.mockResolvedValueOnce(createdVolume);

      await firstValueFrom(
        store.dispatch(new Series.AddVolumeToSeries(mockSeries, createSeriesVolumeModel)),
      );

      const inDeliveryVolumes = store.selectSnapshot(VolumesStateSelectors.inDeliveryVolumes);
      expect(inDeliveryVolumes).toHaveLength(1);
      expect(inDeliveryVolumes[0].id).toBe('new-volume-id');
    });
  });

  describe('updateVolume', () => {
    it('should execute Update use-case and update all volume lists', async () => {
      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));
      await firstValueFrom(store.dispatch(new Volumes.GetInDelivery()));
      await firstValueFrom(store.dispatch(new Volumes.GetReleased()));
      await firstValueFrom(store.dispatch(new Volumes.GetUpcoming()));
      await firstValueFrom(store.dispatch(new Volumes.GetCollected()));

      const updateModel = new UpdateVolumeModel({
        id: '1',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: 'https://updated.example.com',
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      const updatedVolume = new VolumeModel({
        ...updateModel,
      });
      updateVolumeUseCase.execute.mockResolvedValueOnce(updatedVolume);

      getMissingVolumesUseCase.execute.mockResolvedValueOnce([updatedVolume]);
      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(new Map());
      getInDeliveryVolumesUseCase.execute.mockResolvedValueOnce([]);
      getReleasedVolumesUseCase.execute.mockResolvedValueOnce([]);
      getUpcomingVolumesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Volumes.Update(updateModel)));

      expect(updateVolumeUseCase.execute).toHaveBeenCalledTimes(1);
      expect(updateVolumeUseCase.execute).toHaveBeenCalledWith(updateModel);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toEqual([updatedVolume]);
    });

    it('should not update volumes if use-case returns null', async () => {
      updateVolumeUseCase.execute.mockResolvedValueOnce(null);
      const updateModel = new UpdateVolumeModel({
        id: '1',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: 'https://updated.example.com',
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      await firstValueFrom(store.dispatch(new Volumes.Update(updateModel)));

      expect(updateVolumeUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toEqual([]);
    });

    it('should update missingVolumes selector after Update action', async () => {
      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));

      const updateModel = new UpdateVolumeModel({
        id: '1',
        series: mockSeries,
        sequenceNumber: 2,
        shoppingLink: 'https://updated.example.com',
        releaseDate: null,
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      const updatedVolume = new VolumeModel({
        ...updateModel,
      });
      updateVolumeUseCase.execute.mockResolvedValueOnce(updatedVolume);

      getMissingVolumesUseCase.execute.mockResolvedValueOnce([updatedVolume]);
      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(new Map());
      getInDeliveryVolumesUseCase.execute.mockResolvedValueOnce([]);
      getReleasedVolumesUseCase.execute.mockResolvedValueOnce([]);
      getUpcomingVolumesUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new Volumes.Update(updateModel)));

      const missingVolumes = store.selectSnapshot(VolumesStateSelectors.missingVolumes);
      expect(missingVolumes).toEqual([updatedVolume]);
    });
  });

  describe('deleteVolume', () => {
    it('should execute Delete use-case and remove volume from all lists', async () => {
      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));
      await firstValueFrom(store.dispatch(new Volumes.GetInDelivery()));
      await firstValueFrom(store.dispatch(new Volumes.GetReleased()));
      await firstValueFrom(store.dispatch(new Volumes.GetUpcoming()));
      await firstValueFrom(store.dispatch(new Volumes.GetCollected()));

      await firstValueFrom(store.dispatch(new Volumes.Delete('1')));

      expect(deleteVolumeUseCase.execute).toHaveBeenCalledTimes(1);
      expect(deleteVolumeUseCase.execute).toHaveBeenCalledWith('1');

      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(new Map());

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toHaveLength(0);
      expect(state.inDeliveryVolumes).toHaveLength(0);
      expect(state.releasedVolumes).toHaveLength(0);
      expect(state.upcomingVolumes).toHaveLength(0);
      expect(state.collectedVolumes).toEqual(new Map());
    });

    it('should not remove volume if use-case returns false', async () => {
      deleteVolumeUseCase.execute.mockResolvedValueOnce(false);
      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));

      await firstValueFrom(store.dispatch(new Volumes.Delete('1')));

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toHaveLength(1);
    });

    it('should update missingVolumes selector after Delete action', async () => {
      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));

      await firstValueFrom(store.dispatch(new Volumes.Delete('1')));

      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(new Map());

      const missingVolumes = store.selectSnapshot(VolumesStateSelectors.missingVolumes);
      expect(missingVolumes).toHaveLength(0);
    });

    it('should remove volume from all lists when deleted', async () => {
      const inDeliveryVolume = new VolumeModel({
        ...mockVolume,
        id: 'in-delivery-1',
        inDelivery: true,
      });
      const releasedVolume = new VolumeModel({
        ...mockVolume,
        id: 'released-1',
        releaseDate: new Date('2020-01-01'),
        purchaseDate: null,
        inDelivery: false,
      });
      const upcomingVolume = new VolumeModel({
        ...mockVolume,
        id: 'upcoming-1',
        releaseDate: new Date('2099-01-01'),
        purchaseDate: null,
        inDelivery: false,
      });

      getMissingVolumesUseCase.execute.mockResolvedValueOnce([mockVolume]);
      getInDeliveryVolumesUseCase.execute.mockResolvedValueOnce([inDeliveryVolume]);
      getReleasedVolumesUseCase.execute.mockResolvedValueOnce([releasedVolume]);
      getUpcomingVolumesUseCase.execute.mockResolvedValueOnce([upcomingVolume]);
      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(new Map());

      await firstValueFrom(store.dispatch(new Volumes.GetMissing()));
      await firstValueFrom(store.dispatch(new Volumes.GetInDelivery()));
      await firstValueFrom(store.dispatch(new Volumes.GetReleased()));
      await firstValueFrom(store.dispatch(new Volumes.GetUpcoming()));
      await firstValueFrom(store.dispatch(new Volumes.GetCollected()));

      await firstValueFrom(store.dispatch(new Volumes.Delete(mockVolume.id)));

      getCollectedVolumesUseCase.execute.mockResolvedValueOnce(new Map());

      const state = store.selectSnapshot(VolumesStateSelectors.stateModel);
      expect(state.missingVolumes).toEqual([]);
      expect(state.inDeliveryVolumes).toEqual([inDeliveryVolume]);
      expect(state.releasedVolumes).toEqual([releasedVolume]);
      expect(state.upcomingVolumes).toEqual([upcomingVolume]);
    });
  });
});
