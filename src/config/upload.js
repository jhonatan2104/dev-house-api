import multer from 'multer';
import path from 'path';
import crypto from 'crypto-js';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const storageTypes = {
  local: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      try {
        const hash = crypto.lib.WordArray.random(16);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);

        file.key = `${name}-${hash}${ext}`;
        file.location = `http://localhost:3333/files/${file.key}`;

        cb(null, file.key);
      } catch (error) {
        cb(error);
      }
    }
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: 'upload-dev-house',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
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
};

export default {
  storage:  storageTypes.local,
}
