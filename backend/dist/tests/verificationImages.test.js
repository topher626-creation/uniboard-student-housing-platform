"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const verification_1 = require("../utils/verification");
(0, node_test_1.default)('parses a JSON array of verification image URLs', () => {
    strict_1.default.deepEqual((0, verification_1.parseVerificationImages)('["/uploads/a.png","/uploads/b.png"]'), [
        '/uploads/a.png',
        '/uploads/b.png',
    ]);
});
(0, node_test_1.default)('accepts a single string value and normalizes it to an array', () => {
    strict_1.default.deepEqual((0, verification_1.parseVerificationImages)('/uploads/a.png'), ['/uploads/a.png']);
});
(0, node_test_1.default)('ignores empty and non-array values', () => {
    strict_1.default.deepEqual((0, verification_1.parseVerificationImages)(undefined), []);
    strict_1.default.deepEqual((0, verification_1.parseVerificationImages)(''), []);
    strict_1.default.deepEqual((0, verification_1.parseVerificationImages)(['', '/uploads/a.png']), ['/uploads/a.png']);
});
//# sourceMappingURL=verificationImages.test.js.map