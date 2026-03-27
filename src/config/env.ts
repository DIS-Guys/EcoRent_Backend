import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const nodeEnvSchema = z.enum(['development', 'test', 'production']);

const envSchema = z
  .object({
    NODE_ENV: nodeEnvSchema,
    PORT: z.coerce.number().int().positive(),
    JWT_SECRET: z.string().min(1).optional(),
    MONGO_URI: z.string().min(1),
    RATE_LIMIT_MAX: z.coerce.number().int().positive(),
    CORS_ORIGINS: z.string().min(1),
    MOCK_S3: z.enum(['true', 'false']).transform((value) => value === 'true'),
    AWS_REGION: z.string().min(1).optional(),
    AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    S3_BUCKET: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (!data.JWT_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_SECRET is required.',
        path: ['JWT_SECRET'],
      });
    }

    if (!data.MOCK_S3) {
      const requiredAwsVars = [
        'AWS_REGION',
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
      ] as const;

      for (const key of requiredAwsVars) {
        if (!data[key]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${key} is required when MOCK_S3 is false.`,
            path: [key],
          });
        }
      }
    }
  })
  .transform((data) => ({
    nodeEnv: data.NODE_ENV,
    port: data.PORT,
    jwtSecret: data.JWT_SECRET as string,
    mongoUri: data.MONGO_URI,
    rateLimitMax: data.RATE_LIMIT_MAX,
    corsOrigins: parseCorsOrigins(data.CORS_ORIGINS),
    mockS3: data.MOCK_S3,
    awsRegion: data.AWS_REGION,
    awsAccessKeyId: data.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: data.AWS_SECRET_ACCESS_KEY,
    s3Bucket: data.S3_BUCKET,
  }));

export type AppConfig = z.infer<typeof envSchema>;

const parseCorsOrigins = (value: string) => {
  if (value.trim() === '*') {
    return '*';
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const applyDefaults = () => {
  process.env.NODE_ENV ??= 'development';
  process.env.PORT ??= '3000';
  process.env.RATE_LIMIT_MAX ??= '1000';
  process.env.CORS_ORIGINS ??= '*';
  process.env.S3_BUCKET ??= 'eco-rent-images';

  process.env.JWT_SECRET ??=
    process.env.NODE_ENV === 'production' ? undefined : 'dev-jwt-secret';

  process.env.MOCK_S3 ??=
    process.env.NODE_ENV === 'production' ? 'false' : 'true';
};

export const getEnv = (): AppConfig => {
  applyDefaults();
  return envSchema.parse(process.env);
};
