import multer from 'multer';
import path from 'path';
import crypto from 'crypto-js'

export default {
  storage: multer.diskStorage({
      destination: path.resolve(__dirname, '..', '..', 'uploads'),
      filename: (req, file, cb) => {
        try {
          const hash = crypto.lib.WordArray.random(16);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);

          cb(null, `${name}-${hash}${ext}`);
        } catch (error) {
          cb(error);
        }
      }
  }),
}