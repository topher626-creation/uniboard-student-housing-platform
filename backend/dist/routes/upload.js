"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadService_1 = require("../services/uploadService");
const router = express_1.default.Router();
// Public POST /api/upload/verification-docs
// Expects multipart/form-data with up to 5 files under field name: 'files'
// Returns: [{ url }]
router.post('/verification-docs', uploadService_1.upload.array('files', 5), async (req, res) => {
    try {
        const files = (req.files ?? []);
        const urls = files.map((file) => ({
            url: `/uploads/${file.fieldname}/${file.filename}`,
        }));
        res.status(200).json(urls);
    }
    catch (e) {
        res.status(500).json({ error: 'Upload failed' });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map