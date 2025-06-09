import { Express } from 'express';

export interface IStorageProvider {
    upload(file: Express.Multer.File): Promise<string>;
    delete(imageUrl: string): Promise<void>;
}