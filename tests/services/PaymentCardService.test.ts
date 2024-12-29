import { PaymentCardService } from '../../src/services/PaymentCardService';
import PaymentCard from '../../src/models/PaymentCard';
import mongoose from 'mongoose';

jest.mock('../../src/models/PaymentCard');

describe('PaymentCardService', () => {
  const mockCardId = '507f1f77bcf86cd799439011';
  const mockOwnerId = '507f1f77bcf86cd799439012';
  const wrongOwnerId = '507f1f77bcf86cd799439013';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPaymentCardsByOwnerId', () => {
    it('should return all payment cards for owner', async () => {
      const mockCards = [
        { _id: '507f1f77bcf86cd799439014', cardNumber: '4242424242424242' },
        { _id: '507f1f77bcf86cd799439015', cardNumber: '4242424242424243' },
      ];
      (PaymentCard.find as jest.Mock).mockResolvedValue(mockCards);

      const result =
        await PaymentCardService.getPaymentCardsByOwnerId(mockOwnerId);

      expect(PaymentCard.find).toHaveBeenCalledWith({ ownerId: mockOwnerId });
      expect(result).toEqual(mockCards);
    });

    it('should return empty array if no cards found', async () => {
      (PaymentCard.find as jest.Mock).mockResolvedValue([]);

      const result =
        await PaymentCardService.getPaymentCardsByOwnerId(mockOwnerId);

      expect(PaymentCard.find).toHaveBeenCalledWith({ ownerId: mockOwnerId });
      expect(result).toEqual([]);
    });
  });

  describe('deletePaymentCard', () => {
    it('should delete payment card successfully', async () => {
      const mockCard = {
        _id: mockCardId,
        ownerId: new mongoose.Types.ObjectId(mockOwnerId),
        cardNumber: '4242424242424242',
      };

      (PaymentCard.findById as jest.Mock).mockResolvedValue(mockCard);
      (PaymentCard.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      await PaymentCardService.deletePaymentCard(mockCardId, mockOwnerId);

      expect(PaymentCard.findById).toHaveBeenCalledWith(mockCardId);
      expect(PaymentCard.findByIdAndDelete).toHaveBeenCalledWith(mockCardId);
    });

    it('should throw NOT_FOUND error if card does not exist', async () => {
      (PaymentCard.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        PaymentCardService.deletePaymentCard(mockCardId, mockOwnerId),
      ).rejects.toThrow('NOT_FOUND');
    });

    it('should throw FORBIDDEN error if user is not owner', async () => {
      const mockCard = {
        _id: mockCardId,
        ownerId: new mongoose.Types.ObjectId(mockOwnerId),
        cardNumber: '4242424242424242',
      };

      (PaymentCard.findById as jest.Mock).mockResolvedValue(mockCard);

      await expect(
        PaymentCardService.deletePaymentCard(mockCardId, wrongOwnerId),
      ).rejects.toThrow('FORBIDDEN');
    });
  });
});
