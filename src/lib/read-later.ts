import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/drizzle";
import { readLater } from "../../db/schema";
import { auth } from "./auth";
import { requireAuth } from "./middleware";

const toggleReadLaterSchema = z.object({ articleId: z.string() });

export const toggleReadLaterFn = createServerFn({ method: "POST" })
	.validator(toggleReadLaterSchema)
	.handler(async ({ data }) => {
		const session = await requireAuth();

		const existing = await db.query.readLater.findFirst({
			where: and(
				eq(readLater.userId, session.user.id),
				eq(readLater.articleId, data.articleId),
			),
		});

		if (existing) {
			await db
				.delete(readLater)
				.where(
					and(
						eq(readLater.userId, session.user.id),
						eq(readLater.articleId, data.articleId),
					),
				);

			return { saved: false };
		}

		await db.insert(readLater).values({
			userId: session.user.id,
			articleId: data.articleId,
		});

		return { saved: true };
	});

// returns [] for anonymous visitors so the bookmark button can render unauthenticated
export const getReadLaterIdsFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await auth.api.getSession({
			headers: getRequestHeaders(),
		});

		if (!session) {
			return [];
		}

		const rows = await db.query.readLater.findMany({
			where: eq(readLater.userId, session.user.id),
			columns: { articleId: true },
		});

		return rows.map((row) => row.articleId);
	},
);

export const readLaterIdsQueryOptions = () =>
	queryOptions({
		queryKey: ["read-later", "ids"],
		queryFn: () => getReadLaterIdsFn(),
	});

export const getReadLaterArticlesFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await requireAuth();

		const rows = await db.query.readLater.findMany({
			where: eq(readLater.userId, session.user.id),
			with: { article: { with: { author: true } } },
			orderBy: (readLater, { desc }) => [desc(readLater.createdAt)],
		});

		return rows
			.map((row) => row.article)
			.filter((article) => article.status === "published");
	},
);

export const readLaterArticlesQueryOptions = () =>
	queryOptions({
		queryKey: ["read-later", "articles"],
		queryFn: () => getReadLaterArticlesFn(),
	});
