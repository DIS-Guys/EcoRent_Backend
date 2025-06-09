import { StorageProviderFactory } from '../storage/StorageProviderFactory';

const storageProvider = StorageProviderFactory.createProvider(process.env.STORAGE_PROVIDER || 's3');

export default storageProvider;
