const { Order, User } = require('./models')

async function checkOrders() {
  try {
    const orders = await Order.findAll({
      attributes: ['id', 'orderNumber', 'userId', 'total'],
      limit: 5,
      order: [['createdAt', 'DESC']],
    })

    console.log('\nOrders:')
    orders.forEach((o) => {
      const data = o.toJSON()
      console.log(
        'Order:',
        data.orderNumber,
        'UserId:',
        data.userId,
        'Total:',
        data.total
      )
    })

    const user = await User.findOne({ where: { email: 'test@example.com' } })
    console.log('\nTest user ID:', user ? user.id : 'Not found')

    // Fix any order without a userId
    if (user) {
      for (const order of orders) {
        if (!order.userId) {
          await order.update({ userId: user.id })
          console.log('Fixed order:', order.orderNumber)
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
  process.exit(0)
}

checkOrders()
