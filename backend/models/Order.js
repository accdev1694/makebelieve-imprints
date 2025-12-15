const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'processing',
        'awaiting_design_approval',
        'design_approved',
        'in_production',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
      ),
      defaultValue: 'pending',
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    paymentStatus: {
      type: DataTypes.ENUM(
        'pending',
        'paid',
        'failed',
        'refunded',
        'partially_refunded'
      ),
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'JSON object with address details',
    },
    billingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'JSON object with address details',
    },
    shippingMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trackingUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'orders',
  }
)

module.exports = Order
