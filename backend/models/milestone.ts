import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface MilestoneAttributes {
  id?: number;
  projectId: number; // FK to Project
  title: string;
  description: string;
  dueDate: Date;
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type MilestoneCreationAttributes = Optional<MilestoneAttributes, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>;

class Milestone extends Model<MilestoneAttributes, MilestoneCreationAttributes> implements MilestoneAttributes {
  public id!: number;
  public projectId!: number;
  public title!: string;
  public description!: string;
  public dueDate!: Date;
  public isCompleted?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

function initMilestone(sequelize: Sequelize) {
  Milestone.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: 'milestones',
      timestamps: true,
    }
  );
}

export { Milestone, initMilestone };