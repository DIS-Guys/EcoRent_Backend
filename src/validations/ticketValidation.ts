import { z } from 'zod';

export const createTicketSchema = z.object({
  userEmail: z.email('Invalid email format.'),
  message: z
    .string()
    .min(1, 'Message is required.')
    .max(2000, 'Message is too long.'),
});
