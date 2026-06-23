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
              compoundName: true,
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
  reviews: {
    include: {
      user: {
        select: {
          fullName: true,
          avatar: true
        }
      }
    }
  },
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

import jwt from 'jsonwebtoken';

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

    // Check if user is logged in to see full details
    const token = req.header('Authorization')?.replace('Bearer ', '');
    let isLoggedIn = false;
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET!);
        isLoggedIn = true;
      } catch (e) {
        // Token invalid, treat as guest
      }
    }

    if (!isLoggedIn) {
      // Mask sensitive data for guests
      const guestView = {
        ...property,
        phone: 'Hidden',
        whatsapp: 'Hidden',
        description: property.description.substring(0, 100) + '...',
        images: property.images.slice(0, 1), // Only 1 image
        features: property.features.slice(0, 3), // Only 3 amenities
        isGuestView: true
      };
      return res.json(guestView);
    }

    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
