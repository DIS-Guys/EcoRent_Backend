import { ServiceFactory } from './ServiceFactory';
import { IDeviceService } from '../../interfaces/services/IDeviceService';
import { IUserService } from '../../interfaces/services/IUserService';
import { IPaymentCardService } from '../../interfaces/services/IPaymentCardService';
import { ITicketService } from '../../interfaces/services/ITicketService';
import { DeviceService } from '../implementations/DeviceService';
import { UserService } from '../implementations/UserService';
import { PaymentCardService } from '../implementations/PaymentCardService';
import { TicketService } from '../implementations/TicketService';

export class ProductionServiceFactory extends ServiceFactory {
  createDeviceService(): IDeviceService {
    return new DeviceService();
  }

  createUserService(): IUserService {
    return new UserService();
  }

  createPaymentCardService(): IPaymentCardService {
    return new PaymentCardService();
  }

  createTicketService(): ITicketService {
    return new TicketService();
  }
}
