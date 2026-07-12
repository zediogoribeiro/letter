import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { db } from "../../db/drizzle";
import { articles, type JsonValue } from "../../db/schema";
import { auth } from "./auth";

const saveArticleSchema = z.object({
	status: z.enum(["draft", "published"]),
	title: z.string().min(1),
	slug: z.string().optional(),
	category: z.string().optional(),
	description: z.string().optional(),
	content: z.custom<JsonValue>().optional(),
});

export const saveArticleFn = createServerFn({ method: "POST" })
	.validator(saveArticleSchema)
	.handler(async ({ data }) => {
		const session = await auth.api.getSession({
			headers: getRequestHeaders(),
		});

		if (!session || session.user.role !== "admin") {
			throw new Error("Unauthorized");
		}

		const [row] = await db
			.insert(articles)
			.values({
				status: data.status,
				title: data.title,
				slug: data.slug,
				category: data.category,
				description: data.description,
				content: data.content,
				authorId: session.user.id,
			})
			.returning();

		return row;
	});
