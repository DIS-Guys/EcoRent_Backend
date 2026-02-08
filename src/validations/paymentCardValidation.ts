import { z } from 'zod';

export const addPaymentCardSchema = z.object({
  cardNumber: z
    .string()
    .min(13, 'Card number is too short.')
    .max(19, 'Card number is too long.'),
  expiryDate: z
    .array(z.number())
    .length(2, 'Expiry date must contain 2 elements (month, year).'),
  ownerName: z.string().min(1, 'Owner name is required.').max(100),
});
