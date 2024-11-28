import express from 'express';
import { createUser, authenticateUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', createUser as express.RequestHandler);
router.post('/login', authenticateUser as express.RequestHandler);

export default router;
