import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { PaymentCardService } from '../services/PaymentCardService';

export const addPaymentCard = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { cardNumber, expiryDate, ownerName } = req.body;
  const ownerId = req.user.id;

  try {
    const paymentCard = await PaymentCardService.createPaymentCard(
      cardNumber,
      expiryDate,
      ownerName,
      ownerId,
    );

    res.status(201).json({ message: 'Payment card added.', paymentCard });
  } catch (error) {
    console.error('addPaymentCard error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getPaymentCardsByOwnerId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const ownerId = req.user.id;

  try {
    const paymentCards =
      await PaymentCardService.getPaymentCardsByOwnerId(ownerId);

    res.status(200).json(paymentCards);
  } catch (error) {
    console.error('getPaymentCardsByOwnerId error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const deletePaymentCard = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const id = req.params.id as string;
  const ownerId = req.user.id;

  try {
    await PaymentCardService.deletePaymentCard(id, ownerId);

    res.status(200).json({
      message: 'Payment card deleted successfully.',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Payment card not found.' });
    }
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    console.error('deletePaymentCard error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
