CREATE TABLE "ab_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"test_type" varchar NOT NULL,
	"variant_a" jsonb NOT NULL,
	"variant_b" jsonb NOT NULL,
	"status" varchar DEFAULT 'draft',
	"traffic_split" integer DEFAULT 50,
	"start_date" timestamp,
	"end_date" timestamp,
	"conversion_goal" varchar,
	"results" jsonb,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"action" varchar NOT NULL,
	"resource_type" varchar,
	"resource_id" varchar,
	"details" jsonb,
	"ip_address" varchar,
	"user_agent" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin' NOT NULL,
	"permissions" text[] DEFAULT '{}',
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" varchar NOT NULL,
	"event_data" jsonb,
	"user_id" varchar,
	"session_id" varchar,
	"ip_address" varchar,
	"user_agent" varchar,
	"referrer" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"phone" text,
	"industry" text,
	"business_size" text,
	"pain_points" text[],
	"time_spent" integer,
	"message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_backups" (
	"id" serial PRIMARY KEY NOT NULL,
	"backup_type" varchar NOT NULL,
	"backup_data" jsonb NOT NULL,
	"backup_size" integer,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"restored_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "email_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"content" text NOT NULL,
	"target_audience" jsonb,
	"status" varchar DEFAULT 'draft',
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"recipient_count" integer DEFAULT 0,
	"open_rate" numeric DEFAULT '0',
	"click_rate" numeric DEFAULT '0',
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"notification_email" varchar(255) NOT NULL,
	"email_provider" varchar(100) DEFAULT 'smtp' NOT NULL,
	"smtp_host" varchar(255),
	"smtp_port" integer,
	"smtp_user" varchar(255),
	"smtp_password" varchar(255),
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_scoring" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"score" integer DEFAULT 0,
	"scoring_factors" jsonb,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "performance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_type" varchar NOT NULL,
	"value" numeric NOT NULL,
	"unit" varchar,
	"page" varchar,
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"company" varchar(255),
	"position" varchar(255),
	"content" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"image" varchar(500),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scheduled_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_type" varchar NOT NULL,
	"content_id" integer,
	"scheduled_action" varchar NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"content_data" jsonb,
	"status" varchar DEFAULT 'pending',
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"executed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"type" varchar(50) DEFAULT 'text' NOT NULL,
	"category" varchar(100) DEFAULT 'general' NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"category" text NOT NULL,
	"icon" text NOT NULL,
	"features" text[],
	"image" text,
	"popular" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
