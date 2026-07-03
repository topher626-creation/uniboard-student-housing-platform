"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLandlordOrManager = exports.isLandlord = exports.isSuperAdmin = exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../lib/db");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true, status: true, adminLevel: true }
        });
        if (!user || user.status !== 'ACTIVE') {
            return res.status(401).json({ error: 'Account pending approval or inactive' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token invalid' });
    }
};
// Role guards
const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.isAdmin = isAdmin;
const isSuperAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN' || req.user?.adminLevel !== 'SUPER') {
        return res.status(403).json({ error: 'Super Admin access required' });
    }
    next();
};
exports.isSuperAdmin = isSuperAdmin;
const isLandlord = (req, res, next) => {
    if (req.user?.role !== 'LANDLORD') {
        return res.status(403).json({ error: 'Landlord access required' });
    }
    next();
};
exports.isLandlord = isLandlord;
const isLandlordOrManager = (req, res, next) => {
    if (req.user?.role !== 'LANDLORD' && req.user?.role !== 'MANAGER') {
        return res.status(403).json({ error: 'Landlord/Manager access required' });
    }
    next();
};
exports.isLandlordOrManager = isLandlordOrManager;
exports.default = authMiddleware;
//# sourceMappingURL=auth.js.map