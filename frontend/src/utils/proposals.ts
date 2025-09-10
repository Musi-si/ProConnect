import { api } from './api';
import { Proposal } from '../types';

// Fetch all proposals for a specific project
export const getProposals = async (projectId: string): Promise<{ proposals: Proposal[] }> => {
  try {
    const res = await api.get(`/projects/${projectId}/proposals/all`);
    return { proposals: res.data }; // wrap in object to match react-query usage
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch proposals');
  }
};

// Submit a proposal for a specific project
export const submitProposal = async (projectId: string, proposal: Partial<Proposal>): Promise<Proposal> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const res = await api.post(`/projects/${projectId}/proposals/add`, proposal, {
      Authorization: `Bearer ${token}`,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit proposal');
  }
};

// Accept a proposal (only for clients)
export const acceptProposal = async (projectId: string, proposalId: string): Promise<Proposal> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const res = await api.put(`/projects/${projectId}/proposals/${proposalId}/accept`, {
      Authorization: `Bearer ${token}`,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to accept proposal');
  }
};

// Delete a proposal
export const deleteProposal = async (projectId: string, proposalId: string): Promise<{ message: string }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const res = await api.delete(`/projects/${projectId}/proposals/${proposalId}`, {
      Authorization: `Bearer ${token}`,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete proposal');
  }
};
