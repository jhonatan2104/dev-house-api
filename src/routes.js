import { Router } from 'express';
import { requestEmpty } from './utils';
import multer from 'multer';
import uploadConfig from './config/upload';

import SessionControllers from './controllers/SessionControllers';
import HouseControllers from './controllers/HouseControllers';

const router = new Router();
const upload = multer(uploadConfig);

router.post('/sessions', SessionControllers.store);

router.post('/houses', upload.single('thumbnail'), HouseControllers.store);
router.get('/houses', HouseControllers.index);
router.put('/houses/:house_id', upload.single('thumbnail'), HouseControllers.update);



export default router;