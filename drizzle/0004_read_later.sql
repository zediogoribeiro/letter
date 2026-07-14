CREATE TABLE "read_later" (
	"user_id" text NOT NULL,
	"article_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "read_later_user_id_article_id_pk" PRIMARY KEY("user_id","article_id")
);
--> statement-breakpoint
ALTER TABLE "read_later" ADD CONSTRAINT "read_later_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "read_later" ADD CONSTRAINT "read_later_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "read_later_userId_idx" ON "read_later" USING btree ("user_id");