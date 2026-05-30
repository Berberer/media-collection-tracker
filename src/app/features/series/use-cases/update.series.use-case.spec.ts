import { TestBed } from '@angular/core/testing';

import { VolumeModel } from '../../volumes/model/volume.model';
import { VolumesRepository } from '../../volumes/repository/volumes.repository';
import {
  SeriesCompletedWithMissingVolumesError,
  SeriesSingleVolumeWithMultipleVolumesError,
} from '../errors';
import { SeriesMediaTypes } from '../model/media-type.model';
import { SeriesModel } from '../model/series.model';
import { UpdateSeriesModel } from '../model/update.series.model';
import { SeriesRepository } from '../repository/series.repository';
import { UpdateSeriesUseCase } from './update.series.use-case';
import SeriesMediaType = SeriesMediaTypes.SeriesMediaType;

describe('UpdateSeriesUseCase', () => {
  let useCase: UpdateSeriesUseCase;
  let mockSeriesRepository: jest.Mocked<SeriesRepository>;
  let mockVolumesRepository: jest.Mocked<VolumesRepository>;

  const mockSeriesId = 'test-series-id';
  const mockSeries = new SeriesModel({
    id: mockSeriesId,
    name: 'Test Series',
    mediaType: SeriesMediaType.BOOK,
    completed: false,
    highestVolumeNumber: 5,
    seriesTags: [],
    abbreviation: 'TS',
    singleVolume: false,
  });

  const mockCompletedSeries = new SeriesModel({
    ...mockSeries,
    completed: true,
  });

  const mockVolume = new VolumeModel({
    id: 'volume-1',
    series: mockSeries,
    sequenceNumber: 1,
    shoppingLink: null,
    releaseDate: new Date(),
    inDelivery: false,
    purchaseDate: new Date(),
    volumeTags: [],
  });

  const mockMissingVolume = new VolumeModel({
    id: 'volume-2',
    series: mockSeries,
    sequenceNumber: 2,
    shoppingLink: null,
    releaseDate: new Date(),
    inDelivery: false,
    purchaseDate: null,
    volumeTags: [],
  });

  beforeEach(() => {
    mockSeriesRepository = {
      getSeriesById: jest.fn(),
      updateSeries: jest.fn(),
    } as unknown as jest.Mocked<SeriesRepository>;

    mockVolumesRepository = {
      getVolumesBySeries: jest.fn(),
    } as unknown as jest.Mocked<VolumesRepository>;

    TestBed.configureTestingModule({
      providers: [
        UpdateSeriesUseCase,
        { provide: SeriesRepository, useValue: mockSeriesRepository },
        { provide: VolumesRepository, useValue: mockVolumesRepository },
      ],
    });

    useCase = TestBed.inject(UpdateSeriesUseCase);
  });

  describe('execute', () => {
    const createUpdateModel = (overrides: Partial<UpdateSeriesModel> = {}): UpdateSeriesModel =>
      new UpdateSeriesModel({
        id: mockSeriesId,
        name: 'Updated Series',
        singleVolume: false,
        completed: false,
        mediaType: SeriesMediaType.BOOK,
        seriesTags: [],
        ...overrides,
      });

    it('should update series successfully when no validation errors', async () => {
      const updateModel = createUpdateModel();
      mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
      mockVolumesRepository.getVolumesBySeries.mockResolvedValue([mockVolume]);
      mockSeriesRepository.updateSeries.mockResolvedValue(mockSeries);

      const result = await useCase.execute(updateModel);

      expect(result).toEqual(mockSeries);
      expect(mockSeriesRepository.getSeriesById).toHaveBeenCalledWith(mockSeriesId);
      expect(mockVolumesRepository.getVolumesBySeries).toHaveBeenCalledWith(mockSeriesId);
      expect(mockSeriesRepository.updateSeries).toHaveBeenCalledWith(updateModel);
    });

    describe('single volume validation', () => {
      it('should throw SeriesSingleVolumeWithMultipleVolumesError when setting singleVolume=true with multiple volumes', async () => {
        const updateModel = createUpdateModel({ singleVolume: true });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([
          mockVolume,
          new VolumeModel({ ...mockVolume, id: 'volume-2', sequenceNumber: 2 }),
        ]);

        await expect(useCase.execute(updateModel)).rejects.toThrow(
          SeriesSingleVolumeWithMultipleVolumesError,
        );
      });

      it('should allow singleVolume=true with exactly one volume', async () => {
        const updateModel = createUpdateModel({ singleVolume: true });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([mockVolume]);
        mockSeriesRepository.updateSeries.mockResolvedValue(mockSeries);

        await expect(useCase.execute(updateModel)).resolves.toEqual(mockSeries);
      });

      it('should allow singleVolume=true with no volumes', async () => {
        const updateModel = createUpdateModel({ singleVolume: true });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([]);
        mockSeriesRepository.updateSeries.mockResolvedValue(mockSeries);

        await expect(useCase.execute(updateModel)).resolves.toEqual(mockSeries);
      });

      it('should not validate singleVolume if it remains false', async () => {
        const updateModel = createUpdateModel({ singleVolume: false });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([
          mockVolume,
          new VolumeModel({ ...mockVolume, id: 'volume-2', sequenceNumber: 2 }),
        ]);
        mockSeriesRepository.updateSeries.mockResolvedValue(mockSeries);

        await expect(useCase.execute(updateModel)).resolves.toEqual(mockSeries);
      });
    });

    describe('completed validation', () => {
      it('should throw SeriesCompletedWithMissingVolumesError when marking series as completed with missing volumes', async () => {
        const updateModel = createUpdateModel({ completed: true });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([mockVolume, mockMissingVolume]);

        await expect(useCase.execute(updateModel)).rejects.toThrow(
          SeriesCompletedWithMissingVolumesError,
        );
      });

      it('should allow marking series as completed when no volumes are missing', async () => {
        const updateModel = createUpdateModel({ completed: true });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([mockVolume]);
        mockSeriesRepository.updateSeries.mockResolvedValue(mockCompletedSeries);

        await expect(useCase.execute(updateModel)).resolves.toEqual(mockCompletedSeries);
      });

      it('should allow marking series as completed when it has no volumes', async () => {
        const updateModel = createUpdateModel({ completed: true });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([]);
        mockSeriesRepository.updateSeries.mockResolvedValue(mockCompletedSeries);

        await expect(useCase.execute(updateModel)).resolves.toEqual(mockCompletedSeries);
      });

      it('should not validate completed status if it remains false', async () => {
        const updateModel = createUpdateModel({ completed: false });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockCompletedSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([mockMissingVolume]);
        mockSeriesRepository.updateSeries.mockResolvedValue(mockSeries);

        await expect(useCase.execute(updateModel)).resolves.toEqual(mockSeries);
      });

      it('should not validate completed status if series is already completed', async () => {
        const updateModel = createUpdateModel({ completed: true });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockCompletedSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([mockMissingVolume]);
        mockSeriesRepository.updateSeries.mockResolvedValue(mockCompletedSeries);

        await expect(useCase.execute(updateModel)).resolves.toEqual(mockCompletedSeries);
      });
    });

    describe('combined validations', () => {
      it('should validate both singleVolume and completed in the same update', async () => {
        const updateModel = createUpdateModel({
          singleVolume: true,
          completed: true,
        });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([mockVolume]);
        mockSeriesRepository.updateSeries.mockResolvedValue(mockCompletedSeries);

        await expect(useCase.execute(updateModel)).resolves.toEqual(mockCompletedSeries);
      });

      it('should throw singleVolume error first if both validations would fail', async () => {
        const updateModel = createUpdateModel({
          singleVolume: true,
          completed: true,
        });
        mockSeriesRepository.getSeriesById.mockResolvedValue(mockSeries);
        mockVolumesRepository.getVolumesBySeries.mockResolvedValue([
          mockVolume,
          new VolumeModel({ ...mockVolume, id: 'volume-2', sequenceNumber: 2 }),
          mockMissingVolume,
        ]);

        await expect(useCase.execute(updateModel)).rejects.toThrow(
          SeriesSingleVolumeWithMultipleVolumesError,
        );
      });
    });
  });
});
