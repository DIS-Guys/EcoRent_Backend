import { IStorageProvider } from './IStorageProvider';
import { S3StorageProvider } from './providers/S3StorageProvider';

export class StorageProviderFactory {
    static createProvider(providerName: string): IStorageProvider {
        switch (providerName) {
            case 's3':
                return new S3StorageProvider();
            default:
                throw new Error(`Unknown storage provider: ${providerName}`);
        }
    }
}