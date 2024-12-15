import { Request, Response } from 'express';
import Ticket, { ITicket } from '../models/Ticket';

export const createTicket = async (req: Request, res: Response) => {
  const { userEmail, message } = req.body;

  try {
    const newTicket: ITicket = new Ticket({ userEmail, message });
    await newTicket.save();

    res.status(201).json({ message: 'Тікет створено.' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Тікет не знайдено.' });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find();

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return res.status(404).json({ message: 'Тікет не знайдено.' });
    }

    res.status(200).json({ message: 'Тікет успішно видалено.', deletedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.', error });
  }
};
