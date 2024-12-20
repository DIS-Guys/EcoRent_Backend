import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as s3Config from '../../src/config/s3';
import * as parseFormDataUtil from '../../src/utils/parseFormData';
import {
  addDevice,
  getDevice,
  getDevicesByOwnerId,
  getAllDevices,
  updateDevice,
  deleteDevice,
} from '../../src/controllers/deviceController';
import Device from '../../src/models/Device';
interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

jest.mock('../../src/models/Device');
jest.mock('../../src/config/s3');
jest.mock('../../src/utils/parseFormData');

describe('Device Controller', () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  const mockUser = { id: 'userId123' };

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('addDevice', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          title: 'Test Device',
          imageDimensions: '[{"width": 800, "height": 600}]',
        },
        files: [
          {
            originalname: 'test-image.jpg',
            buffer: Buffer.from('test'),
            mimetype: 'image/jpeg',
          },
        ] as Express.Multer.File[],
        user: mockUser,
      };
    });

    it('should successfully add a device', async () => {
      const mockParsedData = {
        title: 'Test Device',
        imageDimensions: [{ width: 800, height: 600 }],
      };
      const mockS3Response = { Location: 'https://test-url.com/image.jpg' };

      (parseFormDataUtil.parseFormData as jest.Mock).mockReturnValue(
        mockParsedData
      );
      (s3Config.uploadToS3 as jest.Mock).mockResolvedValue(mockS3Response);
      (Device.prototype.save as jest.Mock).mockResolvedValue({});

      await addDevice(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Пристрій додано.',
      });
    });

    it('should handle errors when adding a device', async () => {
      (Device.prototype.save as jest.Mock).mockRejectedValue(
        new Error('DB Error')
      );

      await addDevice(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Помилка сервера.',
        })
      );
    });
  });

  describe('getDevice', () => {
    const mockDeviceId = 'device123';

    beforeEach(() => {
      mockRequest = {
        params: { id: mockDeviceId },
      };
    });

    it('should successfully get a device by id', async () => {
      const mockDevice = {
        _id: mockDeviceId,
        title: 'Test Device',
        ownerId: {
          name: 'John',
          surname: 'Doe',
        },
      };

      (Device.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDevice),
      });

      await getDevice(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockDevice);
    });

    it('should handle errors when getting a device', async () => {
      (Device.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('DB Error')),
      });

      await getDevice(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Помилка сервера.',
        })
      );
    });
  });

  describe('getDevicesByOwnerId', () => {
    beforeEach(() => {
      mockRequest = {
        user: mockUser,
      };
    });

    it('should successfully get devices by owner id', async () => {
      const mockDevices = [
        { _id: 'device1', title: 'Device 1' },
        { _id: 'device2', title: 'Device 2' },
      ];

      (Device.find as jest.Mock).mockResolvedValue(mockDevices);

      await getDevicesByOwnerId(
        mockRequest as RequestWithUser,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockDevices);
    });

    it('should handle errors when getting devices by owner id', async () => {
      (Device.find as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await getDevicesByOwnerId(
        mockRequest as RequestWithUser,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Помилка сервера.',
        })
      );
    });
  });

  describe('getAllDevices', () => {
    it('should successfully get all devices', async () => {
      const mockDevices = [
        { _id: 'device1', title: 'Device 1', ownerId: { town: 'Town 1' } },
        { _id: 'device2', title: 'Device 2', ownerId: { town: 'Town 2' } },
      ];

      (Device.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDevices),
      });

      await getAllDevices({} as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockDevices);
    });

    it('should handle errors when getting all devices', async () => {
      (Device.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('DB Error')),
      });

      await getAllDevices({} as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Помилка сервера.',
        })
      );
    });
  });

  describe('updateDevice', () => {
    const mockDeviceId = 'device123';
    const mockUpdates = { title: 'Updated Device' };

    beforeEach(() => {
      mockRequest = {
        params: { id: mockDeviceId },
        body: mockUpdates,
      };
    });

    it('should successfully update a device', async () => {
      const mockUpdatedDevice = { _id: mockDeviceId, ...mockUpdates };

      (Device.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        mockUpdatedDevice
      );

      await updateDevice(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Дані пристрою оновлено.',
        updatedDevice: mockUpdatedDevice,
      });
    });

    it('should handle device not found', async () => {
      (Device.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateDevice(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Пристрій не знайдено.',
      });
    });
  });

  describe('deleteDevice', () => {
    const mockDeviceId = '507f1f77bcf86cd799439012';

    beforeEach(() => {
      mockRequest = {
        params: { id: mockDeviceId },
        user: mockUser,
      };
    });

    it('should handle device not found', async () => {
      (Device.findById as jest.Mock).mockResolvedValue(null);

      await deleteDevice(
        mockRequest as RequestWithUser,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Пристрій не знайдено.',
      });
    });

    it('should handle unauthorized deletion', async () => {
      const mockDevice = {
        _id: mockDeviceId,
        ownerId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
        images: [{ url: 'https://test-url.com/image.jpg' }],
      };

      (Device.findById as jest.Mock).mockResolvedValue(mockDevice);

      await deleteDevice(
        mockRequest as RequestWithUser,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Відмовлено у доступі.',
      });
    });
  });
});