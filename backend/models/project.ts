import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Proposal } from './proposal';
import { User } from './user'; // Assuming you have a User model

interface ProjectAttributes {
  id?: number;
  title: string;
  description: string;
  clientId: number;
  freelancerId?: number | null;
  budget: string;
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
  category?: string;
  timeline?: string;
  coverImage?: string;
  clientName?: string;
  clientAvatar?: string;
  clientRating?: string;
  clientReviewCount?: number;
  skills?: string[];
  attachments?: string[];
  acceptedProposalId?: number | null;
  milestones?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

type ProjectCreationAttributes = Optional<
  ProjectAttributes,
  | 'id'
  | 'freelancerId'
  | 'status'
  | 'category'
  | 'timeline'
  | 'coverImage'
  | 'clientName'
  | 'clientAvatar'
  | 'clientRating'
  | 'clientReviewCount'
  | 'skills'
  | 'attachments'
  | 'acceptedProposalId'
  | 'milestones'
  | 'createdAt'
  | 'updatedAt'
>;

// class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
//   public id!: number;
//   public title!: string;
//   public description!: string;
//   public clientId!: number;
//   public freelancerId?: number | null;
//   public budget!: string;
//   public status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
//   public category?: string;
//   public timeline?: string;
//   public coverImage?: string;
//   public clientName?: string;
//   public clientAvatar?: string;
//   public clientRating?: string;
//   public clientReviewCount?: number;
//   public skills?: string[];
//   public attachments?: string[];
//   public acceptedProposalId?: number | null;
//   public milestones?: any[];
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;

//   // Associations
//   public static associate() {
//     Project.hasMany(Proposal, { foreignKey: 'projectId', as: 'proposals' });
//   }
// }

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> {
  // Associations
  public static associate() {
    Project.hasMany(Proposal, { foreignKey: 'projectId', as: 'proposals' });
  }
}

function initProject(sequelize: Sequelize) {
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      clientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      freelancerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, defaultValue: null },
      budget: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.ENUM('open','in_progress','completed','cancelled'), defaultValue: 'open' },
      category: DataTypes.STRING,
      timeline: DataTypes.STRING,
      coverImage: DataTypes.STRING,
      clientName: DataTypes.STRING,
      clientAvatar: DataTypes.STRING,
      clientRating: DataTypes.STRING,
      clientReviewCount: DataTypes.INTEGER,
      skills: { type: DataTypes.JSON, defaultValue: [], allowNull: false },
      attachments: { type: DataTypes.JSON, defaultValue: [], allowNull: false },
      acceptedProposalId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, defaultValue: null },
      milestones: { type: DataTypes.JSON, defaultValue: [], allowNull: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'projects', timestamps: true }
  );
}

export { Project, initProject };
