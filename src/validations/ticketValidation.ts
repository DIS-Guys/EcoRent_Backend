import { z } from 'zod';

export const createTicketSchema = z.object({
  userEmail: z.string().email('Невірний формат email.'),
  message: z
    .string()
    .min(1, "Повідомлення є обов'язковим.")
    .max(2000, 'Повідомлення занадто довге.'),
});
