import express from 'express';
import {
  createUser,
  authenticateUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', createUser as express.RequestHandler);
router.post('/login', authenticateUser as express.RequestHandler);
router.get(
  '/getUser/',
  authenticateToken as express.RequestHandler,
  getUser as express.RequestHandler
);
router.put('/updateUser/:id', updateUser as express.RequestHandler);
router.delete(
  '/deleteUser',
  authenticateToken as express.RequestHandler,
  deleteUser as express.RequestHandler
);

export default router;
