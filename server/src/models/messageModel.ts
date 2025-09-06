import { Schema, model, Document } from 'mongoose';

interface Message extends Document {
  projectId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<Message>({
  projectId: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const MessageModel = model<Message>('Message', messageSchema);

export default MessageModel;