import { Request, Response, NextFunction } from 'express';

type AuthRequest = Request & { user?: { id: string; role: import('@prisma/client').Role; status: import('@prisma/client').UserStatus; adminLevel?: import('@prisma/client').AdminLevel | null } };

import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db';

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, status: true, adminLevel: true }
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'User inactive or not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalid' });
  }
};

// Role guards
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN' || req.user?.adminLevel !== 'SUPER') {
    return res.status(403).json({ error: 'Super Admin access required' });
  }
  next();
};

export const isLandlord = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'LANDLORD') {
    return res.status(403).json({ error: 'Landlord access required' });
  }
  next();
};

export const isLandlordOrManager = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'LANDLORD' && req.user?.role !== 'MANAGER') {
    return res.status(403).json({ error: 'Landlord/Manager access required' });
  }
  next();
};

export default authMiddleware;
