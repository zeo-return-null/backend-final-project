import "dotenv/config";
import { GenericException } from "./../models/GenericException";
import { ProductDaoFs } from "./../daos/products/ProductDaoFs";
import { ProductDaoMongo } from "./../daos/products/ProductDaoMongo";
import { Cart, ProductInCart } from "./../models/Cart";
import { CartDaoFs } from "../daos/carritos/CartDaoFs";
import { CartDaoMongo } from "../daos/carritos/CartDaoMongo";
import { DB_TYPE, MyDaoFactory } from "../daos/MyDaoFactory";
import { Product } from "../models/Product";
import { createTransport } from "nodemailer";
import { ProductService } from "./product.service";
import { OrderService } from "./order.service";

// NODEMAILER
const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.NODEMAILER_TEST_MAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

export class CartService {
  private static instance: CartService;
  private cartDao: CartDaoMongo | CartDaoFs;
  private productService: ProductService;
  private orderService: OrderService;

  constructor() {
    const persistance = (process.env.PERSISTANCE as DB_TYPE) || DB_TYPE.MONGO;
    this.cartDao = MyDaoFactory.getInstance().createCartDao(persistance);
    this.productService = ProductService.getInstance();
    this.orderService = OrderService.getInstance();
  }

  static getInstance() {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  async getAllProductsByCartId(id: string) {
    const cart: any = await this.cartDao.getById(id);
    const products: any[] = await this.productService.getAllProducts();

    if (!cart) {
      throw new GenericException({
        status: 404,
        message: `Carrito con id ${id} no encontrado.`,
      });
    }

    const productList: any[] = [];
    cart.productos.forEach((p: ProductInCart) => {
      const productToAdd = products.find((x) => x.id === p.productId);
      if (productToAdd) {
        productList.push({ ...productToAdd._doc, quantity: p.quantity });
      }
    });

    return {
      id: cart._id ? cart._id : cart.id,
      timestamp: cart.timestamp,
      productos: productList,
    };
  }

  async createNewCart(products: Product[]) {
    const newCart: Cart = {
      productos:
        products.length !== 0
          ? products.map((p) => {
              return {
                productId: p.id!,
                quantity: p.quantity!,
              };
            })
          : [],
    };
    const response = await this.cartDao.addItem(newCart);

    return response.id;
  }

  async addProductsToCart(cartId: string, products: Product[]) {
    const productIds: ProductInCart[] = [];
    products.forEach((p: Product) => {
      if (p.id) {
        productIds.push({
          productId: p.id,
          quantity: p.quantity!,
        });
      }
    });
    const response = await this.cartDao.addItemsByCartId(cartId, productIds);
    if (!response) {
      throw new GenericException({
        status: 404,
        message: `Id de carrito ${cartId} no encontrado.`,
      });
    }
    return response;
  }

  async deleteCart(id: string) {
    await this.cartDao.deleteItemById(id);
  }

  async deleteProductInCart(cartId: string, productId: string) {
    await this.cartDao.deleteItemInCart(cartId, productId);
  }

  async createOrder(
    cartId: string,
    products: Product[],
    name: string,
    username: string,
    phone: string
  ) {
    await this.orderService.create({
      items: products,
      userEmail: username,
    });

    let html = `
                <div class="card" style="width: 18rem;">
                    <p>Username: ${username}</p>
                    <p>Nombre: ${name}</p>
              `;
    products.forEach((p) => {
      html += `
                    <p>- ${p.nombre} ${p.precio} x ${p.quantity!}</p>
                `;
    });
    html += `</div>`;

    const mailOptions = {
      from: "Servidor NodeJS",
      to: username,
      subject: `Nuevo pedido de ${name} - ${username}`,
      html: html,
    };

    // Mail to admin
    await transporter.sendMail(mailOptions);
  }
}
