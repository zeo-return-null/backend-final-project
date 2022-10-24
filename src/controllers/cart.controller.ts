import { GenericException } from "./../models/GenericException";
import { RequestHandler } from "express";
import { CartService } from "../services/cart.service";
import { errorLogger } from "../log/logger";
import { Product } from "../models/Product";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = CartService.getInstance();
  }

  public getAllProductsByCartId: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    try {
      const products = await this.cartService.getAllProductsByCartId(id);
      res.status(200).send(products);
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public createNewCart: RequestHandler = async (req, res) => {
    const products: Product[] = req.body.products;
    try {
      const newCartId = await this.cartService.createNewCart(products);
      res.status(201).send({
        newCartId,
      });
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public addProductsToCart: RequestHandler = async (req, res) => {
    const products: Product[] = req.body.products;
    const cartId = req.params.id;
    try {
      const response = await this.cartService.addProductsToCart(
        cartId,
        products
      );
      res.status(201).send(response);
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public deleteCart: RequestHandler = async (req, res) => {
    const id = req.params.id;
    try {
      await this.cartService.deleteCart(id);
      res.status(200).send({
        message: `Producto con id ${id} eliminado con éxito!`,
      });
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public deleteProductInCart: RequestHandler = async (req, res) => {
    const cartId = req.params.id;
    const productId = req.params.id_prod;
    try {
      await this.cartService.deleteProductInCart(cartId, productId);
      res.status(200).send({
        message: `Producto con id ${productId} en carrito id ${cartId} eliminado con éxito!`,
      });
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public createOrder: RequestHandler = async (req, res) => {
    const products: Product[] = req.body.products;
    const { name, username, phone } = req.body;
    const cartId: string = req.params.id;

    try {
      await this.cartService.createOrder(
        cartId,
        products,
        name,
        username,
        phone
      );
      res.json({ ok: true, message: "Order created!" });
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };
}
