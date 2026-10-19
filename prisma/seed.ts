import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // 2. Clear existing products to prevent duplicates on re-run
  await prisma.product.deleteMany({})

  // 3. Create Sample Products
  await prisma.product.createMany({
    data: [
      {
        name: 'Nexus Pro Wireless Headphones',
        description: 'High-fidelity active noise-cancelling headphones with 40-hour battery life.',
        price: 299.99,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        category: 'Electronics',
      },
      {
        name: 'Minimalist Mechanical Keyboard',
        description: 'Hot-swappable wireless RGB mechanical keyboard with custom tactile switches.',
        price: 149.99,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
        category: 'Accessories',
      },
      {
        name: 'Ultra-Wide 4K Gaming Monitor',
        description: '34-inch curved IPS display with 144Hz refresh rate and HDR support.',
        price: 599.99,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
        category: 'Electronics',
      },
      {
        name: 'Ergonomic Executive Chair',
        description: 'Breathable mesh back support with adjustable armrests and lumbar cushioning.',
        price: 249.99,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1580481077494-e3299acae51c?w=500&auto=format&fit=crop&q=60',
        category: 'Furniture',
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })