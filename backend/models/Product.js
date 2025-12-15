const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Product = sequelize.define(
  'Product',
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    compareAtPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Original price for showing discounts',
    },
    costPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Cost to produce/acquire the product',
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Weight in grams',
    },
    dimensions: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'JSON object with length, width, height in cm',
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of image URLs',
    },
    isCustomizable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether product can be customized by customers',
    },
    customizationOptions: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'JSON object with customization settings',
    },
    productType: {
      type: DataTypes.ENUM('physical', 'digital', 'customizable'),
      defaultValue: 'physical',
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of tags for searching',
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    salesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: 'products',
  }
)

module.exports = Product
