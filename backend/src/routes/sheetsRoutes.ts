import express from 'express';
import type { Router } from 'express';
import { getTab, getTabByTabName, refreshCache } from '../controllers/sheetsController';

const router: Router = express.Router();

router.get('/gid/:gid', getTab);
router.get('/name/:tabName', getTabByTabName);
router.post('/refresh', refreshCache);

export default router;