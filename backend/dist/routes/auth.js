"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../lib/db");
const emailService_1 = require("../services/emailService");
const verification_1 = require("../utils/verification");
const router = express_1.default.Router();
const signupUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
        if (validTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPG, PNG, WEBP or PDF files are allowed'));
        }
    }
});
/* =========================
   LOGIN
========================= */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user ||
            user.status !== 'ACTIVE' ||
            !(await bcryptjs_1.default.compare(password, user.password))) {
            return res
                .status(401)
                .json({ error: 'Invalid credentials or account pending approval' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                phone: user.phone,
                university: user.university,
                avatar: user.avatar,
                nrcImages: user.nrcImages,
                compoundName: user.compoundName
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});
/* =========================
   SIGNUP
========================= */
router.post('/signup', signupUpload.fields([
    { name: 'nrcFront', maxCount: 1 },
    { name: 'nrcBack', maxCount: 1 }
]), async (req, res) => {
    try {
        const { fullName, email, password, role, phone, university, compoundName, verificationImages } = req.body;
        const isLandlord = role?.toUpperCase() === 'LANDLORD';
        const files = req.files;
        let nrcFrontUrl = '';
        let nrcBackUrl = '';
        const uploadDir = path_1.default.join(__dirname, '../../uploads/nrc');
        if (!fs_1.default.existsSync(uploadDir))
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        // Handle NRC front upload
        if (files.nrcFront && files.nrcFront[0]) {
            const file = files.nrcFront[0];
            const filePath = `uploads/nrc/${Date.now()}-${file.originalname}`;
            const fullPath = path_1.default.join(__dirname, '../../', filePath);
            fs_1.default.writeFileSync(fullPath, file.buffer);
            nrcFrontUrl = filePath;
        }
        // Handle NRC back upload
        if (files.nrcBack && files.nrcBack[0]) {
            const file = files.nrcBack[0];
            const filePath = `uploads/nrc/${Date.now()}-${file.originalname}`;
            const fullPath = path_1.default.join(__dirname, '../../', filePath);
            fs_1.default.writeFileSync(fullPath, file.buffer);
            nrcBackUrl = filePath;
        }
        // Landlord verification uploads (optional)
        // frontend sends verificationImages as an array of public URLs
        const verificationUrls = (0, verification_1.parseVerificationImages)(verificationImages);
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await db_1.prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                role: role.toUpperCase(),
                phone,
                university,
                compoundName,
                nrcImages: (verificationUrls.length
                    ? verificationUrls.map((url) => ({ url }))
                    : [nrcFrontUrl, nrcBackUrl]).filter(Boolean),
                status: isLandlord ? 'PENDING' : 'ACTIVE',
                phoneVerified: false,
                // Automatically create a compound for landlords
                ...(isLandlord && compoundName ? {
                    compounds: {
                        create: {
                            name: compoundName,
                            location: 'Pending Update', // Default location, can be updated later
                        }
                    }
                } : {})
            }
        });
        // OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await db_1.prisma.otpVerification.create({
            data: {
                code: otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                userId: user.id
            }
        });
        await (0, emailService_1.sendOTP)(email, otp);
        if (!isLandlord) {
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.status(201).json({
                message: 'User created. OTP sent to email for verification.',
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    university: user.university,
                    compoundName: user.compoundName,
                    nrcImages: user.nrcImages
                }
            });
        }
        return res.status(201).json({
            message: 'Landlord account submitted and pending admin approval.',
            userId: user.id,
            status: user.status
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});
/* =========================
   VERIFY OTP
========================= */
router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const verification = await db_1.prisma.otpVerification.findFirst({
            where: {
                userId,
                code: otp,
                verified: false,
                expiresAt: { gt: new Date() }
            }
        });
        if (!verification) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        await db_1.prisma.$transaction([
            db_1.prisma.user.update({
                where: { id: userId },
                data: { phoneVerified: true }
            }),
            db_1.prisma.otpVerification.update({
                where: { id: verification.id },
                data: { verified: true }
            })
        ]);
        const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                phone: true,
                university: true,
                avatar: true,
                nrcImages: true,
                compoundName: true
            }
        });
        return res.json({ token, user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map