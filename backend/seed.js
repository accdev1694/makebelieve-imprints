require('dotenv').config()
const { Category, Product } = require('./models')

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...')

    // Create Categories
    const categories = await Category.bulkCreate([
      {
        name: 'Business Cards',
        slug: 'business-cards',
        description: 'Professional business cards for networking and branding',
        image:
          'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Business+Cards',
        isActive: true,
      },
      {
        name: 'Flyers',
        slug: 'flyers',
        description: 'Eye-catching flyers for events and promotions',
        image: 'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Flyers',
        isActive: true,
      },
      {
        name: 'Posters',
        slug: 'posters',
        description: 'Large format posters for advertising and decoration',
        image: 'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Posters',
        isActive: true,
      },
      {
        name: 'Banners',
        slug: 'banners',
        description: 'Custom banners for events and storefronts',
        image: 'https://via.placeholder.com/400x300/E91E63/FFFFFF?text=Banners',
        isActive: true,
      },
      {
        name: 'Brochures',
        slug: 'brochures',
        description: 'Professional brochures and catalogs',
        image:
          'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Brochures',
        isActive: true,
      },
    ])

    console.log(`✅ Created ${categories.length} categories`)

    // Create Products
    const products = [
      // Business Cards
      {
        name: 'Standard Business Cards',
        slug: 'standard-business-cards',
        description:
          'High-quality business cards on premium card stock. Perfect for professional networking.',
        price: 49.99,
        compareAtPrice: 69.99,
        costPrice: 25.0,
        sku: 'BC-STD-500',
        stock: 1000,
        categoryId: categories[0].id,
        images: [
          'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Business+Card+Front',
          'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Business+Card+Back',
        ],
        productType: 'physical',
        isFeatured: true,
        isActive: true,
        rating: 4.8,
        reviewCount: 124,
      },
      {
        name: 'Premium Business Cards',
        slug: 'premium-business-cards',
        description:
          'Luxury business cards with spot UV, embossing, or foil stamping options.',
        price: 89.99,
        compareAtPrice: 119.99,
        costPrice: 45.0,
        sku: 'BC-PRM-500',
        stock: 500,
        categoryId: categories[0].id,
        images: [
          'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Premium+Card',
        ],
        productType: 'physical',
        isFeatured: true,
        isActive: true,
        rating: 4.9,
        reviewCount: 89,
      },
      // Flyers
      {
        name: 'A4 Flyers - 100 Pack',
        slug: 'a4-flyers-100',
        description:
          'Full-color A4 flyers on glossy or matte paper. Great for events and promotions.',
        price: 39.99,
        costPrice: 20.0,
        sku: 'FLY-A4-100',
        stock: 750,
        categoryId: categories[1].id,
        images: [
          'https://via.placeholder.com/800x600/2196F3/FFFFFF?text=A4+Flyer',
        ],
        productType: 'physical',
        isFeatured: false,
        isActive: true,
        rating: 4.6,
        reviewCount: 56,
      },
      {
        name: 'A5 Flyers - 250 Pack',
        slug: 'a5-flyers-250',
        description: 'Compact A5 flyers perfect for handouts and direct mail.',
        price: 59.99,
        costPrice: 30.0,
        sku: 'FLY-A5-250',
        stock: 800,
        categoryId: categories[1].id,
        images: [
          'https://via.placeholder.com/800x600/2196F3/FFFFFF?text=A5+Flyer',
        ],
        productType: 'physical',
        isFeatured: false,
        isActive: true,
        rating: 4.7,
        reviewCount: 42,
      },
      // Posters
      {
        name: '24x36 Poster',
        slug: '24x36-poster',
        description:
          'Large format poster on premium photo paper. Perfect for advertising.',
        price: 29.99,
        costPrice: 15.0,
        sku: 'PST-24X36',
        stock: 300,
        categoryId: categories[2].id,
        images: [
          'https://via.placeholder.com/800x600/FF9800/FFFFFF?text=24x36+Poster',
        ],
        productType: 'physical',
        isFeatured: true,
        isActive: true,
        rating: 4.5,
        reviewCount: 38,
      },
      {
        name: '18x24 Poster',
        slug: '18x24-poster',
        description: 'Medium format poster ideal for indoor displays.',
        price: 19.99,
        costPrice: 10.0,
        sku: 'PST-18X24',
        stock: 400,
        categoryId: categories[2].id,
        images: [
          'https://via.placeholder.com/800x600/FF9800/FFFFFF?text=18x24+Poster',
        ],
        productType: 'physical',
        isFeatured: false,
        isActive: true,
        rating: 4.4,
        reviewCount: 29,
      },
      // Banners
      {
        name: 'Vinyl Banner 3x6ft',
        slug: 'vinyl-banner-3x6',
        description:
          'Durable vinyl banner for outdoor use. Weather resistant and long-lasting.',
        price: 79.99,
        costPrice: 40.0,
        sku: 'BAN-3X6',
        stock: 150,
        categoryId: categories[3].id,
        images: [
          'https://via.placeholder.com/800x600/E91E63/FFFFFF?text=Vinyl+Banner',
        ],
        productType: 'physical',
        isFeatured: true,
        isActive: true,
        rating: 4.8,
        reviewCount: 67,
      },
      {
        name: 'Retractable Banner Stand',
        slug: 'retractable-banner-stand',
        description:
          'Portable retractable banner stand perfect for trade shows and events.',
        price: 129.99,
        compareAtPrice: 159.99,
        costPrice: 65.0,
        sku: 'BAN-RTR',
        stock: 80,
        categoryId: categories[3].id,
        images: [
          'https://via.placeholder.com/800x600/E91E63/FFFFFF?text=Banner+Stand',
        ],
        productType: 'physical',
        isFeatured: false,
        isActive: true,
        rating: 4.7,
        reviewCount: 45,
      },
      // Brochures
      {
        name: 'Tri-fold Brochure',
        slug: 'tri-fold-brochure',
        description: 'Professional tri-fold brochures on premium glossy paper.',
        price: 69.99,
        costPrice: 35.0,
        sku: 'BRO-TRI-100',
        stock: 600,
        categoryId: categories[4].id,
        images: [
          'https://via.placeholder.com/800x600/9C27B0/FFFFFF?text=Tri-fold+Brochure',
        ],
        productType: 'physical',
        isFeatured: false,
        isActive: true,
        rating: 4.6,
        reviewCount: 52,
      },
      {
        name: 'Product Catalog',
        slug: 'product-catalog',
        description: 'Multi-page product catalog with professional binding.',
        price: 149.99,
        costPrice: 75.0,
        sku: 'BRO-CAT-50',
        stock: 200,
        categoryId: categories[4].id,
        images: [
          'https://via.placeholder.com/800x600/9C27B0/FFFFFF?text=Product+Catalog',
        ],
        productType: 'physical',
        isFeatured: false,
        isActive: true,
        rating: 4.9,
        reviewCount: 31,
      },
    ]

    const createdProducts = await Product.bulkCreate(products)
    console.log(`✅ Created ${createdProducts.length} products`)

    console.log('\n🎉 Database seeded successfully!')
    console.log('\nSummary:')
    console.log(`- Categories: ${categories.length}`)
    console.log(`- Products: ${createdProducts.length}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedData()
