import { Product } from "./../models/Product";
import { GenericException } from "./../models/GenericException";
import { RequestHandler } from "express";
import { ProductService } from "../services/product.service";
import { errorLogger } from "../log/logger";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = ProductService.getInstance();
  }

  public getProductById: RequestHandler = async (req, res) => {
    const id = req.params.id;
    try {
      let response;
      if (id) {
        response = await this.productService.getProductById(id);
        if (!response) {
          throw new GenericException({
            status: 404,
            message: "Producto no encontrado.",
          });
        }
      } else {
        response = await this.productService.getAllProducts();
      }
      res.status(200).send(response);
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public createProduct: RequestHandler = async (req, res) => {
    const newProduct = req.body as Product;
    try {
      const response = await this.productService.create(newProduct);
      res.status(201).send(response);
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public updateProduct: RequestHandler = async (req, res) => {
    const id = req.params.id;
    const newProduct = req.body;
    try {
      const product = this.productService.getProductById(id);
      if (!product) {
        throw new GenericException({
          status: 404,
          message: "Producto no encontrado.",
        });
      } else {
        const response = await this.productService.update(id, newProduct);
        res.status(200).send(response);
      }
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public deleteProduct: RequestHandler = async (req, res) => {
    const id = req.params.id;
    try {
      await this.productService.delete(id);
      res.status(200).send({
        message: `Product con id ${id} eliminado con éxito!`,
      });
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };
}
