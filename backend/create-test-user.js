const bcrypt = require('bcryptjs')
const { User } = require('./models')

async function createTestUser() {
  try {
    // Check if user exists
    const existingUser = await User.findOne({
      where: { email: 'test@example.com' },
    })

    if (existingUser) {
      console.log('\n✓ Test user already exists!')
      console.log('Email: test@example.com')
      console.log('Password: password123\n')
      process.exit(0)
      return
    }

    const hashedPassword = await bcrypt.hash('password123', 12)

    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'customer',
      isEmailVerified: true,
      isActive: true,
    })

    console.log('\n✓ Test user created successfully!')
    console.log('Email: test@example.com')
    console.log('Password: password123')
    console.log('User ID:', user.id, '\n')
    process.exit(0)
  } catch (error) {
    console.error('Error creating test user:', error.message)
    process.exit(1)
  }
}

createTestUser()
