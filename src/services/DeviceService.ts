import { DeviceData, DeviceImage } from '../interfaces/device.interface';
import Device, { IDevice } from '../models/Device';
import { parseFormData } from '../utils/parseFormData';
import storageService from './storageService';

export class DeviceService {
  static async createDevice(
    deviceInfo: DeviceData,
    deviceImages: Express.Multer.File[],
    userId: string,
  ) {
    const parsedDeviceInfo = parseFormData(deviceInfo);

    const uploadedImageUrls = await Promise.all(
      deviceImages.map((file) => storageService.upload(file))
    );

    const images: DeviceImage[] = uploadedImageUrls.map((url, index) => ({
      url,
      width: parsedDeviceInfo.imageDimensions[index].width,
      height: parsedDeviceInfo.imageDimensions[index].height,
    }));

    delete parsedDeviceInfo.imageDimensions;

    const device: IDevice = new Device({
      ...parsedDeviceInfo,
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

    if (!updatedDevice) throw new Error('NOT_FOUND');
    if (updatedDevice.ownerId.toString() !== ownerId) throw new Error('FORBIDDEN');

    return updatedDevice;
  }

  static async deleteDevice(id: string, ownerId: string) {
    const device = await Device.findById(id);
    if (!device) throw new Error('NOT_FOUND');
    if (device.ownerId.toString() !== ownerId) throw new Error('FORBIDDEN');

    const imageUrls = device.images.map((img) => img.url);
    await Promise.all(imageUrls.map((url) => storageService.delete(url)));

    await Device.findByIdAndDelete(id);
  }
}
