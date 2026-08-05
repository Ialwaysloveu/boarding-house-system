import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

const createBookingSchema = z.object({
  roomId: z.string().uuid(),
  message: z.string().optional(),
});

export const createBooking = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const data = createBookingSchema.parse(req.body);

    const room = await prisma.room.findUnique({ where: { id: data.roomId } });
    if (!room || !room.isAvailable) {
      return res.status(400).json({ message: 'Room is not available' });
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
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookings = async (req: Request, res: Response) => {
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
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use APPROVED or REJECTED.' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    // If approved, mark room as unavailable
    if (status === 'APPROVED') {
      await prisma.room.update({
        where: { id: booking.roomId },
        data: { isAvailable: false },
      });
    }

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
