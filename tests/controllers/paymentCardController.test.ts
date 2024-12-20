import { Request, Response } from 'express';
import PaymentCard from '../../src/models/PaymentCard';
import {
  addPaymentCard,
  getPaymentCardsByOwnerId,
  deletePaymentCard,
} from '../../src/controllers/paymentCardController';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

jest.mock('../../src/models/PaymentCard');

describe('Payment Card Controller', () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;

  const MOCK_USER_ID = '000000000000000000000001';
  const MOCK_CARD_ID = '000000000000000000000002';
  const MOCK_OTHER_USER_ID = '000000000000000000000003';

  const mockUser = { id: MOCK_USER_ID };

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getPaymentCardsByOwnerId', () => {
    beforeEach(() => {
      mockRequest = {
        user: mockUser,
      };
    });

    it('should successfully get payment cards by owner id', async () => {
      const mockCards = [
        {
          _id: MOCK_CARD_ID,
          cardNumber: '4111111111111111',
          expiryDate: [12, 25],
          ownerName: 'John Doe',
        },
      ];

      (PaymentCard.find as jest.Mock).mockResolvedValue(mockCards);

      await getPaymentCardsByOwnerId(
        mockRequest as RequestWithUser,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCards);
    });

    it('should handle errors when getting payment cards', async () => {
      (PaymentCard.find as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await getPaymentCardsByOwnerId(
        mockRequest as RequestWithUser,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Помилка сервера.',
        })
      );
    });
  });

  describe('deletePaymentCard', () => {
    beforeEach(() => {
      mockRequest = {
        params: { id: MOCK_CARD_ID },
        user: mockUser,
      };
    });

    it('should successfully delete a payment card', async () => {
      const mockCard = {
        _id: MOCK_CARD_ID,
        ownerId: {
          toString: () => MOCK_USER_ID,
        },
      };

      (PaymentCard.findById as jest.Mock).mockResolvedValue(mockCard);
      (PaymentCard.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      await deletePaymentCard(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Платіжну картку успішно видалено.',
      });
    });

    it('should handle payment card not found', async () => {
      (PaymentCard.findById as jest.Mock).mockResolvedValue(null);

      await deletePaymentCard(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Платіжну картку не знайдено.',
      });
    });

    it('should handle unauthorized deletion', async () => {
      const mockCard = {
        _id: MOCK_CARD_ID,
        ownerId: {
          toString: () => MOCK_OTHER_USER_ID,
        },
      };

      (PaymentCard.findById as jest.Mock).mockResolvedValue(mockCard);

      await deletePaymentCard(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Відмовлено у доступі',
      });
    });

    it('should handle errors during deletion', async () => {
      (PaymentCard.findById as jest.Mock).mockRejectedValue(
        new Error('DB Error')
      );

      await deletePaymentCard(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Помилка сервера.',
        })
      );
    });
  });
});
