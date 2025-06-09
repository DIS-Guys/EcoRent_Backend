import { IDeviceService } from '../../interfaces/services/IDeviceService';
import { deleteFromS3, uploadToS3 } from '../../config/s3';
import { DeviceData, DeviceImage } from '../../interfaces/device.interface';
import Device, { IDevice } from '../../models/Device';
import { parseFormData } from '../../utils/parseFormData';

export class DeviceService implements IDeviceService {
  async createDevice(
    deviceInfo: DeviceData,
    deviceImages: Express.Multer.File[],
    userId: string,
  ): Promise<IDevice> {
    const parsedDeviceInfo = parseFormData(deviceInfo);

    const uploadedImages = await Promise.all(
      deviceImages.map((file) => uploadToS3(file)),
    );
    const imageUrls = uploadedImages.map((image) => image.Location);

    const images: DeviceImage[] = imageUrls.map((url, index) => ({
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

  async getDevice(id: string): Promise<IDevice | null> {
    return await Device.findById(id).populate({
      path: 'ownerId',
      select: 'name surname phoneNumber town street region',
    });
  }

  async getDevicesByOwnerId(ownerId: string): Promise<IDevice[]> {
    return await Device.find({ ownerId });
  }

  async getAllDevices(): Promise<IDevice[]> {
    return await Device.find().populate('ownerId', 'town');
  }

  async updateDevice(
    id: string,
    updates: Partial<IDevice>,
    ownerId: string,
  ): Promise<IDevice> {
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

  async deleteDevice(id: string, ownerId: string): Promise<void> {
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
