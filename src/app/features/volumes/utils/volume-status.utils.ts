import { VolumeModel } from '../model/volume.model';

export class VolumeStatusUtils {
  /**
   * Determines if a volume should be considered missing.
   * @param volume The volume to check.
   * @returns True if the volume should be considered missing, false otherwise.
   */
  static shouldBeInMissingVolumes(volume: VolumeModel): boolean {
    return !volume.inDelivery && !volume.purchaseDate;
  }

  /**
   * Determines if a volume should be considered collected.
   * @param volume The volume to check.
   * @returns True if the volume should be considered collected, false otherwise.
   */
  static shouldBeInCollectedVolumes(volume: VolumeModel): boolean {
    return volume.purchaseDate !== null && !volume.inDelivery;
  }

  /**
   * Determines if a volume should be considered in delivery.
   * @param volume The volume to check.
   * @returns True if the volume should be considered in delivery, false otherwise.
   */
  static shouldBeInInDeliveryVolumes(volume: VolumeModel): boolean {
    return volume.inDelivery;
  }

  /**
   * Determines if a volume should be considered released but missing.
   * @param volume The volume to check.
   * @returns True if the volume should be considered released, false otherwise.
   */
  static shouldBeInReleasedVolumes(volume: VolumeModel): boolean {
    return (
      !volume.inDelivery &&
      !volume.purchaseDate &&
      volume.releaseDate !== null &&
      volume.releaseDate <= new Date()
    );
  }

  /**
   * Determines if a volume should be considered upcoming.
   * @param volume The volume to check.
   * @returns True if the volume should be considered upcoming, false otherwise.
   */
  static shouldBeInUpcomingVolumes(volume: VolumeModel): boolean {
    return (
      !volume.inDelivery &&
      !volume.purchaseDate &&
      (volume.releaseDate === null || volume.releaseDate > new Date())
    );
  }
}
