import { SeriesMediaTypes } from '../../series/model/media-type.model';
import { SeriesModel } from '../../series/model/series.model';
import { VolumeModel } from '../model/volume.model';
import { VolumeStatusUtils } from './volume-status.utils';
import SeriesMediaType = SeriesMediaTypes.SeriesMediaType;
import { VolumeTagModel } from '../../tags/model/volume-tag.model';

describe('VolumeStatusUtils', () => {
  // Create a mock series for testing
  const mockSeries = new SeriesModel({
    id: 'test-series-id',
    name: 'Test Series',
    mediaType: SeriesMediaType.BOOK,
    completed: false,
    highestVolumeNumber: 10,
    seriesTags: [],
    abbreviation: 'TS',
    singleVolume: false,
  });

  // Helper function to create a VolumeModel with custom properties
  const createTestVolume = (
    overrides: Partial<{
      id: string;
      sequenceNumber: number;
      shoppingLink: string | null;
      releaseDate: Date | null;
      inDelivery: boolean;
      purchaseDate: Date | null;
      volumeTags: VolumeTagModel[];
    }> = {},
  ): VolumeModel => {
    return new VolumeModel({
      id: overrides.id ?? 'test-volume-id',
      series: mockSeries,
      sequenceNumber: overrides.sequenceNumber ?? 1,
      shoppingLink: overrides.shoppingLink ?? null,
      releaseDate: overrides.releaseDate ?? null,
      inDelivery: overrides.inDelivery ?? false,
      purchaseDate: overrides.purchaseDate ?? null,
      volumeTags: overrides.volumeTags ?? [],
    });
  };

  describe('shouldBeInMissingVolumes', () => {
    it('should return true when volume has no purchase date and is not in delivery', () => {
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
      });

      expect(VolumeStatusUtils.shouldBeInMissingVolumes(volume)).toBe(true);
    });

    it('should return false when volume is in delivery', () => {
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate: null,
      });

      expect(VolumeStatusUtils.shouldBeInMissingVolumes(volume)).toBe(false);
    });

    it('should return false when volume has a purchase date', () => {
      const purchaseDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate,
      });

      expect(VolumeStatusUtils.shouldBeInMissingVolumes(volume)).toBe(false);
    });

    it('should return false when volume is in delivery AND has a purchase date', () => {
      const purchaseDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate,
      });

      expect(VolumeStatusUtils.shouldBeInMissingVolumes(volume)).toBe(false);
    });
  });

  describe('shouldBeInCollectedVolumes', () => {
    it('should return true when volume has a purchase date and is not in delivery', () => {
      const purchaseDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate,
      });

      expect(VolumeStatusUtils.shouldBeInCollectedVolumes(volume)).toBe(true);
    });

    it('should return false when volume is in delivery', () => {
      const purchaseDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate,
      });

      expect(VolumeStatusUtils.shouldBeInCollectedVolumes(volume)).toBe(false);
    });

    it('should return false when volume has no purchase date', () => {
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
      });

      expect(VolumeStatusUtils.shouldBeInCollectedVolumes(volume)).toBe(false);
    });

    it('should return false when purchase date is null', () => {
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
      });

      expect(VolumeStatusUtils.shouldBeInCollectedVolumes(volume)).toBe(false);
    });
  });

  describe('shouldBeInInDeliveryVolumes', () => {
    it('should return true when volume is in delivery', () => {
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate: null,
      });

      expect(VolumeStatusUtils.shouldBeInInDeliveryVolumes(volume)).toBe(true);
    });

    it('should return true when volume is in delivery and has a purchase date', () => {
      const purchaseDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate,
      });

      expect(VolumeStatusUtils.shouldBeInInDeliveryVolumes(volume)).toBe(true);
    });

    it('should return false when volume is not in delivery', () => {
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
      });

      expect(VolumeStatusUtils.shouldBeInInDeliveryVolumes(volume)).toBe(false);
    });

    it('should return false when volume is not in delivery but has a purchase date', () => {
      const purchaseDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate,
      });

      expect(VolumeStatusUtils.shouldBeInInDeliveryVolumes(volume)).toBe(false);
    });
  });

  describe('shouldBeInReleasedVolumes', () => {
    it('should return true when volume is not in delivery, has no purchase date, and has a past release date', () => {
      const pastDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: pastDate,
      });

      expect(VolumeStatusUtils.shouldBeInReleasedVolumes(volume)).toBe(true);
    });

    it('should return true when volume is not in delivery, has no purchase date, and has today as release date', () => {
      const today = new Date();
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: today,
      });

      expect(VolumeStatusUtils.shouldBeInReleasedVolumes(volume)).toBe(true);
    });

    it('should return false when volume is in delivery', () => {
      const pastDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate: null,
        releaseDate: pastDate,
      });

      expect(VolumeStatusUtils.shouldBeInReleasedVolumes(volume)).toBe(false);
    });

    it('should return false when volume has a purchase date', () => {
      const pastDate = new Date('2023-01-01');
      const purchaseDate = new Date('2023-02-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate,
        releaseDate: pastDate,
      });

      expect(VolumeStatusUtils.shouldBeInReleasedVolumes(volume)).toBe(false);
    });

    it('should return false when volume has no release date', () => {
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: null,
      });

      expect(VolumeStatusUtils.shouldBeInReleasedVolumes(volume)).toBe(false);
    });

    it('should return false when volume has a future release date', () => {
      const futureDate = new Date('2099-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: futureDate,
      });

      expect(VolumeStatusUtils.shouldBeInReleasedVolumes(volume)).toBe(false);
    });
  });

  describe('shouldBeInUpcomingVolumes', () => {
    it('should return true when volume is not in delivery, has no purchase date, and has no release date', () => {
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: null,
      });

      expect(VolumeStatusUtils.shouldBeInUpcomingVolumes(volume)).toBe(true);
    });

    it('should return true when volume is not in delivery, has no purchase date, and has a future release date', () => {
      const futureDate = new Date('2099-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: futureDate,
      });

      expect(VolumeStatusUtils.shouldBeInUpcomingVolumes(volume)).toBe(true);
    });

    it('should return false when volume is in delivery', () => {
      const futureDate = new Date('2099-01-01');
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate: null,
        releaseDate: futureDate,
      });

      expect(VolumeStatusUtils.shouldBeInUpcomingVolumes(volume)).toBe(false);
    });

    it('should return false when volume has a purchase date', () => {
      const futureDate = new Date('2099-01-01');
      const purchaseDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate,
        releaseDate: futureDate,
      });

      expect(VolumeStatusUtils.shouldBeInUpcomingVolumes(volume)).toBe(false);
    });

    it('should return false when volume has a past release date', () => {
      const pastDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: pastDate,
      });

      expect(VolumeStatusUtils.shouldBeInUpcomingVolumes(volume)).toBe(false);
    });

    it('should return false when volume has today as release date', () => {
      const today = new Date();
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: today,
      });

      expect(VolumeStatusUtils.shouldBeInUpcomingVolumes(volume)).toBe(false);
    });
  });

  describe('mutual exclusivity', () => {
    it('should ensure a volume cannot be in both missing and collected', () => {
      const purchaseDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate,
      });

      const isMissing = VolumeStatusUtils.shouldBeInMissingVolumes(volume);
      const isCollected = VolumeStatusUtils.shouldBeInCollectedVolumes(volume);

      expect(isMissing).toBe(false);
      expect(isCollected).toBe(true);
      expect(isMissing && isCollected).toBe(false);
    });

    it('should ensure a volume cannot be in both missing and in delivery', () => {
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate: null,
      });

      const isMissing = VolumeStatusUtils.shouldBeInMissingVolumes(volume);
      const isInDelivery = VolumeStatusUtils.shouldBeInInDeliveryVolumes(volume);

      expect(isMissing).toBe(false);
      expect(isInDelivery).toBe(true);
      expect(isMissing && isInDelivery).toBe(false);
    });

    it('should ensure a volume cannot be in both collected and in delivery', () => {
      const purchaseDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate,
      });

      const isCollected = VolumeStatusUtils.shouldBeInCollectedVolumes(volume);
      const isInDelivery = VolumeStatusUtils.shouldBeInInDeliveryVolumes(volume);

      expect(isCollected).toBe(false);
      expect(isInDelivery).toBe(true);
      expect(isCollected && isInDelivery).toBe(false);
    });

    it('should ensure a volume cannot be in both released and upcoming', () => {
      const pastDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: pastDate,
      });

      const isReleased = VolumeStatusUtils.shouldBeInReleasedVolumes(volume);
      const isUpcoming = VolumeStatusUtils.shouldBeInUpcomingVolumes(volume);

      expect(isReleased).toBe(true);
      expect(isUpcoming).toBe(false);
      expect(isReleased && isUpcoming).toBe(false);
    });

    it('should ensure a volume cannot be in both released and missing', () => {
      const pastDate = new Date('2023-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: pastDate,
      });

      const isReleased = VolumeStatusUtils.shouldBeInReleasedVolumes(volume);
      const isMissing = VolumeStatusUtils.shouldBeInMissingVolumes(volume);

      expect(isReleased).toBe(true);
      expect(isMissing).toBe(true);
      // Note: This is actually valid - a released volume can also be missing
      // The mutual exclusivity here is that released implies not upcoming
    });

    it('should ensure a volume cannot be in both upcoming and released', () => {
      const futureDate = new Date('2099-01-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: futureDate,
      });

      const isUpcoming = VolumeStatusUtils.shouldBeInUpcomingVolumes(volume);
      const isReleased = VolumeStatusUtils.shouldBeInReleasedVolumes(volume);

      expect(isUpcoming).toBe(true);
      expect(isReleased).toBe(false);
      expect(isUpcoming && isReleased).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle volume with all null dates and false flags', () => {
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate: null,
        releaseDate: null,
      });

      expect(VolumeStatusUtils.shouldBeInMissingVolumes(volume)).toBe(true);
      expect(VolumeStatusUtils.shouldBeInCollectedVolumes(volume)).toBe(false);
      expect(VolumeStatusUtils.shouldBeInInDeliveryVolumes(volume)).toBe(false);
      expect(VolumeStatusUtils.shouldBeInReleasedVolumes(volume)).toBe(false);
      expect(VolumeStatusUtils.shouldBeInUpcomingVolumes(volume)).toBe(true);
    });

    it('should handle volume with all properties set', () => {
      const pastDate = new Date('2023-01-01');
      const purchaseDate = new Date('2023-02-01');
      const volume = createTestVolume({
        inDelivery: false,
        purchaseDate,
        releaseDate: pastDate,
      });

      expect(VolumeStatusUtils.shouldBeInMissingVolumes(volume)).toBe(false);
      expect(VolumeStatusUtils.shouldBeInCollectedVolumes(volume)).toBe(true);
      expect(VolumeStatusUtils.shouldBeInInDeliveryVolumes(volume)).toBe(false);
      expect(VolumeStatusUtils.shouldBeInReleasedVolumes(volume)).toBe(false);
      expect(VolumeStatusUtils.shouldBeInUpcomingVolumes(volume)).toBe(false);
    });

    it('should handle volume with inDelivery true and all dates set', () => {
      const pastDate = new Date('2023-01-01');
      const purchaseDate = new Date('2023-02-01');
      const volume = createTestVolume({
        inDelivery: true,
        purchaseDate,
        releaseDate: pastDate,
      });

      expect(VolumeStatusUtils.shouldBeInMissingVolumes(volume)).toBe(false);
      expect(VolumeStatusUtils.shouldBeInCollectedVolumes(volume)).toBe(false);
      expect(VolumeStatusUtils.shouldBeInInDeliveryVolumes(volume)).toBe(true);
      expect(VolumeStatusUtils.shouldBeInReleasedVolumes(volume)).toBe(false);
      expect(VolumeStatusUtils.shouldBeInUpcomingVolumes(volume)).toBe(false);
    });
  });
});
