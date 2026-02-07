import express from 'express';
import {
  addPaymentCard,
  getPaymentCardsByOwnerId,
  deletePaymentCard,
} from '../controllers/paymentCardController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { addPaymentCardSchema } from '../validations/paymentCardValidation';
import { objectIdParamSchema } from '../validations/commonValidation';

const router = express.Router();

router.post(
  '/addPaymentCard',
  authenticateToken as express.RequestHandler,
  validate(addPaymentCardSchema) as express.RequestHandler,
  addPaymentCard as unknown as express.RequestHandler,
);
router.get(
  '/getPaymentCardsByOwnerId',
  authenticateToken as express.RequestHandler,
  getPaymentCardsByOwnerId as unknown as express.RequestHandler,
);
router.delete(
  '/deletePaymentCard/:id',
  authenticateToken as express.RequestHandler,
  validate(objectIdParamSchema, 'params') as express.RequestHandler,
  deletePaymentCard as unknown as express.RequestHandler,
);

export default router;
