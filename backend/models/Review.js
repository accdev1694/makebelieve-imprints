const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of review image URLs',
    },
    isVerifiedPurchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: 'reviews',
  }
)

module.exports = Review
