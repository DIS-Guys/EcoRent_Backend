import { Request, Response } from 'express';
import PaymentCard, { IPaymentCard } from '../models/PaymentCard';

export const addPaymentCard = async (req: Request, res: Response) => {
  const { cardNumber, expiryDate, ownerName, ownerId } = req.body;

  try {
    const newPaymentCard: IPaymentCard = new PaymentCard({
      cardNumber,
      expiryDate,
      ownerName,
      ownerId,
    });
    await newPaymentCard.save();

    res.status(201).json({ message: 'Платіжна картка додана.' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const getPaymentCardsByOwnerId = async (req: Request, res: Response) => {
  const ownerId = (req as any).user.id;

  try {
    const paymentCards = await PaymentCard.find({ ownerId });

    if (paymentCards.length === 0) {
      return res
        .status(404)
        .json({ message: 'Користувач не має платіжних карток.' });
    }

    res.status(200).json(paymentCards);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const deletePaymentCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedPaymentCard = await PaymentCard.findByIdAndDelete(id);

    if (!deletedPaymentCard) {
      return res.status(404).json({ message: 'Платіжну картку не знайдено.' });
    }

    res
      .status(200)
      .json({
        message: 'Платіжну картку успішно видалено.',
        deletedPaymentCard,
      });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};
