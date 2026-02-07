import { z } from 'zod';

export const addPaymentCardSchema = z.object({
  cardNumber: z
    .string()
    .min(13, 'Номер картки занадто короткий.')
    .max(19, 'Номер картки занадто довгий.'),
  expiryDate: z
    .array(z.number())
    .length(2, 'Дата закінчення має містити 2 елементи (місяць, рік).'),
  ownerName: z.string().min(1, "Ім'я власника є обов'язковим.").max(100),
});
