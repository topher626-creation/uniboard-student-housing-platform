import express from 'express';
import bcrypt from 'bcryptjs';
import authMiddleware, { isAdmin, isSuperAdmin } from '../middleware/auth';
import { prisma } from '../lib/db';
import { sendApprovalEmail } from '../services/emailService';

const router = express.Router();

router.use(authMiddleware);

// GET /api/admin/stats - Dashboard overview metrics
router.get('/stats', isAdmin, async (_req, res) => {
  try {
    const [totalUsers, properties, verifiedProviders, pendingVerifications] = await Promise.all([
      prisma.user.count(),
      prisma.property.findMany({ select: { occupiedBeds: true, totalBeds: true } }),
      prisma.user.count({ where: { role: 'LANDLORD', status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'LANDLORD', status: 'PENDING' } }),
    ]);

    const activeListings = properties.filter((p) => p.occupiedBeds < p.totalBeds).length;

    res.json({ totalUsers, activeListings, verifiedProviders, pendingVerifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/users - List all users (admin only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        phoneVerified: true,
        createdAt: true,
        nrcImages: true,
        compoundName: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/users/:id/approve
router.patch('/users/:id/approve', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' }
    });
    
    await sendApprovalEmail(user.email, 'approved');
    
    res.json({ message: 'User approved', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/users/:id/reject
router.patch('/users/:id/reject', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'REJECTED' }
    });
    
    await sendApprovalEmail(user.email, 'rejected', reason);
    
    res.json({ message: 'User rejected', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/users/:id/ban - Disable an active account
router.patch('/users/:id/ban', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'BANNED' },
    });
    res.json({ message: 'User banned', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/admins (Super admin create assistant)
router.post('/admins', isSuperAdmin, async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const admin = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        adminLevel: 'ASSISTANT',
        nrcImages: []
      }
    });

    res.status(201).json({ message: 'Assistant admin created', admin });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
