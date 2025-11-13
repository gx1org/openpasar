ALTER TABLE "configs" ALTER COLUMN "value" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "configs" ALTER COLUMN "value" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "store" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "store" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "sent_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "delivery_note" text DEFAULT '' NOT NULL;