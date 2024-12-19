import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {IUser} from "../../src/models/User";
import {authenticateToken} from "../../src/middlewares/authMiddleware";

process.env.JWT_SECRET = 'test-secret';

describe('Authentication Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
    });

    it('should authenticate valid token and call next()', () => {
        const mockUser: Partial<IUser> = {
            _id: '123',
            email: 'test@example.com',
            name: 'Test User'
        };

        const token = jwt.sign(mockUser, process.env.JWT_SECRET as string);
        mockRequest.headers = {
            authorization: `Bearer ${token}`
        };

        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect((mockRequest as any).user).toBeDefined();
        expect((mockRequest as any).user.email).toBe(mockUser.email);
    });

    it('should return 401 when no token is provided', () => {
        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token is required' });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 403 when token format is invalid', () => {
        mockRequest.headers = {
            authorization: 'Bearer invalid-token'
        };

        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is malformed', () => {
        mockRequest.headers = {
            authorization: 'InvalidFormat'
        };

        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token is required' });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 403 when token is expired', () => {
        const mockUser: Partial<IUser> = {
            _id: '123',
            email: 'test@example.com'
        };

        const token = jwt.sign(mockUser, process.env.JWT_SECRET as string, { expiresIn: '0s' });
        mockRequest.headers = {
            authorization: `Bearer ${token}`
        };

        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
        expect(nextFunction).not.toHaveBeenCalled();
    });
});