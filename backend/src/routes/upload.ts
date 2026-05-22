import express from 'express';
import { upload } from '../services/uploadService';

const router = express.Router();

// Public POST /api/upload/verification-docs
// Expects multipart/form-data with up to 5 files under field name: 'files'
// Returns: [{ url }]
router.post(
  '/verification-docs',
  upload.array('files', 5),
  async (req, res) => {
    try {
      const files = (req.files ?? []) as Express.Multer.File[];

      const urls = files.map((file) => ({
        url: `/uploads/${file.fieldname}/${file.filename}`,
      }));

      res.status(200).json(urls);
    } catch (e) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

export default router;

