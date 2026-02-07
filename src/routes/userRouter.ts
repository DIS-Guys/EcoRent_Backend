import express from 'express';
import {
  createUser,
  authenticateUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
} from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema,
} from '../validations/userValidation';

const router = express.Router();

router.post(
  '/register',
  validate(registerSchema),
  createUser as express.RequestHandler,
);
router.post(
  '/login',
  validate(loginSchema),
  authenticateUser as express.RequestHandler,
);
router.get(
  '/getUser',
  authenticateToken as express.RequestHandler,
  getUser as unknown as express.RequestHandler,
);
router.put(
  '/updateUser',
  authenticateToken as express.RequestHandler,
  validate(updateUserSchema) as express.RequestHandler,
  updateUser as unknown as express.RequestHandler,
);
router.delete(
  '/deleteUser',
  authenticateToken as express.RequestHandler,
  deleteUser as unknown as express.RequestHandler,
);
router.put(
  '/updatePassword',
  authenticateToken as express.RequestHandler,
  validate(changePasswordSchema) as express.RequestHandler,
  changePassword as unknown as express.RequestHandler,
);

export default router;
