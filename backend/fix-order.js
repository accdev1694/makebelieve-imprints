const { Order, User } = require('./models')

async function fixOrder() {
  try {
    const user = await User.findOne({ where: { email: 'test@example.com' } })

    if (!user) {
      console.log('Test user not found')
      process.exit(1)
    }

    const orders = await Order.findAll({ where: { userId: null } })

    console.log('Found', orders.length, 'orders with null userId')

    for (const order of orders) {
      await order.update({ userId: user.id })
      console.log('Updated order', order.orderNumber, 'to user', user.email)
    }

    console.log('Done!')
  } catch (error) {
    console.error('Error:', error.message)
  }
  process.exit(0)
}

fixOrder()
