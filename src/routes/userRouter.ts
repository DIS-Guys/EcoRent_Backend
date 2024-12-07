import express from 'express';
import {createUser, authenticateUser, updateUser, deleteUser} from '../controllers/userController';

const router = express.Router();

router.post('/register', createUser as express.RequestHandler);
router.post('/login', authenticateUser as express.RequestHandler);
router.put('/updateUser/:id', updateUser as express.RequestHandler);
router.delete('/deleteUser/:id', deleteUser as express.RequestHandler);

export default router;
