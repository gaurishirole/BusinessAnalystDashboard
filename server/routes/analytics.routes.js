import express from 'express';
import { getAnalyticsStats } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/', getAnalyticsStats);

export default router;
