import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

const createRoomSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive(),
  pricePerMonth: z.number().positive(),
});

const updateRoomSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
  pricePerMonth: z.number().positive().optional(),
  isAvailable: z.boolean().optional(),
});

export const getRoomsByListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listingId } = req.params;
    const rooms = await prisma.room.findMany({
      where: { listingId },
    });
    return res.json(rooms);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const { listingId } = req.params;
    const data = createRoomSchema.parse(req.body);

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.ownerId !== authReq.user!.userId) return res.status(403).json({ message: 'Forbidden' });

    const room = await prisma.room.create({
      data: {
        ...data,
        pricePerMonth: data.pricePerMonth,
        listingId,
      },
    });
    return res.status(201).json(room);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    next(error);
  }
};

export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const data = updateRoomSchema.parse(req.body);

    const room = await prisma.room.findUnique({ where: { id }, include: { listing: true } });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.listing.ownerId !== authReq.user!.userId) return res.status(403).json({ message: 'Forbidden' });

    const updated = await prisma.room.update({
      where: { id },
      data,
    });
    return res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    next(error);
  }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const room = await prisma.room.findUnique({ where: { id }, include: { listing: true } });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.listing.ownerId !== authReq.user!.userId) return res.status(403).json({ message: 'Forbidden' });

    await prisma.room.delete({ where: { id } });
    return res.json({ message: 'Room deleted' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

