import { Response } from 'express';
import PaymentCard from '../../src/models/PaymentCard';
import {
  addPaymentCard,
  getPaymentCardsByOwnerId,
  deletePaymentCard,
} from '../../src/controllers/paymentCardController';
import { AuthenticatedRequest } from '../../src/interfaces/request.interface';

jest.mock('../../src/models/PaymentCard');

describe('Payment Card Controller', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;

  const MOCK_USER_ID = '000000000000000000000001';
  const MOCK_CARD_ID = '000000000000000000000002';
  const MOCK_OTHER_USER_ID = '000000000000000000000003';

  const mockUser = { id: MOCK_USER_ID, name: 'Chill', surname: 'Guy' };

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('addPaymentCard', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          cardNumber: '4111111111111111',
          expiryDate: [12, 25],
          ownerName: 'John Doe',
        },
        user: mockUser,
      };
    });

    it('should handle errors when adding a payment card', async () => {
      const dbError = new Error('DB Error');

      (PaymentCard as jest.MockedClass<typeof PaymentCard>).mockReset();
      (PaymentCard as unknown as jest.Mock).mockImplementation(function (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any,
      ) {
        Object.assign(this, {
          ...data,
          save: jest.fn().mockRejectedValueOnce(dbError),
        });
        return this;
      });

      await addPaymentCard(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Помилка сервера.',
        error: dbError,
      });
    });
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
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCards);
    });

    it('should handle errors when getting payment cards', async () => {
      const dbError = new Error('DB Error');
      (PaymentCard.find as jest.Mock).mockRejectedValue(dbError);

      await getPaymentCardsByOwnerId(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Помилка сервера.',
        error: dbError,
      });
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

      await deletePaymentCard(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Платіжну картку успішно видалено.',
      });
    });

    it('should handle payment card not found', async () => {
      (PaymentCard.findById as jest.Mock).mockResolvedValue(null);

      await deletePaymentCard(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

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

      await deletePaymentCard(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Відмовлено у доступі',
      });
    });

    it('should handle errors during deletion', async () => {
      const dbError = new Error('DB Error');
      (PaymentCard.findById as jest.Mock).mockRejectedValue(dbError);

      await deletePaymentCard(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Помилка сервера.',
        error: dbError,
      });
    });
  });
});
