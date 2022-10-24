import CartS, { Cart, ProductInCart } from "../../models/Cart";
import { MongoContainer } from "../../containers/MongoContainer";

export class CartDaoMongo extends MongoContainer {
  private static instance: CartDaoMongo;
  private cartManager = new MongoContainer(this.collectionModel);

  constructor() {
    super(CartS);
  }

  static getInstance() {
    if (!CartDaoMongo.instance) {
      CartDaoMongo.instance = new CartDaoMongo();
    }
    return CartDaoMongo.instance;
  }

  async getAll() {
    const docs = await this.cartManager.getAll();
    return docs;
  }

  async getById(id: string) {
    const doc = await this.cartManager.getById(id);
    return doc;
  }

  async addItem(item: Cart) {
    const newCart: Cart = {
      ...item,
      timestamp: new Date().toISOString(),
    };
    return await this.cartManager.addItem(newCart);
  }

  async addItemsByCartId(id: string, items: ProductInCart[]) {
    const newCart: any = await this.getById(id);
    if (newCart) {
      const newProducts = newCart.productos.concat(items);
      newCart.productos = newProducts;
      const response = await this.updateItemById(id, newCart);
      return response._doc;
    }
    return undefined;
  }

  async updateItemById(id: string, item: Cart) {
    return await this.cartManager.updateItemById(id, item);
  }

  async deleteItemById(id: string) {
    return await this.cartManager.deleteItemById(id);
  }

  async deleteItemInCart(cartId: string, productId: string) {
    const newCart: any = await this.getById(cartId);
    if (newCart) {
      newCart.productos = newCart.productos.filter(
        (p: ProductInCart) => p.productId !== productId
      );
    }
    await this.updateItemById(cartId, newCart);
  }
}
