import { Schema, model, Document } from 'mongoose';

interface Milestone {
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
}

interface Proposal extends Document {
  freelancerId: string;
  projectId: string;
  budget: number;
  description: string;
  milestones: Milestone[];
  coverLetter?: string;
  proposedBudget?: number;
  proposedTimeline?: string;
  status?: string;
  portfolioSamples?: string[];
  questions?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const milestoneSchema = new Schema<Milestone>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
});

const proposalSchema = new Schema<Proposal>({
  freelancerId: { type: String, required: true },
  projectId: { type: String, required: true },
  budget: { type: Number, required: true },
  description: { type: String, required: true },
  milestones: { type: [milestoneSchema], default: [] },
  coverLetter: { type: String },
  proposedBudget: { type: Number },
  proposedTimeline: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  portfolioSamples: { type: [String], default: [] },
  questions: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ProposalModel = model<Proposal>('Proposal', proposalSchema);

export default ProposalModel;