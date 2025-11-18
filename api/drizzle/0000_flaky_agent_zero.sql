CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"autzorg_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
