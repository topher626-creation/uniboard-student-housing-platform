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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = __importStar(require("../middleware/auth"));
const db_1 = require("../lib/db");
const emailService_1 = require("../services/emailService");
const router = express_1.default.Router();
router.use(auth_1.default);
// GET /api/admin/users - List all users (admin only)
router.get('/users', auth_1.isAdmin, async (req, res) => {
    try {
        const users = await db_1.prisma.user.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// PATCH /api/admin/users/:id/approve
router.patch('/users/:id/approve', auth_1.isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db_1.prisma.user.update({
            where: { id },
            data: { status: 'ACTIVE' }
        });
        await (0, emailService_1.sendApprovalEmail)(user.email, 'approved');
        res.json({ message: 'User approved', user });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// PATCH /api/admin/users/:id/reject
router.patch('/users/:id/reject', auth_1.isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const user = await db_1.prisma.user.update({
            where: { id },
            data: { status: 'REJECTED' }
        });
        await (0, emailService_1.sendApprovalEmail)(user.email, 'rejected', reason);
        res.json({ message: 'User rejected', user });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// POST /api/admin/admins (Super admin create assistant)
router.post('/admins', auth_1.isSuperAdmin, async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const admin = await db_1.prisma.user.create({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map