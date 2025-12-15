const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'processing',
        'succeeded',
        'failed',
        'cancelled',
        'refunded'
      ),
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentGateway: {
      type: DataTypes.ENUM('stripe', 'paypal', 'other'),
      defaultValue: 'stripe',
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Payment gateway transaction ID',
    },
    gatewayResponse: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Full response from payment gateway',
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'payments',
  }
)

module.exports = Payment
