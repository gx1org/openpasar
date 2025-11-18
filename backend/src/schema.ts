import { boolean, integer, jsonb, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const User = pgTable('users', {
  id: serial('id').primaryKey(),
  autzorg_id: varchar('autzorg_id').notNull().default(''),
  email: varchar('email').unique().notNull().default(''),
  name: varchar('name').notNull().default(''),
  phone: varchar('phone').unique().notNull().default(''),
  balance: integer('balance').notNull().default(0),
  hashed_pin: varchar('hashed_pin').notNull().default(''),
  created_at: timestamp('created_at').defaultNow(),
  is_suspended: boolean('is_suspended').notNull().default(false),
})

export const Store = pgTable('store', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => User.id),
  name: varchar('name').notNull().default(''),
  description: text('description').notNull().default(''),
  image_url: varchar('image_url').notNull().default(''),
  email: varchar('email').notNull().default(''),
  phone: varchar('phone').notNull().default(''),
  sales_count: integer('sales_count').notNull().default(0),
  created_at: timestamp('created_at').defaultNow(),
})

export const Product = pgTable('products', {
  id: serial('id').primaryKey(),
  store_id: integer('store_id').notNull().references(() => Store.id),
  sku: varchar('sku').notNull().default(''),
  name: varchar('name').notNull().default(''),
  description: text('description').notNull().default(''),
  price: integer('price').notNull().default(0),
  in_stock: varchar('in_stock').notNull().default(''),
  is_active: boolean('is_active').notNull().default(true),
  sold_count: integer('sold_count').notNull().default(0),
  featured: integer('featured').notNull().default(0),
  image_url: text('image_url').notNull().default(''),
  created_at: timestamp('created_at').defaultNow(),
})

export const Cart = pgTable('carts', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => User.id),
  product_id: integer('product_id').notNull().references(() => Product.id),
  store_id: integer('store_id').notNull().references(() => Store.id),
  quantity: integer('quantity').notNull().default(1),
  created_at: timestamp('created_at').defaultNow(),
})

export const Transaction = pgTable('transactions', {
  id: serial('id').primaryKey(),
  buyer_id: integer('buyer_id').notNull().references(() => User.id),
  store_id: integer('store_id').notNull().references(() => Store.id),
  total_amount: integer('total_amount').notNull().default(0),
  status: varchar('status').notNull().default('pending'),
  description: varchar('description').notNull().default(''),
  checkout_note: varchar('checkout_note').notNull().default(''),
  items: jsonb("items").$type<Record<string, any>>().notNull().default([]),
  sent_at: timestamp('sent_at').defaultNow(),
  seller_response: text('seller_response').notNull().default(''),
  admin_response: text('admin_response').notNull().default(''),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const Withdrawal = pgTable('withdrawals', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => User.id),
  amount: integer('amount').notNull().default(0),
  receiver: varchar('receiver').notNull().default(''),
  status: varchar('status').notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow(),
})

export const Config = pgTable('configs', {
  id: serial('id').primaryKey(),
  config_key: varchar('config_key').notNull().default('').unique(),
  value: text('value').notNull().default(''),
  created_at: timestamp('created_at').defaultNow(),
})
