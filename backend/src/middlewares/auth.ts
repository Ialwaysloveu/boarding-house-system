import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token) as { userId: string; role: string };
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as AuthRequest).user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};
