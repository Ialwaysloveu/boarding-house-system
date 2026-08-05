import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

const createRoomSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive(),
  pricePerMonth: z.number().positive(),
});

export const getRoomsByListing = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const rooms = await prisma.room.findMany({
      where: { listingId },
    });
    return res.json(rooms);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const data = createRoomSchema.parse(req.body);

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

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
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.update({
      where: { id },
      data: req.body,
    });
    return res.json(room);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.room.delete({ where: { id } });
    return res.json({ message: 'Room deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
