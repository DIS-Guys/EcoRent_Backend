import { NextFunction } from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
