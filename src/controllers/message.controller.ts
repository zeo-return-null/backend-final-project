import { RequestHandler } from "express";
import { errorLogger } from "../log/logger";
import { GenericException } from "../models/GenericException";
import { Message } from "../models/Message";
import { MessageService } from "../services/message.service";

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = MessageService.getInstance();
  }

  public getMessageById: RequestHandler = async (req, res) => {
    const email = req.params.email;
    try {
      let response;
      const allMessages = await this.messageService.getAllMessages();
      if (email) {
        response = allMessages?.filter((m) => m.email === email);
      } else {
        response = allMessages;
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

  public createMessage: RequestHandler = async (req, res) => {
    const newMessage = req.body as Message;
    try {
      const response = await this.messageService.create(newMessage);
      res.status(201).send(response);
    } catch (error) {
      errorLogger.error(`Error: ${error}`);
      throw new GenericException({
        status: 500,
        message: "Error interno de servidor.",
      });
    }
  };

  public updateMessage: RequestHandler = async (req, res) => {
    const id = req.params.id;
    const newMessage = req.body;
    try {
      const message = this.messageService.getMessageById(id);
      if (!message) {
        throw new GenericException({
          status: 404,
          message: "Mensaje no encontrado.",
        });
      } else {
        const response = await this.messageService.update(id, newMessage);
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

  public deleteMessage: RequestHandler = async (req, res) => {
    const id = req.params.id;
    try {
      await this.messageService.delete(id);
      res.status(200).send({
        message: `Mensaje con id ${id} eliminado con éxito!`,
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
