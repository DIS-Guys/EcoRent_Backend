import mongoose from 'mongoose';
import request from 'supertest';
import express, { RequestHandler } from 'express';
import {
  createTicket,
  getTicket,
  getAllTickets,
  deleteTicket,
} from '../../src/controllers/ticketController';
import Ticket from '../../src/models/Ticket';

const app = express();
app.use(express.json());

app.post('/tickets', createTicket as RequestHandler);
app.get('/tickets/:id', getTicket as RequestHandler);
app.get('/tickets', getAllTickets as RequestHandler);
app.delete('/tickets/:id', deleteTicket as RequestHandler);

jest.mock('../../src/models/Ticket', () => {
  const mockSave = jest.fn();
  const mockModel = jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));

  return {
    __esModule: true,
    default: Object.assign(mockModel, {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
    }),
  };
});

describe('Ticket Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTicket', () => {
    const mockTicketData = {
      userEmail: 'test@example.com',
      message: 'Test message',
    };

    it('should successfully create new ticket', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockedTicket = new (Ticket as any)(mockTicketData);
      mockedTicket.save.mockResolvedValueOnce(mockTicketData);

      const response = await request(app).post('/tickets').send(mockTicketData);

      expect(response.status).toBe(201);
      expect(response.body.message).toEqual('Тікет створено.');
      expect(mockedTicket.save).toHaveBeenCalled();
    });

    it('should return error 500 if creation failed', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockedTicket = new (Ticket as any)(mockTicketData);
      mockedTicket.save.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).post('/tickets').send(mockTicketData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Помилка сервера.');
      expect(mockedTicket.save).toHaveBeenCalled();
    });
  });

  describe('getTicketById', () => {
    const mockId = new mongoose.Types.ObjectId();
    const mockTicketData = {
      _id: mockId,
      userEmail: 'test@example.com',
      message: 'Test message',
    };

    it('should find ticket by id', async () => {
      (Ticket.findById as jest.Mock).mockResolvedValue({
        ...mockTicketData,
        _id: mockId,
        toObject: () => ({
          ...mockTicketData,
          _id: mockId.toString(),
        }),
      });

      const response = await request(app).get(`/tickets/${mockId.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...mockTicketData,
        _id: mockId.toString(),
      });
    });

    it('should return 404 if ticket not found', async () => {
      (Ticket.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get(`/tickets/${mockId.toString()}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Тікет не знайдено.');
    });
  });

  describe('getAllTickets', () => {
    const mockTickets = [
      { userEmail: 'test1@example.com', message: 'Test 1' },
      { userEmail: 'test2@example.com', message: 'Test 2' },
    ];

    it('should return all tickets', async () => {
      (Ticket.find as jest.Mock).mockResolvedValue(mockTickets);

      const response = await request(app).get('/tickets');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTickets);
    });

    it('should return error 500 for request error', async () => {
      (Ticket.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/tickets');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Помилка сервера.');
    });
  });

  describe('deleteTicket', () => {
    const mockId = new mongoose.Types.ObjectId();
    const mockTicketData = {
      _id: mockId,
      userEmail: 'test@example.com',
      message: 'Test message',
    };

    it('should successfully delete ticket', async () => {
      (Ticket.findByIdAndDelete as jest.Mock).mockResolvedValue({
        ...mockTicketData,
        _id: mockId,
        toObject: () => ({
          ...mockTicketData,
          _id: mockId.toString(),
        }),
      });

      const response = await request(app).delete(
        `/tickets/${mockId.toString()}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Тікет успішно видалено.');
    });

    it('should return 404 if ticket to delete not found', async () => {
      (Ticket.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete(
        `/tickets/${mockId.toString()}`,
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Тікет не знайдено.');
    });
  });
});
