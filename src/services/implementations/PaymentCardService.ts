import { IPaymentCardService } from '../../interfaces/services/IPaymentCardService';
import PaymentCard from '../../models/PaymentCard';

export class PaymentCardService implements IPaymentCardService {
  async createPaymentCard(
    cardNumber: string,
    expiryDate: number[],
    ownerName: string,
    ownerId: string,
  ) {
    const paymentCard = new PaymentCard({
      cardNumber,
      expiryDate,
      ownerName,
      ownerId,
    });
    await paymentCard.save();

    return paymentCard;
  }

  async getPaymentCardsByOwnerId(ownerId: string) {
    return await PaymentCard.find({ ownerId });
  }

  async deletePaymentCard(id: string, ownerId: string): Promise<void> {
    const paymentCard = await PaymentCard.findById(id);
    if (!paymentCard) {
      throw new Error('NOT_FOUND');
    }

    if (paymentCard.ownerId.toString() !== ownerId) {
      throw new Error('FORBIDDEN');
    }

    await PaymentCard.findByIdAndDelete(id);
  }
}
