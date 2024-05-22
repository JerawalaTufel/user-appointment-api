import { Router } from 'express';
import apiRoute from './v1';

const router: Router = Router();

router.use(apiRoute);

export default router;
