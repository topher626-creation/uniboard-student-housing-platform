import express, { Request, Response } from 'express';
import type { RoomType } from '@prisma/client';
import authMiddleware, { isLandlord, isLandlordOrManager } from '../middleware/auth';
import { prisma } from '../lib/db';
import { upload } from '../services/uploadService';

const router = express.Router();
router.use(authMiddleware);

/**
 * GET /api/landlord/overview
 * Get stats for the landlord dashboard
 */
router.get('/overview', isLandlord, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        compounds: {
          include: {
            buildings: {
              include: {
                properties: true
              }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const compounds = user.compounds;
    let totalProperties = 0;
    let totalBedspaces = 0;
    let occupiedBedspaces = 0;

    compounds.forEach(compound => {
      compound.buildings.forEach(building => {
        totalProperties += building.properties.length;
        totalBedspaces += building.totalBeds;
        occupiedBedspaces += building.occupiedBeds;
      });
    });

    res.json({
      businessName: user.compoundName,
      status: user.status,
      stats: {
        totalProperties,
        totalBedspaces,
        occupiedBedspaces,
        availableBedspaces: totalBedspaces - occupiedBedspaces
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/landlord/properties
 * Add a new property (only for approved landlords)
 */
router.post('/properties', isLandlord, upload.array('images', 12), async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { compounds: true }
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Only active/verified landlords can add properties' });
    }

    const compound = user.compounds[0];
    if (!compound) {
      return res.status(400).json({ error: 'No compound found for this landlord' });
    }

    const { 
      name, 
      description, 
      location, 
      price, 
      roomType, 
      totalBeds, 
      occupiedBeds,
      distanceMinutes,
      distanceFromCampus,
      phone,
      whatsapp,
      amenities 
    } = req.body;

    const parsedTotalBeds = parseInt(totalBeds, 10);
    const parsedOccupiedBeds = parseInt(occupiedBeds || 0, 10);
    const parsedPrice = parseFloat(price);
    const parsedDistanceMinutes = parseInt(distanceMinutes, 10);
    const travelTime = Number.isFinite(parsedDistanceMinutes) && parsedDistanceMinutes > 0
      ? `${parsedDistanceMinutes} minutes`
      : distanceFromCampus;

    if (!name || !description || !location || !roomType || !phone || !whatsapp) {
      return res.status(400).json({ error: 'Missing required property details' });
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Price must be greater than zero' });
    }

    if (!Number.isInteger(parsedTotalBeds) || parsedTotalBeds < 1) {
      return res.status(400).json({ error: 'Total bedspaces must be at least 1' });
    }

    if (!Number.isInteger(parsedOccupiedBeds) || parsedOccupiedBeds < 0) {
      return res.status(400).json({ error: 'Occupied bedspaces cannot be negative' });
    }

    if (parsedOccupiedBeds > parsedTotalBeds) {
      return res.status(400).json({ error: 'Occupied bedspaces cannot exceed total bedspaces' });
    }

    if (!travelTime) {
      return res.status(400).json({ error: 'Distance from campus is required' });
    }

    const files = (req.files ?? []) as Express.Multer.File[];
    if (files.length < 5 || files.length > 12) {
      return res.status(400).json({ error: 'Upload between 5 and 12 property images' });
    }

    // 1. Create a Building (acting as a container for this property type)
    const building = await prisma.building.create({
      data: {
        name,
        description,
        location,
        roomType: roomType as RoomType,
        totalBeds: parsedTotalBeds,
        occupiedBeds: parsedOccupiedBeds,
        compoundId: compound.id
      }
    });

    // 2. Handle images
    const images = files.map((file) => ({ url: `/uploads/buildings/${file.filename}` }));

    // 3. Handle features/amenities
    const amenityNames = parseFeatureNames(amenities);

    // 4. Create the Property
    const property = await prisma.property.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        roomType: roomType as RoomType,
        phone,
        whatsapp,
        totalBeds: parsedTotalBeds,
        occupiedBeds: parsedOccupiedBeds,
        travelTime,
        buildingId: building.id,
        images: images.length ? { create: images } : undefined,
        features: amenityNames.length
          ? {
              create: amenityNames.map((name) => ({
                feature: {
                  connectOrCreate: {
                    where: { name },
                    create: { name }
                  }
                }
              }))
            }
          : undefined
      }
    });

    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/landlord/properties
 * Get all properties for the logged-in landlord
 */
router.get('/properties', isLandlord, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const properties = await prisma.property.findMany({
      where: {
        building: {
          compound: {
            userId
          }
        }
      },
      include: {
        images: true,
        features: { include: { feature: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

function parseFeatureNames(features: unknown): string[] {
  if (!features) return [];
  try {
    const parsed = typeof features === 'string' ? JSON.parse(features) : features;
    return Array.isArray(parsed)
      ? parsed.filter((f): f is string => typeof f === 'string' && f.trim().length > 0)
      : [];
  } catch {
    return [];
  }
}

export default router;
