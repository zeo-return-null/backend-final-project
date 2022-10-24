import MessageS, { Message } from "../../models/Message";
import { MongoContainer } from "../../containers/MongoContainer";

export class MessageDaoMongo extends MongoContainer {
  private static instance: MessageDaoMongo;
  private messageManager = new MongoContainer(this.collectionModel);

  constructor() {
    super(MessageS);
  }

  static getInstance() {
    if (!MessageDaoMongo.instance) {
      MessageDaoMongo.instance = new MessageDaoMongo();
    }
    return MessageDaoMongo.instance;
  }

  async getAll() {
    const docs = await this.messageManager.getAll();
    return docs;
  }

  async getById(id: string) {
    return await this.messageManager.getById(id);
  }

  async addItem(item: Message) {
    return await this.messageManager.addItem(item);
  }

  async updateItemById(id: string, item: Message) {
    return await this.messageManager.updateItemById(id, item);
  }

  async deleteItemById(id: string) {
    return await this.messageManager.deleteItemById(id);
  }
}
