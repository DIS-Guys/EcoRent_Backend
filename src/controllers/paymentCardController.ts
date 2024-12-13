import { Request, Response } from 'express';
import PaymentCard, { IPaymentCard } from '../models/PaymentCard';

export const createPaymentCard = async (req: Request, res: Response) => {
  const {
    cardNumber,
    expiryDate,
    ownerName,
    ownerId,
  } = req.body;

  try {
    const newPaymentCard = new PaymentCard({
      cardNumber,
      expiryDate,
      ownerName,
      ownerId,
    });
    await newPaymentCard.save();

    res.status(201).json({ message: 'PaymentCard created'});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPaymentCardsByOwnerId = async (req: Request, res: Response) => {
  const { ownerId } = req.params;

  try {
    if (!ownerId) {
      return res.status(400).json({ message: 'OwnerId is required' });
    }

    const paymentCards = await PaymentCard.find({ ownerId });

    if (paymentCards.length === 0) {
      return res.status(404).json({ message: 'PaymentCards not found' });
    }

    res.status(200).json(paymentCards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export const deletePaymentCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedPaymentCard = await PaymentCard.findByIdAndDelete(id);

    if (!deletedPaymentCard) {
      return res.status(404).json({ message: 'PaymentCard not found' });
    }

    res.status(200).json({ message: 'PaymentCard deleted successfully!', deletedPaymentCard });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};