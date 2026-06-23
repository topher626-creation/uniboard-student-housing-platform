import express from 'express';
import type { Prisma, RoomType } from '@prisma/client';
import { prisma } from '../lib/db';

const router = express.Router();

// GET /api/search/properties - Dynamic search (public)
router.get('/properties', async (req, res) => {
  try {
    const { query, location, compoundName, roomType, campus } = req.query;
    const searchTerm = typeof query === 'string' && query.trim() ? query.trim() : undefined;
    const locationTerm = typeof location === 'string' && location.trim() ? location.trim() : undefined;
    const compoundTerm = typeof compoundName === 'string' && compoundName.trim() ? compoundName.trim() : undefined;
    const campusTerm = typeof campus === 'string' && campus.trim() ? campus.trim() : undefined;

    const where: Prisma.PropertyWhereInput = {
      ...(roomType ? { roomType: roomType as RoomType } : {}),
      ...(campusTerm ? { travelTime: { contains: campusTerm } } : {}),
      ...(searchTerm || locationTerm || compoundTerm
        ? {
            OR: [
              ...(searchTerm
                ? [
                    { name: { contains: searchTerm } },
                    { description: { contains: searchTerm } }
                  ]
                : []),
              ...(compoundTerm
                ? [{ building: { compound: { name: { contains: compoundTerm } } } }]
                : []),
              ...(locationTerm
                ? [{ building: { location: { contains: locationTerm } } }]
                : [])
            ]
          }
        : {})
    };

    const allProperties = await prisma.property.findMany({
      where,
      include: {
        building: {
          include: {
            compound: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    compoundName: true,
                    status: true
                  }
                }
              }
            }
          }
        },
        images: { take: 1 }, // Only one image for guest/listing view
        features: { include: { feature: true }, take: 3 } // Basic amenities preview
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const properties = allProperties.filter((property) => property.occupiedBeds < property.totalBeds);

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
