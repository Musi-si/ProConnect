import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface MilestoneAttributes {
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
}

interface ProposalAttributes {
  id?: number;
  freelancerId: number; // FK to User
  projectId: number;    // FK to Project
  budget: number;
  description: string;
  milestones?: MilestoneAttributes[];
  coverLetter?: string;
  proposedBudget?: number;
  proposedTimeline?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  portfolioSamples?: string[];
  questions?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProposalCreationAttributes = Optional<ProposalAttributes, 'id' | 'milestones' | 'coverLetter' | 'proposedBudget' | 'proposedTimeline' | 'status' | 'portfolioSamples' | 'questions' | 'createdAt' | 'updatedAt'>;

class Proposal extends Model<ProposalAttributes, ProposalCreationAttributes> implements ProposalAttributes {
  public id!: number;
  public freelancerId!: number;
  public projectId!: number;
  public budget!: number;
  public description!: string;
  public milestones?: MilestoneAttributes[];
  public coverLetter?: string;
  public proposedBudget?: number;
  public proposedTimeline?: string;
  public status?: 'pending' | 'accepted' | 'rejected';
  public portfolioSamples?: string[];
  public questions?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

function initProposal(sequelize: Sequelize) {
  Proposal.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      freelancerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      budget: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      milestones: {
        type: DataTypes.JSON, // Array of milestone objects
        defaultValue: [],
        allowNull: false,
      },
      coverLetter: DataTypes.TEXT,
      proposedBudget: DataTypes.FLOAT,
      proposedTimeline: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
      },
      portfolioSamples: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: [],
        allowNull: false,
      },
      questions: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'proposals',
      timestamps: true,
    }
  );
}

export { Proposal, initProposal };