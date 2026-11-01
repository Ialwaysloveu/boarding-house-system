import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';
import { z } from 'zod';

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().min(1).max(1000),
});

export const listFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const feedbacks = await prisma.feedback.findMany({
      where: { listingId: id },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const agg = await prisma.feedback.aggregate({ where: { listingId: id }, _avg: { rating: true }, _count: { rating: true } });
    return res.json({ feedbacks, average: agg._avg.rating, count: agg._count.rating });
  } catch (error) {
    console.error(error); next(error);
  }
};

export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) return res.status(401).json({ message: 'Unauthorized' });
    if (authReq.user.role === 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
    const { id } = req.params;
    const data = feedbackSchema.parse(req.body);
    const fb = await prisma.feedback.create({
      data: { listingId: id, userId: authReq.user.userId, rating: data.rating, message: data.message },
    });
    return res.status(201).json(fb);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: 'Validation error', errors: error.errors });
    console.error(error); next(error);
  }
};

export const deleteFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const fb = await prisma.feedback.findUnique({ where: { id } });
    if (!fb) return res.status(404).json({ message: 'Not found' });
    if (authReq.user?.role !== 'ADMIN' && fb.userId !== authReq.user?.userId) return res.status(403).json({ message: 'Forbidden' });
    await prisma.feedback.delete({ where: { id } });
    return res.json({ message: 'Deleted' });
  } catch (error) {
    console.error(error); next(error);
  }
};