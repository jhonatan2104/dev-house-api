import { Router } from 'express';
import { requestEmpty } from './utils';

import SessionControllers from './controllers/SessionControllers';

const router = new Router();

router.post('/sessions', SessionControllers.store);


export default router;