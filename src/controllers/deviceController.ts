import { Request, Response } from 'express';
import Device, { IDevice } from '../models/Device';

export const createDevice = async (req: Request, res: Response) => {
  const {
    manufacturer,
    deviceModel,
    state,
    batteryCapacity,
    weight,
    typeC,
    typeA,
    sockets,
    remoteUse,
    sizeXYZ,
    batteryType,
    outputSignalForm,
    additional,
    images,
    price,
    isInRent,
    minRentTerm,
    maxRentTerm,
    ownerId,
  } = req.body;

  try {
    const newDevice: IDevice = new Device({
      manufacturer,
      deviceModel,
      state,
      batteryCapacity,
      weight,
      typeC,
      typeA,
      sockets,
      remoteUse,
      sizeXYZ,
      batteryType,
      outputSignalForm,
      additional,
      images,
      price,
      isInRent,
      minRentTerm,
      maxRentTerm,
      ownerId,
    });
    await newDevice.save();

    res.status(201).json({ message: 'Device created' });
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
    const deletedDevice = await Device.findByIdAndDelete(id);

    if (!deletedDevice) {
      return res.status(404).json({ message: 'device not found' });
    }

    res
      .status(200)
      .json({ message: 'Device deleted successfully', deletedDevice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
