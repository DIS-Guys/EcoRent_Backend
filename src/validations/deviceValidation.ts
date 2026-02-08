import { z } from 'zod';

export const addDeviceSchema = z
  .object({
    title: z.string().min(1, 'Title is required.').max(200),
    description: z.string().max(2000).optional(),
    manufacturer: z.string().min(1, 'Manufacturer is required.').max(100),
    deviceModel: z.string().min(1, 'Device model is required.').max(100),
    condition: z.string().min(1, 'Condition is required.').max(50),
    batteryCapacity: z.coerce
      .number()
      .positive('Battery capacity must be positive.'),
    weight: z.coerce.number().positive('Weight must be positive.'),
    typeC: z.coerce.number().int().positive('Type-C count must be positive.'),
    typeA: z.coerce.number().int().positive('Type-A count must be positive.'),
    sockets: z.coerce
      .number()
      .int()
      .positive('Sockets count must be positive.'),
    remoteUse: z.string().min(1, 'Remote use option is required.').max(50),
    dimensions: z.object({
      length: z
        .string()
        .min(1, 'Length is required.')
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
          message: 'Length must be a valid non-negative number.',
        }),
      width: z
        .string()
        .min(1, 'Width is required.')
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
          message: 'Width must be a valid non-negative number.',
        }),
      height: z
        .string()
        .min(1, 'Height is required.')
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
          message: 'Height must be a valid non-negative number.',
        }),
    }),
    batteryType: z.string().min(1, 'Battery type is required.').max(50),
    signalShape: z.string().min(1, 'Signal shape is required.').max(50),
    additional: z.string().max(2000).optional(),
    price: z.coerce.number().positive('Price must be positive.'),
    minRentTerm: z.coerce
      .number()
      .int()
      .positive('Min rent term must be positive.'),
    maxRentTerm: z.coerce
      .number()
      .int()
      .positive('Max rent term must be positive.'),
    policyAgreement: z.coerce.boolean().refine((val) => val === true, {
      message: 'Policy agreement is required.',
    }),
  })
  .refine((data) => data.minRentTerm <= data.maxRentTerm, {
    message: 'Min rent term cannot exceed max rent term.',
    path: ['minRentTerm'],
  });

export const updateDeviceSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    manufacturer: z.string().min(1).max(100).optional(),
    deviceModel: z.string().min(1).max(100).optional(),
    condition: z.string().min(1).max(50).optional(),
    batteryCapacity: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    typeC: z.number().int().positive().optional(),
    typeA: z.number().int().positive().optional(),
    sockets: z.number().int().positive().optional(),
    remoteUse: z.string().min(1).max(50).optional(),
    dimensions: z
      .object({
        length: z
          .string()
          .min(1)
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: 'Length must be a valid non-negative number.',
          }),
        width: z
          .string()
          .min(1)
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: 'Width must be a valid non-negative number.',
          }),
        height: z
          .string()
          .min(1)
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: 'Height must be a valid non-negative number.',
          }),
      })
      .optional(),
    batteryType: z.string().min(1).max(50).optional(),
    signalShape: z.string().min(1).max(50).optional(),
    additional: z.string().max(2000).optional(),
    price: z.number().positive().optional(),
    minRentTerm: z.number().int().positive().optional(),
    maxRentTerm: z.number().int().positive().optional(),
    isInRent: z.boolean().optional(),
  })
  .strict();
