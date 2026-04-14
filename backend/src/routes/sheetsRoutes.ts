import express from 'express';
import type { Router } from 'express';
import { getTabByTabName } from '../controllers/sheetsController';

const router: Router = express.Router();

router.get('/name/:tabName', getTabByTabName);

export default router;