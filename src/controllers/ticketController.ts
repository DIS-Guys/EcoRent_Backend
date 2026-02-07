import { Request, Response } from 'express';
import { TicketService } from '../services/TicketService';

export const createTicket = async (req: Request, res: Response) => {
  const { userEmail, message } = req.body;

  try {
    const ticket = await TicketService.createTicket(userEmail, message);

    res.status(201).json({ message: 'Тікет створено.', ticket });
  } catch (error) {
    console.error('createTicket error:', error);
    res.status(500).json({ message: 'Помилка сервера.' });
  }
};

export const getTicket = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const ticket = await TicketService.getTicket(id);

    res.status(200).json(ticket);
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Тікет не знайдено.' });
    }
    console.error('getTicket error:', error);
    res.status(500).json({ message: 'Помилка сервера.' });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await TicketService.getAllTickets();

    res.status(200).json(tickets);
  } catch (error) {
    console.error('getAllTickets error:', error);
    res.status(500).json({ message: 'Помилка сервера.' });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    await TicketService.deleteTicket(id);

    res.status(200).json({ message: 'Тікет успішно видалено.' });
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Тікет не знайдено.' });
    }
    console.error('deleteTicket error:', error);
    res.status(500).json({ message: 'Помилка сервера.' });
  }
};
