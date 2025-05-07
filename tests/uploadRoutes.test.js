const request = require('supertest');
const express = require('express');
const uploadRoutes = require('../routes/uploadRoutes');

const app = express();
app.use(express.json());
app.use('/api', uploadRoutes);

// Mock middleware and controller
jest.mock('../middleware/authMiddleware', () => ({
    authenticate: (req, res, next) => {
        if (req.headers.authorization === 'Bearer valid-token') {
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    },
}));

jest.mock('../controllers/uploadController', () => ({
    uploadMaterial: (req, res) => {
        res.status(200).send('Material uploaded successfully');
    },
}));

describe('Upload Routes', () => {
    it('should return 200 for authenticated requests', async () => {
        const response = await request(app)
            .post('/api/upload')
            .set('Authorization', 'Bearer valid-token')
            .send({ material: 'test material' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Material uploaded successfully');
    });

    it('should return 401 for unauthenticated requests', async () => {
        const response = await request(app)
            .post('/api/upload')
            .send({ material: 'test material' });

        expect(response.status).toBe(401);
        expect(response.text).toBe('Unauthorized');
    });
});
