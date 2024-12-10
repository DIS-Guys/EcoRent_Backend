import { Request, Response } from 'express';
import Device, { IDevice } from '../models/Device';
import { parseFormData } from '../utils/parseFormData';
import { deleteFromS3, uploadToS3 } from '../config/s3';

export const addDevice = async (req: Request, res: Response) => {
  const deviceInfo = req.body;
  const deviceImages = req.files;

  try {
    const parsedDevice = parseFormData(deviceInfo);
    const uploadedImages = await Promise.all(
      (deviceImages as Express.Multer.File[]).map((file) => uploadToS3(file))
    );
    const imageUrls = uploadedImages.map((image) => image.Location);

    const device: IDevice = new Device({
      ...parsedDevice,
      images: imageUrls,
    });
    await device.save();

    res.status(201).json({ message: 'Device added', device });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDevice = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.status(200).json({ device });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllDevices = async (req: Request, res: Response) => {
  try {
    const devices = await Device.find().populate('ownerId', 'town');

    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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
      return res.status(404).json({ message: 'Device not found' });
    }

    res.status(200).json({ message: 'Device updated', updatedDevice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const device = await Device.findById(id);

    if (!device) {
      throw new Error('Device not found');
    }

    const images = device.images;
    await Promise.all(images.map((url) => deleteFromS3(url)));
    await Device.findByIdAndDelete(id);

    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
