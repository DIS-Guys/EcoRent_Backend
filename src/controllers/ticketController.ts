import { Request, Response } from 'express';
import serviceManager from '../services';

export const createTicket = async (req: Request, res: Response) => {
  const { userEmail, message } = req.body;

  try {
    const ticket = await serviceManager.createTicket(userEmail, message);

    res.status(201).json({ message: 'Тікет створено.', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const getTicket = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ticket = await serviceManager.getTicket(id);

    res.status(200).json(ticket);
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Тікет не знайдено.' });
    }
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await serviceManager.getAllTickets();

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await serviceManager.deleteTicket(id);

    res.status(200).json({ message: 'Тікет успішно видалено.' });
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Тікет не знайдено.' });
    }
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};
