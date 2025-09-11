import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Project } from './project';
import { User } from './user';

interface MilestoneAttributes {
  title: string;
  description: string;
  dueDate: Date | string; // accept string from frontend too
  isCompleted?: boolean;   // optional, default false
}

interface ProposalAttributes {
  id?: number;
  freelancerId: number; // FK to User
  projectId: number;    // FK to Project
  budget: number;
  description: string;
  milestones: MilestoneAttributes[];
  portfolioSamples: string[];
  proposedTimeline?: string;  // Add timeline field
  questions?: string | null;   // Add questions field
  status?: 'pending' | 'accepted' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

type ProposalCreationAttributes = Optional<
  ProposalAttributes,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'proposedTimeline' | 'questions'
>;

class Proposal
  extends Model<ProposalAttributes, ProposalCreationAttributes>
  implements ProposalAttributes
{
  declare id: number;
  declare freelancerId: number;
  declare projectId: number;
  declare budget: number;
  declare description: string;
  declare milestones: MilestoneAttributes[];
  declare portfolioSamples: string[];
  declare proposedTimeline?: string;
  declare questions?: string | null;
  declare status: 'pending' | 'accepted' | 'rejected';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associations
  public static associate() {
    Proposal.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
    Proposal.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });
  }
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
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
      },
      portfolioSamples: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
      },
      proposedTimeline: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      questions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
        allowNull: false,
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
      updatedAt: 'updatedAt',
      createdAt: 'createdAt',
    }
  );
}

export { Proposal, initProposal };
