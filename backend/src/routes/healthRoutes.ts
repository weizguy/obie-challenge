import express from 'express';
import type { Router } from 'express';
import { getHealth } from '../controllers/healthController';

const router: Router = express.Router();

router.get('/', getHealth);

export default router;