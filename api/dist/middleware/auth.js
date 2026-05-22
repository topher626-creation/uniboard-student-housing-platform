import { verifyToken, extractToken } from '../utils/auth.js';
export const authMiddleware = (req, res, next) => {
    const token = extractToken(req.headers.authorization);
    if (!token) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return;
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
};
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.role || !roles.includes(req.role)) {
            res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            return;
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map