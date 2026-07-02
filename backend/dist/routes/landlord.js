"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importStar(require("../middleware/auth"));
const db_1 = require("../lib/db");
const uploadService_1 = require("../services/uploadService");
const router = express_1.default.Router();
router.use(auth_1.default);
/**
 * GET /api/landlord/overview
 * Get stats for the landlord dashboard
 */
router.get('/overview', auth_1.isLandlord, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db_1.prisma.user.findUnique({
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
        if (!user)
            return res.status(404).json({ error: 'User not found' });
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
/**
 * POST /api/landlord/properties
 * Add a new property (only for approved landlords)
 */
router.post('/properties', auth_1.isLandlord, uploadService_1.upload.array('images', 12), async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db_1.prisma.user.findUnique({
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
        const { name, description, location, price, roomType, totalBeds, occupiedBeds, distanceFromCampus, phone, whatsapp, amenities } = req.body;
        // 1. Create a Building (acting as a container for this property type)
        const building = await db_1.prisma.building.create({
            data: {
                name,
                description,
                location,
                roomType: roomType,
                totalBeds: parseInt(totalBeds, 10),
                occupiedBeds: parseInt(occupiedBeds || 0, 10),
                compoundId: compound.id
            }
        });
        // 2. Handle images
        const files = (req.files ?? []);
        const images = files.map((file) => ({ url: `/uploads/buildings/${file.filename}` }));
        // 3. Handle features/amenities
        const amenityNames = parseFeatureNames(amenities);
        // 4. Create the Property
        const property = await db_1.prisma.property.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                roomType: roomType,
                phone,
                whatsapp,
                totalBeds: parseInt(totalBeds, 10),
                occupiedBeds: parseInt(occupiedBeds || 0, 10),
                travelTime: distanceFromCampus, // "5 minutes"
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
/**
 * GET /api/landlord/properties
 * Get all properties for the logged-in landlord
 */
router.get('/properties', auth_1.isLandlord, async (req, res) => {
    try {
        const userId = req.user.id;
        const properties = await db_1.prisma.property.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
function parseFeatureNames(features) {
    if (!features)
        return [];
    try {
        const parsed = typeof features === 'string' ? JSON.parse(features) : features;
        return Array.isArray(parsed)
            ? parsed.filter((f) => typeof f === 'string' && f.trim().length > 0)
            : [];
    }
    catch {
        return [];
    }
}
exports.default = router;
//# sourceMappingURL=landlord.js.map