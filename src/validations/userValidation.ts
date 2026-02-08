import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(50),
  surname: z.string().min(1, 'Surname is required.').max(50),
  email: z.email('Invalid email format.'),
  password: z
    .string()
    .min(6, 'Password must contain at least 6 characters.')
    .max(128)
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).*$/,
      'Password must contain at least one letter and one digit.',
    ),
});

export const loginSchema = z.object({
  email: z.email('Invalid email format.'),
  password: z.string().min(1, 'Password is required.'),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(1).max(50).optional(),
    surname: z.string().min(1).max(50).optional(),
    phoneNumber: z.string().max(20).optional(),
    region: z.string().max(100).optional(),
    town: z.string().max(100).optional(),
    street: z.string().max(200).optional(),
    houseNumber: z.number().int().positive().optional(),
    apartmentNumber: z.number().int().positive().optional(),
    floorNumber: z.number().int().optional(),
  })
  .strict();

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required.'),
  newPassword: z
    .string()
    .min(6, 'New password must contain at least 6 characters.')
    .max(128)
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).*$/,
      'Password must contain at least one letter and one digit.',
    ),
});
