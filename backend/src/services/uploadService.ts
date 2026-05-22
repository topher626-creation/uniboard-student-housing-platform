import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const UPLOADS_DIR = 'd:/WEB PROJECTS/uniboard/backend/uploads';

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const dir = path.join(UPLOADS_DIR, file.fieldname);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Multer filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP or PDF <= 5MB allowed'));
  }
};


export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

export async function optimizeImage(filePath: string): Promise<string> {
  const optimizedPath = filePath.replace(path.extname(filePath), '.webp');
  
  await sharp(filePath)
    .webp({ quality: 80 })
    .toFile(optimizedPath);
  
  // Delete original
  fs.unlinkSync(filePath);
  
  return optimizedPath;
}

// Helper to add to Json field (nrcImages, images)
export async function addImageToRecord(recordId: string, field: string, imageUrl: string, side?: string) {
  const record = await prisma.user.findUnique({ where: { id: recordId } }); // adjust for model
  // Logic to append to Json array
  console.log(`Image added to ${field}: ${imageUrl}`);
  return imageUrl;
}
