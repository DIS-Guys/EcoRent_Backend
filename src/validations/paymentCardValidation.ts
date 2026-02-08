import { z } from 'zod';

export const addPaymentCardSchema = z.object({
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => val.length >= 13, {
      message: 'Card number is too short.',
    })
    .refine((val) => val.length <= 19, {
      message: 'Card number is too long.',
    })
    .refine((val) => /^\d+$/.test(val), {
      message: 'Card number must contain only digits.',
    }),
  expiryDate: z
    .array(z.number().int())
    .length(2, 'Expiry date must contain 2 elements (month, year).')
    .refine(([month]) => month >= 1 && month <= 12, {
      message: 'Month must be between 1 and 12.',
    }),
  ownerName: z.string().min(1, 'Owner name is required.').max(100),
});
