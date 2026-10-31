import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getTenants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const where = authReq.user?.role === 'ADMIN' ? {} : { userId: authReq.user!.userId };
    const tenants = await prisma.tenant.findMany({ where, include: { user: { select: { firstName: true, lastName: true, email: true } }, room: true } });
    return res.json(tenants);
  } catch (error) {
    console.error(error); next(error);
  }
};
