import { IDeviceService } from '../../interfaces/services/IDeviceService';
import { IUserService } from '../../interfaces/services/IUserService';
import { IPaymentCardService } from '../../interfaces/services/IPaymentCardService';
import { ITicketService } from '../../interfaces/services/ITicketService';

export abstract class ServiceFactory {
  abstract createDeviceService(): IDeviceService;
  abstract createUserService(): IUserService;
  abstract createPaymentCardService(): IPaymentCardService;
  abstract createTicketService(): ITicketService;
}
