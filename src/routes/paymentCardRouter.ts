import express from 'express';
import {
  addPaymentCard,
  getPaymentCardsByOwnerId,
  deletePaymentCard,
} from '../controllers/paymentCardController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/createPaymentCard', addPaymentCard as express.RequestHandler);
router.get(
  '/getPaymentCardsByOwnerId',
  authenticateToken as express.RequestHandler,
  getPaymentCardsByOwnerId as express.RequestHandler
);
router.delete(
  '/deletePaymentCard/:id',
  deletePaymentCard as express.RequestHandler
);

export default router;
