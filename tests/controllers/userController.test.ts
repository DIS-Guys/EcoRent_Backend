import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUser, updateUser, deleteUser, authenticateUser, changePassword } from '../../src/controllers/userController';
import User from '../../src/models/User';
import Device from '../../src/models/Device';

jest.mock('../../src/models/User');
jest.mock('../../src/models/Device');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Response;
    let jsonFunction: jest.Mock;

    beforeEach(() => {
        jsonFunction = jest.fn();
        const statusFunction = jest.fn().mockReturnValue({ json: jsonFunction });

        mockResponse = {
            status: statusFunction,
            json: jsonFunction,
            sendStatus: jest.fn(),
            send: jest.fn(),
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
    });

    describe('getUser', () => {
        beforeEach(() => {
            mockRequest = {
                user: { id: 'testUserId' },
            } as any;
        });

        it('should return user data successfully', async () => {
            const mockUser = { _id: 'testUserId', name: 'Test', email: 'test@test.com' };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await getUser(mockRequest as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(jsonFunction).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 if user not found', async () => {
            (User.findById as jest.Mock).mockResolvedValue(null);

            await getUser(mockRequest as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(jsonFunction).toHaveBeenCalledWith({
                message: 'Користувача не знайдено.',
            });
        });
    });

    describe('updateUser', () => {
        beforeEach(() => {
            mockRequest = {
                user: { id: 'testUserId' },
                body: { name: 'Updated Name' },
            } as any;
        });

        it('should update user successfully', async () => {
            const updatedUser = { _id: 'testUserId', name: 'Updated Name' };
            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

            await updateUser(mockRequest as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(jsonFunction).toHaveBeenCalledWith({
                message: 'Дані користувача оновлено.',
                updatedUser,
            });
        });

        it('should return 404 if user not found', async () => {
            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await updateUser(mockRequest as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(jsonFunction).toHaveBeenCalledWith({
                message: 'Користувача не знайдено.',
            });
        });
    });

    describe('deleteUser', () => {
        beforeEach(() => {
            mockRequest = {
                user: { id: 'testUserId' },
            } as any;
        });

        it('should delete user and associated devices successfully', async () => {
            const deletedUser = { _id: 'testUserId', name: 'Test' };
            (User.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedUser);
            (Device.deleteMany as jest.Mock).mockResolvedValue({});

            await deleteUser(mockRequest as Request, mockResponse);

            expect(Device.deleteMany).toHaveBeenCalledWith({ ownerId: 'testUserId' });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(jsonFunction).toHaveBeenCalledWith({
                message: 'Користувача успішно видалено.',
                deletedUser,
            });
        });

        it('should return 404 if user not found', async () => {
            (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            await deleteUser(mockRequest as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(jsonFunction).toHaveBeenCalledWith({
                message: 'Користувача не знайдено.',
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
            process.env.JWT_SECRET = 'test-secret';
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
    });

    describe('changePassword', () => {
        beforeEach(() => {
            mockRequest = {
                user: { id: 'testUserId' },
                body: {
                    oldPassword: 'oldPassword123',
                    newPassword: 'newPassword123',
                },
            } as any;
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

            await changePassword(mockRequest as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(jsonFunction).toHaveBeenCalledWith({
                message: 'Успішний зміна паролю.',
            });
        });

        it('should return 404 if user not found', async () => {
            (User.findById as jest.Mock).mockResolvedValue(null);

            await changePassword(mockRequest as Request, mockResponse);

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

            await changePassword(mockRequest as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(jsonFunction).toHaveBeenCalledWith({
                message: 'Старий пароль невірний.',
            });
        });
    });
});