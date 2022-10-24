import mongoose from "mongoose";

const MESSAGES_COLLECTION = "messages";

export interface Message {
  email: string;
  type: MessageType;
  creationTime?: string;
  body: string;
}

export enum MessageType {
  USER = "usuario", // preguntas
  SYSYEM = "sistema", // respuestas
}

const MessageSchema = new mongoose.Schema({
  email: { type: String },
  type: { type: String, enum: MessageType },
  creationTime: { type: String },
  body: { type: String },
});

export default mongoose.model(MESSAGES_COLLECTION, MessageSchema);
