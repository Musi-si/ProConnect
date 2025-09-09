// src/utils/proposals.ts
import { api } from './api';
import { Proposal } from '../types';

// Fetch all proposals for a specific project
export const getProposals = async (projectId: string): Promise<{ proposals: Proposal[] }> => {
  try {
    const res = await api.get(`/projects/${projectId}/proposals`);
    return { proposals: res.data }; // wrap in object to match react-query usage
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch proposals');
  }
};

// Submit a proposal for a specific project
export const submitProposal = async (projectId: string, proposal: Partial<Proposal>): Promise<Proposal> => {
  try {
    const res = await api.post(`/projects/${projectId}/proposals`, proposal);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit proposal');
  }
};

// Accept a proposal (only for clients)
export const acceptProposal = async (proposalId: string): Promise<Proposal> => {
  try {
    const res = await api.put(`/proposals/${proposalId}/accept`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to accept proposal');
  }
};
