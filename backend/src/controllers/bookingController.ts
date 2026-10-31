import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

const createBookingSchema = z.object({
  roomId: z.string().uuid(),
  message: z.string().optional(),
});

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const data = createBookingSchema.parse(req.body);

    const room = await prisma.room.findUnique({ where: { id: data.roomId } });
    if (!room || !room.isAvailable) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    const existingPending = await prisma.booking.findFirst({
      where: { userId: authReq.user!.userId, roomId: data.roomId, status: 'PENDING' },
    });
    if (existingPending) {
      return res.status(409).json({ message: 'You already have a pending booking for this room' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: authReq.user!.userId,
        roomId: data.roomId,
        message: data.message,
      },
    });
    return res.status(201).json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    next(error);
  }
};

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const where = authReq.user?.role === 'ADMIN' ? {} : { userId: authReq.user!.userId };

    const bookings = await prisma.booking.findMany({
      where,
      include: { room: { include: { listing: true } }, user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(bookings);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use APPROVED or REJECTED.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id } });
      if (!booking) return { notFound: true } as any;

      if (booking.status !== 'PENDING') {
        return { conflict: 'Booking is not pending' } as any;
      }

      if (status === 'APPROVED') {
        const roomUpdate = await tx.room.updateMany({
          where: { id: booking.roomId, isAvailable: true },
          data: { isAvailable: false },
        });
        if (roomUpdate.count !== 1) {
          return { conflict: 'Room is not available' } as any;
        }
        await tx.tenant.create({
          data: {
            userId: booking.userId,
            roomId: booking.roomId,
            moveInDate: new Date(),
            status: 'ACTIVE',
          },
        });
      }

      const updated = await tx.booking.update({
        where: { id, status: 'PENDING' },
        data: { status },
      });
      return { booking: updated } as any;
    });

    if ((result as any).notFound) return res.status(404).json({ message: 'Booking not found' });
    if ((result as any).conflict) return res.status(409).json({ message: (result as any).conflict });

    return res.json((result as any).booking);
  } catch (error) {
    console.error(error);
    next(error);
  }
};



