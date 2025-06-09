import { IPaymentCard } from '../../models/PaymentCard';

export interface IPaymentCardService {
  createPaymentCard(
    cardNumber: string,
    expiryDate: number[],
    ownerName: string,
    ownerId: string,
  ): Promise<IPaymentCard>;
  getPaymentCardsByOwnerId(ownerId: string): Promise<IPaymentCard[]>;
  deletePaymentCard(id: string, ownerId: string): Promise<void>;
}
