import { IDevice } from '../../models/Device';
import { DeviceData } from '../device.interface';

export interface IDeviceService {
  createDevice(
    deviceInfo: DeviceData,
    deviceImages: Express.Multer.File[],
    userId: string,
  ): Promise<IDevice>;
  getDevice(id: string): Promise<IDevice | null>;
  getDevicesByOwnerId(ownerId: string): Promise<IDevice[]>;
  getAllDevices(): Promise<IDevice[]>;
  updateDevice(
    id: string,
    updates: Partial<IDevice>,
    ownerId: string,
  ): Promise<IDevice>;
  deleteDevice(id: string, ownerId: string): Promise<void>;
}
