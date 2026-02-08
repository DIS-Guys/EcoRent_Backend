import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'eco-rent-images';

let s3: S3Client | null = null;

const shouldMockS3 = () => {
  if (process.env.MOCK_S3 === 'true') {
    return true;
  }

  return (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY
  );
};

const getS3Client = () => {
  if (!s3) {
    s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
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

export const uploadToS3 = async (file: Express.Multer.File) => {
  if (shouldMockS3()) {
    return { Location: buildMockLocation(file) };
  }

  const compressedFileName = file.originalname.trim().split(' ').join('');
  const key = `${uuidv4()}-${compressedFileName}`;

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  const location = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { Location: location };
};

export const deleteFromS3 = async (imageUrl: string) => {
  if (shouldMockS3() || imageUrl.startsWith('data:')) {
    return;
  }

  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: imageUrl.split('/').pop() as string,
    }),
  );
};
