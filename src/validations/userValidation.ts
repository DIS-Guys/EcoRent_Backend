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
    email: z.email('Invalid email format.').optional(),
    phoneNumber: z
      .string()
      .max(20)
      .refine(
        (val) => {
          if (!val) return true;
          return /^(((\+?38)[-\s(.]?\d{3}[-\s).]?)|([.(]?0\d{2}[.)]?))?[-\s.]?\d{3}[-\s.]?\d{2}[-\s.]?\d{2}$/.test(
            val,
          );
        },
        { message: 'Invalid phone number format.' },
      )
      .optional(),
    region: z
      .string()
      .max(100)
      .refine((val) => !val || !/\d/.test(val), {
        message: 'Region must not contain digits.',
      })
      .optional(),
    town: z
      .string()
      .max(100)
      .refine((val) => !val || !/^\d/.test(val), {
        message: 'Town must not start with a digit.',
      })
      .optional(),
    street: z
      .string()
      .max(200)
      .refine((val) => !val || !/^\d/.test(val), {
        message: 'Street must not start with a digit.',
      })
      .optional(),
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
