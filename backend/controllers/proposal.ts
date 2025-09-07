import { Request, Response } from 'express';
import { Proposal } from '../models/proposal';

export class ProposalsController {
  // Get proposal by ID
  async getProposal(req: Request, res: Response) {
    try {
      const proposal = await Proposal.findByPk(req.params.id);
      if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
      res.json(proposal);
    } catch (error) {
      console.error('Get proposal error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Get proposals by project
  async getProposalsByProject(req: Request, res: Response) {
    try {
      const proposals = await Proposal.findAll({ where: { projectId: req.params.projectId } });
      res.json(proposals);
    } catch (error) {
      console.error('Get proposals by project error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Get proposals by freelancer
  async getProposalsByFreelancer(req: Request, res: Response) {
    try {
      const proposals = await Proposal.findAll({ where: { freelancerId: req.params.freelancerId } });
      res.json(proposals);
    } catch (error) {
      console.error('Get proposals by freelancer error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // Create a proposal
  async createProposal(req: Request, res: Response) {
    try {
      const proposal = await Proposal.create(req.body);
      res.status(201).json(proposal);
    } catch (error) {
      console.error('Create proposal error:', error);
      res.status(400).json({ message: 'Error creating proposal', error });
    }
  }

  // Update a proposal
  async updateProposal(req: Request, res: Response) {
    try {
      const proposal = await Proposal.findByPk(req.params.id);
      if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

      await proposal.update(req.body);
      res.json(proposal);
    } catch (error) {
      console.error('Update proposal error:', error);
      res.status(400).json({ message: 'Error updating proposal', error });
    }
  }

  // Delete a proposal
  async deleteProposal(req: Request, res: Response) {
    try {
      const proposal = await Proposal.findByPk(req.params.id);
      if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

      await proposal.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Delete proposal error:', error);
      res.status(500).json({ message: 'Error deleting proposal', error });
    }
  }
}
