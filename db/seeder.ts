import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Products, { Product } from '../src/models/Product';
import Users, { User } from '../src/models/User';
import Orders from '../src/models/Order';

dotenv.config({ path: '.env.local', override: true });
const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = { bufferCommands: false };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  if (conn.connection.db === undefined) {
    throw new Error('Could not connect');
  }

  // Clear the database
  await conn.connection.db.dropDatabase();

  // Create empty collections
  await Products.createCollection();
  await Users.createCollection();
  await Orders.createCollection();

  // Insert sample products
  const products: Product[] = [
    {
      name: 'RAM 4GB',
      price: 150.99,
      img: '/img/ecommerce-images/ram.jpg',
      description: 'What a bottle!',
    },
    {
      name: 'Intel Core i9',
      price: 239.95,
      img: '/img/ecommerce-images/i9.jpeg',
      description: 'Yet another item',
    },
  ];

  const insertedProducts = await Products.insertMany(products);
  console.log('Inserted products:', JSON.stringify(insertedProducts, null, 2));

  // Insert a sample user
  const user: User = {
    email: 'johndoe@example.com',
    password: '1234',
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [],
  };

  const insertedUser = await Users.create(user);
  console.log('Inserted user:', JSON.stringify(insertedUser, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);
