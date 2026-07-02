"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.optimizeImage = optimizeImage;
exports.addImageToRecord = addImageToRecord;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const UPLOADS_DIR = 'd:/WEB PROJECTS/uniboard/backend/uploads';
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
// Multer storage
const storage = multer_1.default.diskStorage({
    destination: (_req, file, cb) => {
        const dir = path_1.default.join(UPLOADS_DIR, file.fieldname);
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
// Multer filter
const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only JPG, PNG, WEBP or PDF <= 5MB allowed'));
    }
};
exports.upload = (0, multer_1.default)({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
async function optimizeImage(filePath) {
    const optimizedPath = filePath.replace(path_1.default.extname(filePath), '.webp');
    await (0, sharp_1.default)(filePath)
        .webp({ quality: 80 })
        .toFile(optimizedPath);
    // Delete original
    fs_1.default.unlinkSync(filePath);
    return optimizedPath;
}
// Helper to add to Json field (nrcImages, images)
async function addImageToRecord(recordId, field, imageUrl, side) {
    const record = await prisma.user.findUnique({ where: { id: recordId } }); // adjust for model
    // Logic to append to Json array
    console.log(`Image added to ${field}: ${imageUrl}`);
    return imageUrl;
}
//# sourceMappingURL=uploadService.js.map