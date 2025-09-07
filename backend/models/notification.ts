import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface NotificationAttributes {
  id?: number;
  userId: number; // FK to User
  type: string;
  message: string;
  isRead?: boolean;
  createdAt?: Date;
}

type NotificationCreationAttributes = Optional<NotificationAttributes, 'id' | 'isRead' | 'createdAt'>;

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public type!: string;
  public message!: string;
  public isRead?: boolean;
  public readonly createdAt!: Date;
}

function initNotification(sequelize: Sequelize) {
  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'notifications',
      timestamps: false, // Only createdAt, no updatedAt
    }
  );
}

export { Notification, initNotification };