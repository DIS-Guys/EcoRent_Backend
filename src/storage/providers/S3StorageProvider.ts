import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { IStorageProvider } from '../IStorageProvider';

export class S3StorageProvider implements IStorageProvider {
    private s3: AWS.S3;
    private bucketName = 'eco-rent-images';

    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }

    async upload(file: Express.Multer.File): Promise<string> {
        const fileName = `${uuidv4()}-${file.originalname.trim().replace(/\s+/g, '')}`;
        const params: AWS.S3.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const data = await this.s3.upload(params).promise();
        return data.Location;
    }

    async delete(imageUrl: string): Promise<void> {
        const key = imageUrl.split('/').pop();
        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: this.bucketName,
            Key: key as string,
        };

        await this.s3.deleteObject(params).promise();
    }
}