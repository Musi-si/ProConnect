import { Schema, model, Document } from 'mongoose';

interface Milestone extends Document {
  projectId: string;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const milestoneSchema = new Schema<Milestone>({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MilestoneModel = model<Milestone>('Milestone', milestoneSchema);

export default MilestoneModel;