import { Request, Response } from "express";
import { Proposal } from "../models/proposal";
import { Project } from "../models/project";

export class ProposalsController {
  // Get a single proposal (with project info)
  async getProposal(req: Request, res: Response) {
    try {
      const { projectId, proposalId } = req.params;
      const proposal = await Proposal.findOne({
        where: { id: proposalId, projectId },
        include: [{ model: Project, as: 'project' }],
      });
      if (!proposal) return res.status(404).json({ message: "Proposal not found" });
      res.json(proposal);
    } catch (error) {
      console.error("Get proposal error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get all proposals for a project
  async getProposalsByProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const proposals = await Proposal.findAll({
        where: { projectId },
        order: [["createdAt", "DESC"]],
      });
      res.json(proposals);
    } catch (error) {
      console.error("Get proposals by project error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Create proposal
  async createProposal(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const proposal = await Proposal.create({ ...req.body, projectId: Number(projectId) });
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Create proposal error:", error);
      res.status(400).json({ message: "Error creating proposal", error });
    }
  }

  // Update proposal
  async updateProposal(req: Request, res: Response) {
    try {
      const { projectId, proposalId } = req.params;
      const proposal = await Proposal.findOne({ where: { id: proposalId, projectId } });
      if (!proposal) return res.status(404).json({ message: "Proposal not found" });

      await proposal.update(req.body);
      res.json(proposal);
    } catch (error) {
      console.error("Update proposal error:", error);
      res.status(400).json({ message: "Error updating proposal", error });
    }
  }

  // Delete proposal
  async deleteProposal(req: Request, res: Response) {
    try {
      const { projectId, proposalId } = req.params;
      const proposal = await Proposal.findOne({ where: { id: proposalId, projectId } });
      if (!proposal) return res.status(404).json({ message: "Proposal not found" });

      await proposal.destroy();
      res.status(204).json({ message: 'Proposal deleted successfully' });
    } catch (error) {
      console.error("Delete proposal error:", error);
      res.status(500).json({ message: "Error deleting proposal", error });
    }
  }

  // Accept proposal (client only)
  async acceptProposal(req: Request, res: Response) {
    try {
      const { projectId, proposalId } = req.params;
      const proposal = await Proposal.findOne({ where: { id: proposalId, projectId } });
      if (!proposal) return res.status(404).json({ message: "Proposal not found" });

      proposal.status = "accepted";
      await proposal.save();

      // Optionally, mark project as in_progress and set freelancerId
      await Project.update(
        { status: 'in_progress', freelancerId: proposal.freelancerId, acceptedProposalId: proposal.id },
        { where: { id: projectId } }
      );

      res.json(proposal);
    } catch (error) {
      console.error("Accept proposal error:", error);
      res.status(400).json({ message: "Error accepting proposal", error });
    }
  }
}
