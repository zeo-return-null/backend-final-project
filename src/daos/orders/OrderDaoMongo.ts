import OrderS, { Order } from "../../models/Order";
import { MongoContainer } from "../../containers/MongoContainer";

export class OrderDaoMongo extends MongoContainer {
  private static instance: OrderDaoMongo;
  private orderManager = new MongoContainer(this.collectionModel);

  constructor() {
    super(OrderS);
  }

  static getInstance() {
    if (!OrderDaoMongo.instance) {
      OrderDaoMongo.instance = new OrderDaoMongo();
    }
    return OrderDaoMongo.instance;
  }

  async getAll() {
    const docs = await this.orderManager.getAll();
    return docs;
  }

  async getById(id: string) {
    return await this.orderManager.getById(id);
  }

  async addItem(item: Order) {
    return await this.orderManager.addItem(item);
  }

  async updateItemById(id: string, item: Order) {
    return await this.orderManager.updateItemById(id, item);
  }

  async deleteItemById(id: string) {
    return await this.orderManager.deleteItemById(id);
  }
}
