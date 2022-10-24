import mongoose from "mongoose";

const CARTS_COLLECTION = "carts";

export interface Cart {
  id?: string;
  timestamp?: string;
  productos: ProductInCart[];
}

export interface ProductInCart {
  productId: string;
  quantity: number;
}

const CartSchema = new mongoose.Schema({
  timestamp: {
    type: String,
    required: true,
  },
  productos: {
    type: [
      {
        productId: { type: String },
        quantity: { type: Number },
      },
    ],
  },
});

export default mongoose.model(CARTS_COLLECTION, CartSchema);
