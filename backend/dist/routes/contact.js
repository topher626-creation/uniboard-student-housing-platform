"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailService_1 = require("../services/emailService");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        await (0, emailService_1.sendContactEmail)({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });
        res.json({ message: 'Message received. We will respond within 24 hours.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to send message. Please email us directly.' });
    }
});
exports.default = router;
//# sourceMappingURL=contact.js.map