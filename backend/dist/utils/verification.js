"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVerificationImages = parseVerificationImages;
function parseVerificationImages(input) {
    if (Array.isArray(input)) {
        return input.filter((value) => typeof value === 'string' && Boolean(value.trim()));
    }
    if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed)
            return [];
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.filter((value) => typeof value === 'string' && Boolean(value.trim()));
            }
            if (typeof parsed === 'string' && parsed.trim()) {
                return [parsed.trim()];
            }
        }
        catch {
            return [trimmed];
        }
    }
    return [];
}
//# sourceMappingURL=verification.js.map