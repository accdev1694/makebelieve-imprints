const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Design = sequelize.define(
  'Design',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    designData: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Canvas.js or Fabric.js design data',
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Preview/thumbnail image URL',
    },
    printReadyFile: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'High-res print-ready file URL',
    },
    status: {
      type: DataTypes.ENUM(
        'draft',
        'pending_review',
        'approved',
        'rejected',
        'archived'
      ),
      defaultValue: 'draft',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether design can be viewed by others',
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether design is available as a template',
    },
    reviewNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Admin review feedback',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of tags for searching',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional design metadata (dimensions, colors, etc.)',
    },
  },
  {
    timestamps: true,
    tableName: 'designs',
  }
)

module.exports = Design
