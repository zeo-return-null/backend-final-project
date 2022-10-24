import { ProductDaoFs } from "./products/ProductDaoFs";
import { CartDaoFs } from "./carritos/CartDaoFs";
import { UserDaoMongo } from "./users/UserDaoMongo";
import { ProductDaoMongo } from "./products/ProductDaoMongo";
import { CartDaoMongo } from "./carritos/CartDaoMongo";
import { OrderDaoMongo } from "./orders/OrderDaoMongo";
import { MessageDaoMongo } from "./messages/MessageDaoMongo";

export enum DB_TYPE {
  FS = "FS",
  MONGO = "MONGO",
}

export enum DAO_TYPE {
  CART = "CART",
  PRODUCT = "PRODUCT",
  USER = "USER",
  ORDER = "ORDER",
}

export class MyDaoFactory {
  private static instance: MyDaoFactory;

  constructor() {}

  static getInstance() {
    if (!MyDaoFactory.instance) {
      MyDaoFactory.instance = new MyDaoFactory();
    }
    return MyDaoFactory.instance;
  }

  createCartDao(dbType: DB_TYPE) {
    switch (dbType) {
      case DB_TYPE.MONGO:
        return CartDaoMongo.getInstance();
      case DB_TYPE.FS:
        return CartDaoFs.getInstance();
      default: // Mongo
        return CartDaoMongo.getInstance();
    }
  }

  createProductDao(dbType: DB_TYPE) {
    switch (dbType) {
      case DB_TYPE.MONGO:
        return ProductDaoMongo.getInstance();
      case DB_TYPE.FS:
        return ProductDaoFs.getInstance();
      default: // Mongo
        return ProductDaoMongo.getInstance();
    }
  }

  createUserDao(dbType: DB_TYPE) {
    switch (dbType) {
      default: // Mongo
        return UserDaoMongo.getInstance();
    }
  }

  createOrderDao(dbType: DB_TYPE) {
    switch (dbType) {
      default: // Mongo
        return OrderDaoMongo.getInstance();
    }
  }

  createMessageDao(dbType: DB_TYPE) {
    switch (dbType) {
      default: // Mongo
        return MessageDaoMongo.getInstance();
    }
  }
}
