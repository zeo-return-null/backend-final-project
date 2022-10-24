import { Product } from "./Product";
import mongoose from "mongoose";

const ORDERS_COLLECTION = "orders";

export interface Order {
  items: Product[];
  orderId?: number;
  creationTime?: string;
  status?: OrderStatus;
  userEmail: string;
}

export enum OrderStatus {
  GENERATED = "generada",
  PAID = "pagado",
}

const OrderSchema = new mongoose.Schema({
  items: {
    type: [
      {
        id: { type: String },
        timestamp: { type: String },
        nombre: { type: String },
        description: { type: String },
        codigo: { type: String },
        foto: { type: String },
        precio: { type: Number },
        stock: { type: Number },
        quantity: { type: Number },
      },
    ],
  },
  orderId: { type: String },
  creationTime: { type: String },
  status: { type: String, enum: OrderStatus },
  userEmail: { type: String },
});

export default mongoose.model(ORDERS_COLLECTION, OrderSchema);
