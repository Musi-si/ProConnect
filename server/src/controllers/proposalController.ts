import { Request, Response } from 'express';
import Proposal from '../models/proposalModel';

export class ProposalController {
  // Get a proposal by ID
  async getProposal(req: Request, res: Response) {
    try {
      const proposal = await Proposal.findById(req.params.id);
      if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Create a new proposal
  async createProposal(req: Request, res: Response) {
    try {
      const proposal = new Proposal(req.body);
      await proposal.save();
      res.status(201).json(proposal);
    } catch (error) {
      res.status(400).json({ message: 'Error creating proposal', error });
    }
  }

  // Update a proposal
  async updateProposal(req: Request, res: Response) {
    try {
      const proposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
      res.json(proposal);
    } catch (error) {
      res.status(400).json({ message: 'Error updating proposal', error });
    }
  }

  // Delete a proposal
  async deleteProposal(req: Request, res: Response) {
    try {
      const proposal = await Proposal.findByIdAndDelete(req.params.id);
      if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting proposal', error });
    }
  }
}