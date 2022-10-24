import { DB_TYPE, MyDaoFactory } from "../daos/MyDaoFactory";
import { MessageDaoMongo } from "../daos/messages/MessageDaoMongo";
import { Message } from "../models/Message";

export class MessageService {
  private static instance: MessageService;
  private messageDao: MessageDaoMongo;

  constructor() {
    const persistance = (process.env.PERSISTANCE as DB_TYPE) || DB_TYPE.MONGO;
    this.messageDao = MyDaoFactory.getInstance().createMessageDao(persistance);
  }

  static getInstance() {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  async getMessageById(id: string) {
    return await this.messageDao.getById(id);
  }

  async getAllMessages() {
    return await this.messageDao.getAll();
  }

  async create(newMessage: Message) {
    const message: Message = {
      ...newMessage,
      creationTime: new Date().toISOString(),
    };
    return await this.messageDao.addItem(message);
  }

  async update(id: string, newMessage: Message) {
    return await this.messageDao.updateItemById(id, newMessage);
  }

  async delete(id: string) {
    return await this.messageDao.deleteItemById(id);
  }
}
