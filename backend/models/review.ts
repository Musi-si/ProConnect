import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ReviewAttributes {
  id?: number;
  reviewerId: number; // FK to User
  revieweeId: number; // FK to User
  projectId: number;  // FK to Project
  rating: number;
  comment: string;
  createdAt?: Date;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, 'id' | 'createdAt'>;

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public reviewerId!: number;
  public revieweeId!: number;
  public projectId!: number;
  public rating!: number;
  public comment!: string;
  public readonly createdAt!: Date;
}

function initReview(sequelize: Sequelize) {
  Review.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      reviewerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      revieweeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'reviews',
      timestamps: false, // Only createdAt, no updatedAt
    }
  );
}

export { Review, initReview };