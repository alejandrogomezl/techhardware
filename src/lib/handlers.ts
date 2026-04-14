import { Types } from 'mongoose';
import connect from '@/lib/mongoose';
import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import Orders, { Order } from '@/models/Order';

// ─── Shared error response ────────────────────────────────────────────────────

export interface ErrorResponse {
  error: string;
  message: string;
}

// ─── GET /api/products ────────────────────────────────────────────────────────

export interface GetProductsResponse {
  products: (Product & { _id: Types.ObjectId })[];
}

export async function getProducts(): Promise<GetProductsResponse> {
  await connect();

  const products = await Products.find({}, { __v: false });

  return { products };
}

// ─── GET /api/products/[productId] ───────────────────────────────────────────

export type GetProductResponse = Product & { _id: Types.ObjectId };

export async function getProduct(
  productId: string
): Promise<GetProductResponse | null> {
  await connect();

  const product = await Products.findById(productId, { __v: false });

  return product;
}

// ─── POST /api/users ──────────────────────────────────────────────────────────

export interface CreateUserResponse {
  _id: Types.ObjectId;
}

export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: string;
}): Promise<CreateUserResponse | null> {
  await connect();

  // Check for duplicate email
  const existing = await Users.find({ email: user.email });
  if (existing.length !== 0) return null;

  const doc: User = {
    ...user,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  const newUser = await Users.create(doc);

  return { _id: newUser._id };
}

// ─── GET /api/users/[userId] ──────────────────────────────────────────────────

export interface GetUserResponse
  extends Pick<User, 'email' | 'name' | 'surname' | 'address' | 'birthdate'> {
  _id: Types.ObjectId;
}

export async function getUser(
  userId: string
): Promise<GetUserResponse | null> {
  await connect();

  const projection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  };

  const user = await Users.findById(userId, projection);

  return user;
}

// ─── GET /api/users/[userId]/cart ─────────────────────────────────────────────

export interface PopulatedCartItem {
  product: Product & { _id: Types.ObjectId };
  qty: number;
}

export interface GetUserCartResponse {
  cartItems: PopulatedCartItem[];
}

export async function getUserCart(
  userId: string
): Promise<GetUserCartResponse | null> {
  await connect();

  const user = await Users.findById(userId, { cartItems: true })
    .populate<{ cartItems: PopulatedCartItem[] }>('cartItems.product', {
      __v: false,
    });

  if (!user) return null;

  return { cartItems: user.cartItems };
}

// ─── PUT /api/users/[userId]/cart/[productId] ─────────────────────────────────

export interface PutUserCartResponse {
  cartItems: PopulatedCartItem[];
  isNew: boolean;
}

export async function putUserCart(
  userId: string,
  productId: string,
  qty: number
): Promise<PutUserCartResponse | null> {
  await connect();

  // Verify product exists
  const product = await Products.findById(productId);
  if (!product) return null;

  const user = await Users.findById(userId);
  if (!user) return null;

  const existingIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  let isNew = false;

  if (existingIndex >= 0) {
    // Product already in cart — update qty
    user.cartItems[existingIndex].qty = qty;
  } else {
    // Product not in cart — add new entry
    user.cartItems.push({ product: new Types.ObjectId(productId), qty });
    isNew = true;
  }

  await user.save();

  // Return populated cart
  const updatedUser = await Users.findById(userId, { cartItems: true })
    .populate<{ cartItems: PopulatedCartItem[] }>('cartItems.product', {
      __v: false,
    });

  return { cartItems: updatedUser!.cartItems, isNew };
}

// ─── DELETE /api/users/[userId]/cart/[productId] ──────────────────────────────

export interface DeleteUserCartResponse {
  cartItems: PopulatedCartItem[];
}

export async function deleteUserCart(
  userId: string,
  productId: string
): Promise<DeleteUserCartResponse | null> {
  await connect();

  // Verify product exists
  const product = await Products.findById(productId);
  if (!product) return null;

  const user = await Users.findById(userId);
  if (!user) return null;

  // Remove the item (no-op if it wasn't in the cart)
  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  await user.save();

  // Return populated cart
  const updatedUser = await Users.findById(userId, { cartItems: true })
    .populate<{ cartItems: PopulatedCartItem[] }>('cartItems.product', {
      __v: false,
    });

  return { cartItems: updatedUser!.cartItems };
}

// ─── GET /api/users/[userId]/orders ───────────────────────────────────────────

export interface GetUserOrdersResponse {
  orders: (Order & { _id: Types.ObjectId })[];
}

export async function getUserOrders(
  userId: string
): Promise<GetUserOrdersResponse | null> {
  await connect();

  const user = await Users.findById(userId, { orders: true }).populate<{
    orders: (Order & { _id: Types.ObjectId })[];
  }>('orders');

  if (!user) return null;

  return { orders: user.orders };
}

// ─── POST /api/users/[userId]/orders ─────────────────────────────────────────

export interface CreateOrderResponse {
  _id: Types.ObjectId;
}

export async function createOrder(
  userId: string,
  address: string,
  cardHolder: string,
  cardNumber: string
): Promise<CreateOrderResponse | null> {
  await connect();

  // Fetch user with populated cart products (to read current prices)
  const user = await Users.findById(userId).populate<{
    cartItems: PopulatedCartItem[];
  }>('cartItems.product');

  if (!user) return null;
  if (user.cartItems.length === 0) return null;

  // Build orderItems capturing current price of each product
  const orderItems = user.cartItems.map((item) => ({
    product: item.product._id,
    qty: item.qty,
    price: item.product.price,
  }));

  // Create the order
  const newOrder = await Orders.create({
    date: new Date(),
    address,
    cardHolder,
    cardNumber,
    orderItems,
  });

  // Empty the cart and register the order on the user
  user.cartItems = [];
  (user.orders as Types.ObjectId[]).push(newOrder._id);
  await user.save();

  return { _id: newOrder._id };
}

// ─── GET /api/users/[userId]/orders/[orderId] ─────────────────────────────────

export interface PopulatedOrderItem {
  product: Product & { _id: Types.ObjectId };
  qty: number;
  price: number;
}

export interface GetOrderResponse {
  _id: Types.ObjectId;
  date: Date;
  address: string;
  cardHolder: string;
  cardNumber: string;
  orderItems: PopulatedOrderItem[];
}

export async function getOrder(
  userId: string,
  orderId: string
): Promise<GetOrderResponse | null> {
  await connect();

  const user = await Users.findById(userId);
  if (!user) return null;

  // Verify this order belongs to the user
  const ownsOrder = user.orders.some((o) => o.toString() === orderId);
  if (!ownsOrder) return null;

  const order = await Orders.findById(orderId, { __v: false }).populate<{
    orderItems: PopulatedOrderItem[];
  }>('orderItems.product', { __v: false });

  return order;
}
