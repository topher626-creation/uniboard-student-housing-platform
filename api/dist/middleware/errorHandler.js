export class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: 'Validation error', details: err.message });
        return;
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Record already exists' });
        return;
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
};
//# sourceMappingURL=errorHandler.js.map