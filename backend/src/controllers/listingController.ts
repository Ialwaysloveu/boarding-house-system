import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

const createListingSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  address: z.string().min(1),
  city: z.string().min(1),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
});

const listQuerySchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const getListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = listQuerySchema.parse(req.query);
    const where: any = {};
    if (q.q) {
      where.OR = [
        { name: { contains: q.q, mode: 'insensitive' } },
        { city: { contains: q.q, mode: 'insensitive' } },
      ];
    }
    if (q.city) {
      where.city = { contains: q.city, mode: 'insensitive' };
    }
    if (q.minPrice !== undefined || q.maxPrice !== undefined) {
      where.rooms = { some: { pricePerMonth: { gte: q.minPrice, lte: q.maxPrice } } };
    }
    const skip = (q.page - 1) * q.limit;
    const listings = await prisma.listing.findMany({
      where,
      include: { rooms: true },
      skip,
      take: q.limit,
    });
    return res.json(listings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error); next(error);
  }
};

export const getListingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { rooms: true },
    });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    return res.json(listing);
  } catch (error) {
    console.error(error); next(error);
  }
};

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const data = createListingSchema.parse(req.body);
    const listing = await prisma.listing.create({
      data: {
        ...data,
        ownerId: authReq.user!.userId,
      },
    });
    return res.status(201).json(listing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error); next(error);
  }
};

