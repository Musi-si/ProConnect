import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { User } from './user';

interface MessageAttributes {
  id?: number;
  projectId: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type MessageCreationAttributes = Optional<MessageAttributes, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>;

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public projectId!: number;
  public senderId!: number;
  public receiverId!: number;
  public content!: string;
  public isRead?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initMessage(sequelize: Sequelize) {
  Message.init(
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
      senderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'messages',
      timestamps: true,
      paranoid: false,
    }
  );

  // Associations
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
  Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
  // Message.belongsTo(Project, { foreignKey: 'projectId', as: 'project' }); // if Project model exists
}

export { Message };
