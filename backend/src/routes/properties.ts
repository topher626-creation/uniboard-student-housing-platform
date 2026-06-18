import express from 'express';
import { prisma } from '../lib/db';

const router = express.Router();

const propertyInclude = {
  building: {
    include: {
      compound: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              avatar: true,
              status: true,
            },
          },
        },
      },
      images: true,
    },
  },
  university: true,
  images: true,
  features: { include: { feature: true } },
  reviews: true,
} as const;

/* GET ALL AVAILABLE PROPERTIES */
router.get('/', async (_req, res) => {
  try {
    const allProperties = await prisma.property.findMany({
      include: propertyInclude,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const properties = allProperties.filter((p) => p.occupiedBeds < p.totalBeds);
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/* GET PROPERTY BY ID */
router.get('/:id', async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: propertyInclude,
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
