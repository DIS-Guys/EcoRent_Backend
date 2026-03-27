import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';
import {
  AuthenticatedRequest,
  UserPayload,
} from '../interfaces/request.interface';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const user = jwt.verify(token, getEnv().jwtSecret) as UserPayload;
    req.user = user;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};
