const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Price at time of purchase',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'price * quantity',
    },
    productSnapshot: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Snapshot of product data at time of order',
    },
    customizationData: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Customer customization details',
    },
    designFileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL to the custom design file',
    },
    designApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    designApprovedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'order_items',
  }
)

module.exports = OrderItem
