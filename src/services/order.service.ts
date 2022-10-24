import { DB_TYPE, MyDaoFactory } from "../daos/MyDaoFactory";
import { OrderDaoMongo } from "../daos/orders/OrderDaoMongo";
import { Order, OrderStatus } from "../models/Order";

export class OrderService {
  private static instance: OrderService;
  private orderDao: OrderDaoMongo;

  constructor() {
    const persistance = (process.env.PERSISTANCE as DB_TYPE) || DB_TYPE.MONGO;
    this.orderDao = MyDaoFactory.getInstance().createOrderDao(persistance);
  }

  static getInstance() {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getOrderById(id: string) {
    return await this.orderDao.getById(id);
  }

  async getAllOrders() {
    return await this.orderDao.getAll();
  }

  async create(newOrder: Order) {
    const allOrders = await this.getAllOrders();
    const order: Order = {
      ...newOrder,
      status: OrderStatus.GENERATED,
      creationTime: new Date().toISOString(),
      orderId: allOrders?.length ?? 0,
    };
    return await this.orderDao.addItem(order);
  }

  async update(id: string, newOrder: Order) {
    return await this.orderDao.updateItemById(id, newOrder);
  }

  async delete(id: string) {
    return await this.orderDao.deleteItemById(id);
  }
}
