import { Request, Response } from 'express';
import Device, { IDevice } from '../models/Device';
import { parseFormData } from '../utils/parseFormData';
import { deleteFromS3, uploadToS3 } from '../config/s3';
import { DeviceImage } from '../interfaces/device.interface';

export const addDevice = async (req: Request, res: Response) => {
  const deviceInfo = req.body;
  const deviceImages = req.files as Express.Multer.File[];

  try {
    const parsedDeviceInfo = parseFormData(deviceInfo);
    const uploadedImages = await Promise.all(
      deviceImages.map((file) => uploadToS3(file))
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
      ownerId: (req as any).user.id,
    });
    await device.save();

    res.status(201).json({ message: 'Пристрій додано.' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const getDevice = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const device = await Device.findById(id).populate({
      path: 'ownerId',
      select: 'name surname town street region',
    });

    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const getDevicesByOwnerId = async (req: Request, res: Response) => {
  const ownerId = (req as any).user.id;

  try {
    const devices = await Device.find({ ownerId });

    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const getAllDevices = async (req: Request, res: Response) => {
  try {
    const devices = await Device.find().populate('ownerId', 'town');

    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedDevice = await Device.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Пристрій не знайдено.' });
    }

    res.status(200).json({ message: 'Дані пристрою оновлено.', updatedDevice });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const device = await Device.findById(id);

    if (!device) {
      throw new Error('Пристрій не знайдено.');
    }

    const images = device.images;
    await Promise.all(images.map((image) => deleteFromS3(image.url)));
    await Device.findByIdAndDelete(id);

    res.status(200).json({ message: 'Пристрій успішно видалено.' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};
