import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { getEnv } from './env';

let s3: S3Client | null = null;

const shouldMockS3 = () => getEnv().mockS3;

const getS3Client = () => {
  if (!s3) {
    const env = getEnv();

    s3 = new S3Client({
      region: env.awsRegion,
      credentials: {
        accessKeyId: env.awsAccessKeyId as string,
        secretAccessKey: env.awsSecretAccessKey as string,
      },
    });
  }

  return s3;
};

const buildMockLocation = (file: Express.Multer.File) => {
  const mimeType = file.mimetype || 'application/octet-stream';
  const base64 = file.buffer.toString('base64');

  return `data:${mimeType};base64,${base64}`;
};

const extractS3KeyFromUrl = (imageUrl: string) => {
  try {
    const parsedUrl = new URL(imageUrl);
    return decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ''));
  } catch {
    return imageUrl.replace(/^\/+/, '');
  }
};

export const uploadToS3 = async (file: Express.Multer.File) => {
  if (shouldMockS3()) {
    return { Location: buildMockLocation(file) };
  }

  const env = getEnv();
  const compressedFileName = file.originalname.trim().split(' ').join('');
  const key = `${randomUUID()}-${compressedFileName}`;

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: env.s3Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  const location = `https://${env.s3Bucket}.s3.${env.awsRegion}.amazonaws.com/${key}`;

  return { Location: location };
};

export const deleteFromS3 = async (imageUrl: string) => {
  if (shouldMockS3() || imageUrl.startsWith('data:')) {
    return;
  }

  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: getEnv().s3Bucket,
      Key: extractS3KeyFromUrl(imageUrl),
    }),
  );
};
