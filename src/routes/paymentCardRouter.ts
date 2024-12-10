import express from "express";
import {
  createPaymentCard,
  getPaymentCardsByOwnerId,
  deletePaymentCard,
} from '../controllers/paymentCardController';

const router = express.Router();

router.post('/createPaymentCard', createPaymentCard as express.RequestHandler);
router.get('/getPaymentCardsByOwnerId/:ownerId', getPaymentCardsByOwnerId as express.RequestHandler);
router.delete('/deletePaymentCard/:id', deletePaymentCard as express.RequestHandler);

export default router;