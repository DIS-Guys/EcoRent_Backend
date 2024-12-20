import { Request, Response } from 'express';
import PaymentCard, { IPaymentCard } from '../models/PaymentCard';

export const addPaymentCard = async (req: Request, res: Response) => {
  const { cardNumber, expiryDate, ownerName } = req.body;
  const ownerId = (req as any).user.id;

  try {
    const paymentCard: IPaymentCard = new PaymentCard({
      cardNumber,
      expiryDate,
      ownerName,
      ownerId,
    });
    await paymentCard.save();

    res.status(201).json({ message: 'Платіжна картка додана.', paymentCard });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const getPaymentCardsByOwnerId = async (req: Request, res: Response) => {
  const ownerId = (req as any).user.id;

  try {
    const paymentCards = await PaymentCard.find({ ownerId });

    res.status(200).json(paymentCards);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const deletePaymentCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ownerId = (req as any).user.id;

  try {
    const paymentCard = await PaymentCard.findById(id);
    if (!paymentCard) {
      return res.status(404).json({ message: 'Платіжну картку не знайдено.' });
    }

    if (paymentCard.ownerId.toString() !== ownerId) {
      return res.status(403).json({ message: 'Відмовлено у доступі' });
    }

    await PaymentCard.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Платіжну картку успішно видалено.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};
