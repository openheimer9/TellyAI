import { Router } from 'express';
import uploadRoutes from './upload.js';
import processRoutes from './process.js';
import voucherRoutes from './voucher.js';

const router = Router();

router.use('/upload', uploadRoutes);
router.use('/process', processRoutes);
router.use('/voucher', voucherRoutes);

export default router;