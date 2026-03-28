import express from 'express';
import { reportSos, getNearbySOS } from '../controllers/sosController.js';
import { verifyResponder } from '../middleware/auth.js';

const router = express.Router();

// Public/Mesh endpoint for SOS ingestion (offline devices might not have valid tokens initially via mesh)
router.post('/report', reportSos);

// Protected endpoint for Rescuers/Command Center
// We applied auth here so only verified dashboard users can query rescue data
router.get('/nearby', verifyResponder, getNearbySOS);

export default router;
