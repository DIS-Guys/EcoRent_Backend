import { ITicket } from '../../models/Ticket';

export interface ITicketService {
  createTicket(userEmail: string, message: string): Promise<ITicket>;
  getTicket(id: string): Promise<ITicket | null>;
  getAllTickets(): Promise<ITicket[]>;
  deleteTicket(id: string): Promise<void>;
}
