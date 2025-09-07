import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/db';

interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  role?: 'freelancer' | 'client';
  location?: string;
  totalEarnings?: string;
  totalSpent?: string;
  rating?: string;
  reviewCount?: number;
  isEmailVerified?: boolean;
  emailVerificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  stripeCustomerId?: string | null;
  skills?: string[];
  portfolioLinks?: string[];
  profilePicture?: string; // new field
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'bio'
  | 'role'
  | 'location'
  | 'totalEarnings'
  | 'totalSpent'
  | 'rating'
  | 'reviewCount'
  | 'isEmailVerified'
  | 'emailVerificationToken'
  | 'resetPasswordToken'
  | 'resetPasswordExpires'
  | 'stripeCustomerId'
  | 'skills'
  | 'portfolioLinks'
  | 'profilePicture' // allow optional on creation
  | 'createdAt'
  | 'updatedAt'
>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare firstName?: string;
  declare lastName?: string;
  declare bio?: string;
  declare role?: 'freelancer' | 'client';
  declare location?: string;
  declare totalEarnings?: string;
  declare totalSpent?: string;
  declare rating?: string;
  declare reviewCount?: number;
  declare isEmailVerified?: boolean;
  declare emailVerificationToken?: string | null;
  declare resetPasswordToken?: string | null;
  declare resetPasswordExpires?: Date | null;
  declare stripeCustomerId?: string | null;
  declare skills?: string[];
  declare portfolioLinks?: string[];
  declare profilePicture?: string; // new field
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

function initUser(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      bio: DataTypes.TEXT,
      role: {
        type: DataTypes.ENUM('freelancer', 'client'),
        defaultValue: 'freelancer',
        allowNull: false,
      },
      location: DataTypes.STRING,
      totalEarnings: {
        type: DataTypes.STRING,
        defaultValue: '0',
      },
      totalSpent: {
        type: DataTypes.STRING,
        defaultValue: '0',
      },
      rating: {
        type: DataTypes.STRING,
        defaultValue: '0',
      },
      reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      emailVerificationToken: DataTypes.STRING,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
      stripeCustomerId: DataTypes.STRING,
      skills: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
      },
      portfolioLinks: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true, // optional
        defaultValue: null,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
    }
  );
}

export { User, initUser };
