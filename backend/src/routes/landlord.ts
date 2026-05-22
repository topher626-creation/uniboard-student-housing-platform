import express, { Request, Response } from 'express';
import type { RoomType } from '@prisma/client';
import authMiddleware, { isLandlord, isLandlordOrManager } from '../middleware/auth';
import { prisma } from '../lib/db';
import { upload } from '../services/uploadService';

const router = express.Router();
router.use(authMiddleware);

// POST /api/landlord/compounds - Create compound
router.post('/compounds', isLandlord, upload.array('nrcImages', 2), async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    const { name, description, location } = req.body;
    const userId = req.user!.id;

    const files = (req.files ?? []) as Express.Multer.File[];
    const nrcImages = files.map((file) => ({
      url: `/uploads/nrc/${file.filename}`, 
      side: file.fieldname === 'front' ? 'front' : 'back' 
    }));

    const compound = await prisma.compound.create({
      data: {
        name,
        description,
        location,
        userId
      }
    });

    // Update user nrcImages
    await prisma.user.update({
      where: { id: userId },
      data: { nrcImages }
    });

    res.json(compound);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/landlord/compounds
router.get('/compounds', isLandlord, async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    const compounds = await prisma.compound.findMany({
      where: { userId: req.user!.id },
      include: { buildings: true }
    });
    res.json(compounds);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/landlord/buildings
router.post('/buildings', isLandlordOrManager, upload.array('images', 8), async (req, res) => {
  try {
    const { name, description, location, price, roomType, totalBeds, features } = req.body;
    const compoundId = req.body.compoundId;
    const files = (req.files ?? []) as Express.Multer.File[];
    const images = files.map((file) => ({ url: `/uploads/buildings/${file.filename}` }));
    const featureNames = parseFeatureNames(features);

    const building = await prisma.building.create({
      data: {
        name,
        description,
        location,
        price: price ? parseFloat(price) : null,
        roomType: roomType as RoomType,
        images: images.length ? { create: images } : undefined,
        totalBeds: parseInt(totalBeds, 10),
        occupiedBeds: 0,
        features: featureNames.length
          ? {
              create: featureNames.map((featureName) => ({
                feature: {
                  connectOrCreate: {
                    where: { name: featureName },
                    create: { name: featureName }
                  }
                }
              }))
            }
          : undefined,
        compoundId
      }
    });

    res.json(building);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/landlord/buildings/:id/beds - Update occupied beds
router.put('/buildings/:id/beds', isLandlordOrManager, async (req, res) => {
  try {
    const { id } = req.params;
    const { occupiedBeds } = req.body;

    const building = await prisma.building.update({
      where: { id },
      data: { occupiedBeds: parseInt(occupiedBeds, 10) }
    });

    res.json({ availableBeds: building.totalBeds - building.occupiedBeds, status: getBedStatus(building.totalBeds - building.occupiedBeds) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

function getBedStatus(available: number): string {
  if (available === 0) return 'FULL';
  if (available <= 5) return 'LOW';
  return 'AVAILABLE';
}

function parseFeatureNames(features: unknown): string[] {
  if (!features) return [];
  const parsed = typeof features === 'string' ? JSON.parse(features) : features;
  return Array.isArray(parsed)
    ? parsed.filter((feature): feature is string => typeof feature === 'string' && feature.trim().length > 0)
    : [];
}

export default router;
