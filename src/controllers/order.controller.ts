import { RequestHandler } from "express";
import { errorLogger } from "../log/logger";
import { GenericException } from "../models/GenericException";
import { Order } from "../models/Order";
import { OrderService } from "../services/order.service";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = OrderService.getInstance();
  }

  public getOrderById: RequestHandler = async (req, res) => {
    const id = req.params.id;
    try {
      let response;
      if (id) {
        response = await this.orderService.getOrderById(id);
        if (!response) {
          throw new GenericException({
            status: 404,
            message: "Orden no encontrado.",
          });
        }
      } else {
        response = await this.orderService.getAllOrders();
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

  public createOrder: RequestHandler = async (req, res) => {
    const newOrder = req.body as Order;
    try {
      const response = await this.orderService.create(newOrder);
      res.status(201).send(response);
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public updateOrder: RequestHandler = async (req, res) => {
    const id = req.params.id;
    const newOrder = req.body;
    try {
      const order = this.orderService.getOrderById(id);
      if (!order) {
        throw new GenericException({
          status: 404,
          message: "Ordero no encontrado.",
        });
      } else {
        const response = await this.orderService.update(id, newOrder);
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

  public deleteOrder: RequestHandler = async (req, res) => {
    const id = req.params.id;
    try {
      await this.orderService.delete(id);
      res.status(200).send({
        message: `Orden con id ${id} eliminado con éxito!`,
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
