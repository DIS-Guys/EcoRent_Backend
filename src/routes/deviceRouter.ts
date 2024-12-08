import express from 'express';
import multer from 'multer';

import {
  createDevice,
  deleteDevice,
  getAllDevices,
  getDevice,
  updateDevice,
} from '../controllers/deviceController';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.post(
  '/createDevice',
  upload.array('images', 10),
  createDevice as express.RequestHandler
);
router.get('/getDevice/:id', getDevice as express.RequestHandler);
router.get('/getAllDevices', getAllDevices as express.RequestHandler);
router.put('/updateDevice/:id', updateDevice as express.RequestHandler);
router.delete('/deleteDevice/:id', deleteDevice as express.RequestHandler);

export default router;
