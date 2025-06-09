import { ITicketService } from '../../interfaces/services/ITicketService';
import Ticket from '../../models/Ticket';

export class TicketService implements ITicketService {
  async createTicket(userEmail: string, message: string) {
    const ticket = new Ticket({ userEmail, message });
    await ticket.save();

    return ticket;
  }

  async getTicket(id: string) {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error('NOT_FOUND');
    }

    return ticket;
  }

  async getAllTickets() {
    return await Ticket.find();
  }

  async deleteTicket(id: string): Promise<void> {
    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      throw new Error('NOT_FOUND');
    }
  }
}
