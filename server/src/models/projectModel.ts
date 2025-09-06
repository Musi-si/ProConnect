import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientId: { type: String, required: true },
  freelancerId: { type: String, default: null },
  budget: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  category: { type: String },
  timeline: { type: String },
  coverImage: { type: String },
  clientName: { type: String },
  clientAvatar: { type: String },
  clientRating: { type: String },
  clientReviewCount: { type: Number },
  skills: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  attachments: { type: [String], default: [] },
  acceptedProposalId: { type: String, default: null },
  milestones: [{ type: Schema.Types.ObjectId, ref: 'Milestone' }]
});

const Project = model('Project', projectSchema);

export default Project;