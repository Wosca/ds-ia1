CREATE TABLE IF NOT EXISTS "account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "covid_cases" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"date_reported" timestamp with time zone NOT NULL,
	"country_code" varchar(10) NOT NULL,
	"new_cases" integer,
	"cumulative_cases" integer,
	"new_deaths" integer,
	"cumulative_deaths" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "covid_countries" (
	"country_code" varchar(10) PRIMARY KEY NOT NULL,
	"country_name" varchar(255) NOT NULL,
	"whoregion" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "covid_daily_stats" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"country_code" varchar(10) NOT NULL,
	"last_updated" timestamp with time zone NOT NULL,
	"total_cases" integer DEFAULT 0 NOT NULL,
	"total_deaths" integer DEFAULT 0 NOT NULL,
	"new_cases_7day_avg" integer DEFAULT 0,
	"new_deaths_7day_avg" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "covid_cases" ADD CONSTRAINT "covid_cases_country_code_covid_countries_country_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."covid_countries"("country_code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "covid_daily_stats" ADD CONSTRAINT "covid_daily_stats_country_code_covid_countries_country_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."covid_countries"("country_code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" USING btree ("user_id");