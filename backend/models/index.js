const sequelize = require('../config/database')

// Import models
const User = require('./User')
const Product = require('./Product')
const Category = require('./Category')
const Order = require('./Order')
const OrderItem = require('./OrderItem')
const Design = require('./Design')
const Payment = require('./Payment')
const Address = require('./Address')
const Review = require('./Review')

// Define relationships

// User relationships
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' })
User.hasMany(Design, { foreignKey: 'userId', as: 'designs' })
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' })
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' })

// Product relationships
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' })
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' })

// Category relationships
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' })
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' })
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' })

// Order relationships
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' })
Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' })

// OrderItem relationships
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' })
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' })
OrderItem.belongsTo(Design, { foreignKey: 'designId', as: 'design' })

// Design relationships
Design.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Design.belongsTo(Product, { foreignKey: 'productId', as: 'product' })
Design.hasMany(OrderItem, { foreignKey: 'designId', as: 'orderItems' })

// Payment relationships
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' })
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Address relationships
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Review relationships
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' })
Review.belongsTo(Order, { foreignKey: 'orderId', as: 'order' })

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Design,
  Payment,
  Address,
  Review,
}
