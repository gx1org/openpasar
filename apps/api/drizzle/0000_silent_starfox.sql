CREATE TABLE "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_key" varchar DEFAULT '' NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "configs_config_key_unique" UNIQUE("config_key")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"sku" varchar DEFAULT '' NOT NULL,
	"name" varchar DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"in_stock" varchar DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sold_count" integer DEFAULT 0 NOT NULL,
	"featured" integer DEFAULT 0 NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "store" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image_url" varchar DEFAULT '' NOT NULL,
	"email" varchar DEFAULT '' NOT NULL,
	"phone" varchar DEFAULT '' NOT NULL,
	"sales_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"buyer_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"description" varchar DEFAULT '' NOT NULL,
	"checkout_note" varchar DEFAULT '' NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sent_at" timestamp DEFAULT now(),
	"seller_response" text DEFAULT '' NOT NULL,
	"admin_response" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"autzorg_id" varchar DEFAULT '' NOT NULL,
	"email" varchar DEFAULT '' NOT NULL,
	"name" varchar DEFAULT '' NOT NULL,
	"phone" varchar DEFAULT '' NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"hashed_pin" varchar DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"is_suspended" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "withdrawals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"receiver" varchar DEFAULT '' NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store" ADD CONSTRAINT "store_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;