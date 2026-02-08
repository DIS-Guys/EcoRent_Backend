import { deleteFromS3, uploadToS3 } from '../config/s3';
import { DeviceImage } from '../interfaces/device.interface';
import Device, { IDevice } from '../models/Device';

export class DeviceService {
  static async createDevice(
    parsedDeviceInfo: Record<string, unknown>,
    deviceImages: Express.Multer.File[],
    userId: string,
  ) {
    const uploadedImages = await Promise.all(
      deviceImages.map((file) => uploadToS3(file)),
    );
    const imageUrls = uploadedImages.map((image) => image.Location);

    const { imageDimensions, ...deviceData } = parsedDeviceInfo;

    const typedDimensions = imageDimensions as {
      width: number;
      height: number;
    }[];

    const images: DeviceImage[] = imageUrls.map((url, index) => ({
      url,
      width: typedDimensions[index].width,
      height: typedDimensions[index].height,
    }));

    const device: IDevice = new Device({
      ...deviceData,
      isInRent: false,
      images,
      ownerId: userId,
    });

    await device.save();

    return device;
  }

  static async getDevice(id: string) {
    const device = await Device.findById(id).populate({
      path: 'ownerId',
      select: 'name surname phoneNumber town street region',
    });

    return device;
  }

  static async getDevicesByOwnerId(ownerId: string) {
    const devices = await Device.find({ ownerId });

    return devices;
  }

  static async getAllDevices() {
    const devices = await Device.find().populate('ownerId', 'town');

    return devices;
  }

  static async updateDevice(
    id: string,
    updates: Partial<IDevice>,
    ownerId: string,
  ) {
    const updatedDevice = await Device.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedDevice) {
      throw new Error('NOT_FOUND');
    }

    if (updatedDevice.ownerId.toString() !== ownerId) {
      throw new Error('FORBIDDEN');
    }

    return updatedDevice;
  }

  static async deleteDevice(id: string, ownerId: string) {
    const device = await Device.findById(id);
    if (!device) {
      throw new Error('NOT_FOUND');
    }

    if (device.ownerId.toString() !== ownerId) {
      throw new Error('FORBIDDEN');
    }

    const images = device.images;
    await Promise.all(images.map((image) => deleteFromS3(image.url)));
    await Device.findByIdAndDelete(id);
  }
}
