import { ServiceFactory } from './factories/ServiceFactory';
import { DeviceData } from '../interfaces/device.interface';
import { IUser } from '../models/User';
import { IDevice } from '../models/Device';

export class ServiceManager {
  private factory: ServiceFactory;

  constructor(factory: ServiceFactory) {
    this.factory = factory;
  }

  async createDevice(
    deviceInfo: DeviceData,
    images: Express.Multer.File[],
    userId: string,
  ) {
    const deviceService = this.factory.createDeviceService();
    return await deviceService.createDevice(deviceInfo, images, userId);
  }

  async getDevice(id: string) {
    const deviceService = this.factory.createDeviceService();
    return await deviceService.getDevice(id);
  }

  async getAllDevices() {
    const deviceService = this.factory.createDeviceService();
    return await deviceService.getAllDevices();
  }

  async getDevicesByOwnerId(ownerId: string) {
    const deviceService = this.factory.createDeviceService();
    return await deviceService.getDevicesByOwnerId(ownerId);
  }

  async updateDevice(id: string, updates: Partial<IDevice>, ownerId: string) {
    const deviceService = this.factory.createDeviceService();
    return await deviceService.updateDevice(id, updates, ownerId);
  }

  async deleteDevice(id: string, ownerId: string) {
    const deviceService = this.factory.createDeviceService();
    return await deviceService.deleteDevice(id, ownerId);
  }

  async createUser(
    name: string,
    surname: string,
    email: string,
    password: string,
  ) {
    const userService = this.factory.createUserService();
    return await userService.createUser(name, surname, email, password);
  }

  async authenticateUser(email: string, password: string) {
    const userService = this.factory.createUserService();
    return await userService.authenticateUser(email, password);
  }

  async getUser(id: string) {
    const userService = this.factory.createUserService();
    return await userService.getUser(id);
  }

  async updateUser(id: string, updates: Partial<IUser>) {
    const userService = this.factory.createUserService();
    return await userService.updateUser(id, updates);
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const userService = this.factory.createUserService();
    return await userService.changePassword(id, oldPassword, newPassword);
  }

  async deleteUser(id: string) {
    const userService = this.factory.createUserService();
    return await userService.deleteUser(id);
  }

  async createPaymentCard(
    cardNumber: string,
    expiryDate: number[],
    ownerName: string,
    ownerId: string,
  ) {
    const paymentCardService = this.factory.createPaymentCardService();
    return await paymentCardService.createPaymentCard(
      cardNumber,
      expiryDate,
      ownerName,
      ownerId,
    );
  }

  async getPaymentCardsByOwnerId(ownerId: string) {
    const paymentCardService = this.factory.createPaymentCardService();
    return await paymentCardService.getPaymentCardsByOwnerId(ownerId);
  }

  async deletePaymentCard(id: string, ownerId: string) {
    const paymentCardService = this.factory.createPaymentCardService();
    return await paymentCardService.deletePaymentCard(id, ownerId);
  }

  async createTicket(userEmail: string, message: string) {
    const ticketService = this.factory.createTicketService();
    return await ticketService.createTicket(userEmail, message);
  }

  async getTicket(id: string) {
    const ticketService = this.factory.createTicketService();
    return await ticketService.getTicket(id);
  }

  async getAllTickets() {
    const ticketService = this.factory.createTicketService();
    return await ticketService.getAllTickets();
  }

  async deleteTicket(id: string) {
    const ticketService = this.factory.createTicketService();
    return await ticketService.deleteTicket(id);
  }
}
