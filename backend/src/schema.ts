import { integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const User = pgTable('users', {
    id: serial('id').primaryKey(),
    autzorg_id: text('autzorg_id').notNull().default(''),
    email: text('email').notNull().default(''),
    name: text('name').notNull().default(''),
    phone: text('phone').notNull().default(''),
    balance: integer('balance').notNull().default(0),
    created_at: timestamp('created_at').defaultNow(),
})

export const Store = pgTable('store', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => User.id),
    name: text('name').notNull().default(''),
    description: text('description').notNull().default(''),
    image_url: text('image_url').notNull().default(''),
    phone: text('phone').notNull().default(''),
    created_at: timestamp('created_at').defaultNow(),
})

export const Product = pgTable('products', {
    id: serial('id').primaryKey(),
    store_id: integer('store_id').notNull().references(() => Store.id),
    sku: text('sku').notNull().default(''),
    name: text('name').notNull().default(''),
    description: text('description').notNull().default(''),
    price: integer('price').notNull().default(0),
    in_stock: integer('in_stock').notNull().default(0),
    is_active: integer('is_active').notNull().default(1),
    sold_count: integer('sold_count').notNull().default(0),
    featured: integer('featured').notNull().default(0),
    image_url: text('image_url').notNull().default(''),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
})

export const Cart = pgTable('carts', {
    id: serial('id').primaryKey(),
    user_id: serial('user_id').notNull().references(() => User.id),
    product_id: serial('product_id').notNull().references(() => Product.id),
    store_id: serial('store_id').notNull().references(() => Store.id),
    quantity: integer('quantity').notNull().default(1),
    created_at: timestamp('created_at').defaultNow(),
})

export const Transaction = pgTable('transactions', {
    id: serial('id').primaryKey(),
    buyer_id: serial('buyer_id').notNull().references(() => User.id),
    store_id: serial('store_id').notNull().references(() => Store.id),
    total_amount: integer('total_amount').notNull().default(0),
    status: text('status').notNull().default('pending'),
    description: text('description').notNull().default(''),
    checkout_note: text('checkout_note').notNull().default(''),
    items: jsonb("items").$type<Record<string, any>>().notNull().default([]),
    histories: jsonb("histories").$type<Record<string, any>>().notNull().default([]),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
})

export const Withdrawal = pgTable('withdrawals', {
    id: serial('id').primaryKey(),
    user_id: serial('user_id').notNull().references(() => User.id),
    amount: integer('amount').notNull().default(0),
    status: text('status').notNull().default('pending'),
    created_at: timestamp('created_at').defaultNow(),
})
