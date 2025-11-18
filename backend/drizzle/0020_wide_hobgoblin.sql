ALTER TABLE "products" ALTER COLUMN "image_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "image_url" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "admin_response" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "extra_images";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "histories";