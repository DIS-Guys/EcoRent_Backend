import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  authenticateUser,
  changePassword,
} from '../../src/controllers/userController';
import User from '../../src/models/User';
import Device from '../../src/models/Device';
import PaymentCard from '../../src/models/PaymentCard';
import { AuthenticatedRequest } from '../../src/interfaces/request.interface';

jest.mock('../../src/models/User');
jest.mock('../../src/models/Device');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/models/PaymentCard', () => ({
  deleteMany: jest.fn(),
  __esModule: true,
  default: {
    deleteMany: jest.fn(),
  },
}));

describe('User Controller', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Response;
  let jsonFunction: jest.Mock;
  let sendFunction: jest.Mock;

  beforeEach(() => {
    jsonFunction = jest.fn();
    sendFunction = jest.fn();
    const statusFunction = jest.fn().mockReturnValue({
      json: jsonFunction,
      send: sendFunction,
    });

    mockResponse = {
      status: statusFunction,
      json: jsonFunction,
      send: sendFunction,
      sendStatus: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;

    jest.clearAllMocks();
  });

  describe('createUser', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          name: 'Test',
          surname: 'User',
          email: 'test@test.com',
          password: 'password123',
        },
      };
    });

    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (User.prototype.save as jest.Mock).mockResolvedValue({});

      await createUser(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Користувача зареєстровано успішно.',
      });
    });

    it('should return 400 if user already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@test.com' });

      await createUser(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Користувач із таким email вже існує.',
      });
    });

    it('should return 500 if server error occurs', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await createUser(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Помилка сервера.',
        error: expect.any(Error),
      });
    });
  });

  describe('getUser', () => {
    beforeEach(() => {
      mockRequest = {
        user: { id: 'testUserId', name: 'Chill', surname: 'Guy' },
      };
    });

    it('should return user data successfully', async () => {
      const mockUser = {
        _id: 'testUserId',
        name: 'Test',
        email: 'test@test.com',
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await getUser(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonFunction).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await getUser(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Користувача не знайдено.',
      });
    });

    it('should return 500 if server error occurs', async () => {
      (User.findById as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await getUser(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Помилка сервера.',
        error: expect.any(Error),
      });
    });
  });

  describe('updateUser', () => {
    beforeEach(() => {
      mockRequest = {
        user: { id: 'testUserId', name: 'Chill', surname: 'Guy' },
        body: { name: 'Updated Name' },
      };
    });

    it('should update user successfully', async () => {
      const updatedUser = { _id: 'testUserId', name: 'Updated Name' };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      await updateUser(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Дані користувача оновлено.',
        updatedUser,
      });
    });

    it('should return 404 if user not found', async () => {
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateUser(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Користувача не знайдено.',
      });
    });

    it('should return 500 if server error occurs', async () => {
      (User.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await updateUser(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Помилка сервера.',
        error: expect.any(Error),
      });
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      mockRequest = {
        user: { id: 'testUserId', name: 'Chill', surname: 'Guy' },
      };
    });

    it('should delete user and associated devices successfully', async () => {
      const deletedUser = { _id: 'testUserId', name: 'Test' };
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedUser);
      (Device.deleteMany as jest.Mock).mockResolvedValue({});
      (PaymentCard.deleteMany as jest.Mock).mockResolvedValue({});

      await deleteUser(mockRequest as AuthenticatedRequest, mockResponse);

      expect(Device.deleteMany).toHaveBeenCalledWith({ ownerId: 'testUserId' });
      expect(PaymentCard.deleteMany).toHaveBeenCalledWith({
        ownerId: 'testUserId',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Користувача видалено успішно.',
      });
    });

    it('should return 404 if user not found', async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteUser(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Користувача не знайдено.',
      });
    });

    it('should return 500 if server error occurs', async () => {
      (User.findByIdAndDelete as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await deleteUser(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Помилка сервера.',
        error: expect.any(Error),
      });
    });
  });

  describe('authenticateUser', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          email: 'test@test.com',
          password: 'password123',
        },
      };
    });

    it('should authenticate user successfully', async () => {
      const mockUser = {
        _id: 'testUserId',
        name: 'Test',
        surname: 'User',
        password: 'hashedPassword',
      };
      const mockToken = 'generatedToken123';

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      await authenticateUser(mockRequest as Request, mockResponse);

      expect(jsonFunction).toHaveBeenCalledWith({
        token: mockToken,
        message: 'Успішний вхід.',
      });
    });

    it('should return 404 if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await authenticateUser(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Користувача не знайдено.',
      });
    });

    it('should return 400 if password is incorrect', async () => {
      const mockUser = {
        _id: 'testUserId',
        password: 'hashedPassword',
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await authenticateUser(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Невірний пароль.',
      });
    });

    it('should return 500 if server error occurs', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await authenticateUser(mockRequest as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Помилка сервера.',
        error: expect.any(Error),
      });
    });
  });

  describe('changePassword', () => {
    beforeEach(() => {
      mockRequest = {
        user: { id: 'testUserId', name: 'Chill', surname: 'Guy' },
        body: {
          oldPassword: 'oldPassword123',
          newPassword: 'newPassword123',
        },
      };
    });

    it('should change password successfully', async () => {
      const mockUser = {
        _id: 'testUserId',
        password: 'hashedOldPassword',
      };
      const hashedNewPassword = 'hashedNewPassword123';

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedNewPassword);
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

      await changePassword(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Успішна зміна паролю.',
      });
    });

    it('should return 404 if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await changePassword(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Користувача не знайдено.',
      });
    });

    it('should return 400 if old password is incorrect', async () => {
      const mockUser = {
        _id: 'testUserId',
        password: 'hashedOldPassword',
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await changePassword(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Старий пароль невірний.',
      });
    });

    it('should return 500 if server error occurs', async () => {
      (User.findById as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await changePassword(mockRequest as AuthenticatedRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(jsonFunction).toHaveBeenCalledWith({
        message: 'Помилка сервера.',
        error: expect.any(Error),
      });
    });
  });
});
