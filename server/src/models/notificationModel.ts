import { Schema, model, Document } from 'mongoose';

interface Notification extends Document {
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<Notification>({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const NotificationModel = model<Notification>('Notification', notificationSchema);

export default NotificationModel;