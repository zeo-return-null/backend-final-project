import { Product } from "./../../models/Product";
import { FsContainer } from "../../containers/FsContainer";

export class ProductDaoFs extends FsContainer {
  private static instance: ProductDaoFs;
  private productManager = new FsContainer(this.path);

  constructor() {
    super("src/datas/products.txt");
  }

  static getInstance() {
    if (!ProductDaoFs.instance) {
      ProductDaoFs.instance = new ProductDaoFs();
    }
    return ProductDaoFs.instance;
  }

  async getAll() {
    return await this.productManager.getAll();
  }

  async getById(id: string) {
    return await this.productManager.getById(id);
  }

  async addItem(item: Product) {
    return await this.productManager.addItem(item);
  }

  async updateItemById(id: string, item: Product) {
    return await this.productManager.updateItemById(id, item);
  }

  async deleteItemById(id: string) {
    await this.productManager.deleteItemById(id);
  }

  async disconnect() {
    return;
  }
}
