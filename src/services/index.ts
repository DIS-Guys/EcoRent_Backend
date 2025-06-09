import { ProductionServiceFactory } from './factories/ProductionServiceFactory';
import { ServiceManager } from './ServiceManager';

const serviceFactory = new ProductionServiceFactory();
const serviceManager = new ServiceManager(serviceFactory);

export { ServiceManager, ProductionServiceFactory };
export default serviceManager;
