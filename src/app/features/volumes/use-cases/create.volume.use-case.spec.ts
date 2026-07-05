import { TestBed } from '@angular/core/testing';

import { SeriesMediaTypes } from '../../series/model/media-type.model';
import { SeriesModel } from '../../series/model/series.model';
import { SecondVolumeInSingleVolumeSeriesError } from '../errors';
import { CreateVolumeModel } from '../model/create.volume.model';
import { VolumeModel } from '../model/volume.model';
import { VolumesRepository } from '../repository/volumes.repository';
import { CreateVolumeUseCase } from './create.volume.use-case';
import SeriesMediaType = SeriesMediaTypes.SeriesMediaType;

describe('CreateVolumeUseCase', () => {
  let useCase: CreateVolumeUseCase;
  let mockRepository: jest.Mocked<VolumesRepository>;

  const mockSeries = new SeriesModel({
    id: 'series-1',
    name: 'Test Series',
    mediaType: SeriesMediaType.BOOK,
    completed: false,
    highestVolumeNumber: 2,
    seriesTags: [],
    abbreviation: 'TS',
    singleVolume: false,
  });

  const mockSingleVolumeSeries = new SeriesModel({
    ...mockSeries,
    singleVolume: true,
    highestVolumeNumber: 0,
  });

  const mockExistingVolume = new VolumeModel({
    id: 'volume-1',
    series: mockSingleVolumeSeries,
    sequenceNumber: 1,
    shoppingLink: null,
    releaseDate: new Date(),
    inDelivery: false,
    purchaseDate: null,
    volumeTags: [],
  });

  const mockCreatedVolume = new VolumeModel({
    ...mockExistingVolume,
    id: 'volume-2',
    sequenceNumber: 2,
  });

  beforeEach(() => {
    mockRepository = {
      getVolumesBySeries: jest.fn(),
      createVolume: jest.fn(),
    } as unknown as jest.Mocked<VolumesRepository>;

    TestBed.configureTestingModule({
      providers: [CreateVolumeUseCase, { provide: VolumesRepository, useValue: mockRepository }],
    });

    useCase = TestBed.inject(CreateVolumeUseCase);
  });

  describe('execute', () => {
    it('should create volume when series is single-volume with no existing volumes', async () => {
      const input = new CreateVolumeModel({
        series: mockSingleVolumeSeries,
        sequenceNumber: 1,
        shoppingLink: null,
        releaseDate: new Date(),
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      mockRepository.getVolumesBySeries.mockResolvedValue([]);
      mockRepository.createVolume.mockResolvedValue(mockCreatedVolume);

      const result = await useCase.execute(input);

      expect(result).toEqual(mockCreatedVolume);
      expect(mockRepository.getVolumesBySeries).toHaveBeenCalledWith(mockSingleVolumeSeries.id);
      expect(mockRepository.createVolume).toHaveBeenCalledWith(input);
    });

    it('should throw SecondVolumeInSingleVolumeSeriesError when series is single-volume with an existing volume', async () => {
      const input = new CreateVolumeModel({
        series: mockSingleVolumeSeries,
        sequenceNumber: 2,
        shoppingLink: null,
        releaseDate: new Date(),
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      mockRepository.getVolumesBySeries.mockResolvedValue([mockExistingVolume]);

      await expect(useCase.execute(input)).rejects.toThrow(SecondVolumeInSingleVolumeSeriesError);

      expect(mockRepository.getVolumesBySeries).toHaveBeenCalledWith(mockSingleVolumeSeries.id);
      expect(mockRepository.createVolume).not.toHaveBeenCalled();
    });

    it('should create volume when series is not single-volume with no existing volumes and not call getVolumesBySeries', async () => {
      const input = new CreateVolumeModel({
        series: mockSeries,
        sequenceNumber: 1,
        shoppingLink: null,
        releaseDate: new Date(),
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      mockRepository.createVolume.mockResolvedValue(mockCreatedVolume);

      const result = await useCase.execute(input);

      expect(result).toEqual(mockCreatedVolume);
      expect(mockRepository.getVolumesBySeries).not.toHaveBeenCalled();
      expect(mockRepository.createVolume).toHaveBeenCalledWith(input);
    });

    it('should create volume when series is not single-volume with existing volumes and not call getVolumesBySeries', async () => {
      const input = new CreateVolumeModel({
        series: mockSeries,
        sequenceNumber: 3,
        shoppingLink: null,
        releaseDate: new Date(),
        inDelivery: false,
        purchaseDate: null,
        volumeTags: [],
      });

      mockRepository.createVolume.mockResolvedValue(mockCreatedVolume);

      const result = await useCase.execute(input);

      expect(result).toEqual(mockCreatedVolume);
      expect(mockRepository.getVolumesBySeries).not.toHaveBeenCalled();
      expect(mockRepository.createVolume).toHaveBeenCalledWith(input);
    });
  });
});
