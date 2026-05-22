import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../index.js';
describe('API integration', () => {
    it('returns a healthy status for /api/health', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'OK', timestamp: expect.any(String) });
    });
});
//# sourceMappingURL=health.test.js.map