import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

const createPaymentSchema = z.object({
  tenantId: z.string().uuid(),
  amount: z.number().positive(),
  referenceNumber: z.string().optional(),
});

export const createPayment = async (req: Request, res: Response) => {
  try {
    const data = createPaymentSchema.parse(req.body);

    const tenant = await prisma.tenant.findUnique({ where: { id: data.tenantId } });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    const payment = await prisma.payment.create({
      data: {
        tenantId: data.tenantId,
        amount: data.amount,
        referenceNumber: data.referenceNumber,
        status: 'COMPLETED',
      },
    });
    return res.status(201).json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    let payments;

    if (authReq.user?.role === 'ADMIN') {
      payments = await prisma.payment.findMany({
        include: { tenant: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      payments = await prisma.payment.findMany({
        where: { tenant: { userId: authReq.user!.userId } },
        include: { tenant: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
