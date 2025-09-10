import React, { createContext, useContext, useState } from "react";
import {
  getProposals,
  submitProposal,
  acceptProposal,
  deleteProposal,
} from "../utils/proposals";
import { Proposal } from "../types";

type ProposalContextType = {
  proposals: Proposal[];
  isLoading: boolean;
  error: string | null;
  fetchProposals: (projectId: string) => Promise<void>;
  submitProposal: (projectId: string, proposal: Partial<Proposal>) => Promise<void>;
  acceptProposal: (projectId: string, proposalId: string) => Promise<void>;
  deleteProposal: (projectId: string, proposalId: string) => Promise<void>;
};

const ProposalContext = createContext<ProposalContextType | null>(null);

export const useProposal = () => {
  const context = useContext(ProposalContext);
  if (!context) throw new Error("useProposal must be used within ProposalProvider");
  return context;
};

export const ProposalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = async (projectId: string) => {
    setIsLoading(true);
    try {
      const data = await getProposals(projectId);
      setProposals(
        data.proposals.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch proposals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitProposal = async (projectId: string, proposal: Partial<Proposal>) => {
    setIsLoading(true);
    try {
      const newProposal = await submitProposal(projectId, proposal);
      setProposals((prev) => [...prev, newProposal]);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to submit proposal");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptProposal = async (projectId: string, proposalId: string) => {
    setIsLoading(true);
    try {
      const updated = await acceptProposal(projectId, proposalId);
      setProposals((prev) =>
        prev.map((p) => (p._id === proposalId ? updated : p))
      );
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to accept proposal");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProposal = async (projectId: string, proposalId: string) => {
    setIsLoading(true);
    try {
      await deleteProposal(projectId, proposalId);
      setProposals((prev) => prev.filter((p) => p._id !== proposalId));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete proposal");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProposalContext.Provider
      value={{
        proposals,
        isLoading,
        error,
        fetchProposals,
        submitProposal: handleSubmitProposal,
        acceptProposal: handleAcceptProposal,
        deleteProposal: handleDeleteProposal,
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
};
