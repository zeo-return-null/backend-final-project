import { Product } from "./../models/Product";
import { DB_TYPE, MyDaoFactory } from "./../daos/MyDaoFactory";
import { ProductDaoFs } from "../daos/products/ProductDaoFs";
import { ProductDaoMongo } from "./../daos/products/ProductDaoMongo";

export class ProductService {
  private static instance: ProductService;
  private productDao: ProductDaoMongo | ProductDaoFs;

  constructor() {
    const persistance = (process.env.PERSISTANCE as DB_TYPE) || DB_TYPE.MONGO;
    this.productDao = MyDaoFactory.getInstance().createProductDao(persistance);
  }

  static getInstance() {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getProductById(id: string) {
    return await this.productDao.getById(id);
  }

  async getAllProducts() {
    return await this.productDao.getAll();
  }

  async create(newProduct: Product) {
    return await this.productDao.addItem(newProduct);
  }

  async update(id: string, newProduct: Product) {
    return await this.productDao.updateItemById(id, newProduct);
  }

  async delete(id: string) {
    return await this.productDao.deleteItemById(id);
  }
}
