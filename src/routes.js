// import express, { Router } from 'express';
import { Router } from 'express';
import { requestEmpty } from './utils';
import multer from 'multer';
import uploadConfig from './config/upload';

import SessionControllers from './controllers/SessionControllers';
import HouseControllers from './controllers/HouseControllers';
import DashboardControllers from './controllers/DashboardControllers';
import ReserveControllers from './controllers/ReserveControllers';

// const router: express.IRouter  = new Router();
const router = new Router();
const upload = multer(uploadConfig);

router.post('/sessions', SessionControllers.store);

router.post('/houses', upload.single('thumbnail'), HouseControllers.store);
router.get('/houses', HouseControllers.index);
router.put('/houses/:house_id', upload.single('thumbnail'), HouseControllers.update);
router.delete('/houses', HouseControllers.destroy);

router.post('/houses/:house_id/reserve', ReserveControllers.store);
router.get('/reserve', ReserveControllers.index);
router.delete('/reserve/cancel', ReserveControllers.destroy);

router.get('/dashboard', DashboardControllers.show);



export default router;
