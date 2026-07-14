import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, lt } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/drizzle";
import { articles, type JsonValue } from "../../db/schema";
import { requireAdmin } from "./middleware";

const slugify = (title: string) =>
	title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

// slug has a unique DB constraint; append -2, -3, ... until we find one that's free
const ensureUniqueSlug = async (base: string, excludeId?: string) => {
	let slug = base;
	let suffix = 2;

	while (true) {
		const existing = await db.query.articles.findFirst({
			where: eq(articles.slug, slug),
		});

		if (!existing || existing.id === excludeId) {
			return slug;
		}

		slug = `${base}-${suffix++}`;
	}
};

const saveArticleSchema = z.object({
	status: z.enum(["draft", "published"]),
	title: z.string().min(1),
	slug: z.string().optional(),
	category: z.string().optional(),
	description: z.string().optional(),
	coverImage: z.string().url().optional(),
	content: z.custom<JsonValue>().optional(),
});

export const saveArticleFn = createServerFn({ method: "POST" })
	.validator(saveArticleSchema)
	.handler(async ({ data }) => {
		const session = await requireAdmin();
		const slug = await ensureUniqueSlug(data.slug || slugify(data.title));

		const [row] = await db
			.insert(articles)
			.values({
				status: data.status,
				title: data.title,
				slug,
				category: data.category,
				description: data.description,
				coverImage: data.coverImage,
				content: data.content,
				authorId: session.user.id,
			})
			.returning();

		return row;
	});

const updateArticleSchema = saveArticleSchema.extend({ id: z.string() });

export const updateArticleFn = createServerFn({ method: "POST" })
	.validator(updateArticleSchema)
	.handler(async ({ data }) => {
		await requireAdmin();
		const slug = await ensureUniqueSlug(
			data.slug || slugify(data.title),
			data.id,
		);

		const [row] = await db
			.update(articles)
			.set({
				status: data.status,
				title: data.title,
				slug,
				category: data.category,
				description: data.description,
				coverImage: data.coverImage ?? null,
				content: data.content,
			})
			.where(eq(articles.id, data.id))
			.returning();

		return row;
	});

const getArticleBySlugSchema = z.object({ slug: z.string() });

export const getArticleBySlugFn = createServerFn({ method: "GET" })
	.validator(getArticleBySlugSchema)
	.handler(async ({ data }) => {
		await requireAdmin();

		const article = await db.query.articles.findFirst({
			where: eq(articles.slug, data.slug),
		});

		if (!article) {
			throw new Error("Article not found");
		}

		return article;
	});

export const articleBySlugQueryOptions = (slug: string) =>
	queryOptions({
		queryKey: ["articles", "slug", slug],
		queryFn: () => getArticleBySlugFn({ data: { slug } }),
	});

const getPublicArticleBySlugSchema = z.object({ slug: z.string() });

export const getPublicArticleBySlugFn = createServerFn({ method: "GET" })
	.validator(getPublicArticleBySlugSchema)
	.handler(async ({ data }) => {
		const article = await db.query.articles.findFirst({
			where: and(
				eq(articles.slug, data.slug),
				eq(articles.status, "published"),
			),
			with: { author: true },
		});

		return article ?? null;
	});

export const publicArticleBySlugQueryOptions = (slug: string) =>
	queryOptions({
		queryKey: ["articles", "public-slug", slug],
		queryFn: () => getPublicArticleBySlugFn({ data: { slug } }),
	});

const getPublicArticlesByCategorySchema = z.object({ category: z.string() });

export const getPublicArticlesByCategoryFn = createServerFn({
	method: "GET",
})
	.validator(getPublicArticlesByCategorySchema)
	.handler(async ({ data }) => {
		return db.query.articles.findMany({
			where: and(
				eq(articles.category, data.category),
				eq(articles.status, "published"),
			),
			with: { author: true },
			orderBy: (articles, { desc }) => [desc(articles.createdAt)],
		});
	});

export const publicArticlesByCategoryQueryOptions = (category: string) =>
	queryOptions({
		queryKey: ["articles", "public-category", category],
		queryFn: () => getPublicArticlesByCategoryFn({ data: { category } }),
	});

export const getLatestPublicArticleFn = createServerFn({
	method: "GET",
}).handler(async () => {
	const article = await db.query.articles.findFirst({
		where: eq(articles.status, "published"),
		with: { author: true },
		orderBy: (articles, { desc }) => [desc(articles.createdAt)],
	});

	return article ?? null;
});

export const latestPublicArticleQueryOptions = () =>
	queryOptions({
		queryKey: ["articles", "public-latest"],
		queryFn: () => getLatestPublicArticleFn(),
	});

const FEED_PAGE_SIZE = 5;

const getPublicArticlesSchema = z.object({
	// createdAt of the last item on the previous page (ISO string)
	cursor: z.string().datetime().optional(),
});

export const getPublicArticlesFn = createServerFn({ method: "GET" })
	.validator(getPublicArticlesSchema)
	.handler(async ({ data }) => {
		// fetch one extra row to know whether a next page exists
		const rows = await db.query.articles.findMany({
			where: and(
				eq(articles.status, "published"),
				data.cursor ? lt(articles.createdAt, new Date(data.cursor)) : undefined,
			),
			with: { author: true },
			orderBy: (articles, { desc }) => [desc(articles.createdAt)],
			limit: FEED_PAGE_SIZE + 1,
		});

		const items = rows.slice(0, FEED_PAGE_SIZE);
		const nextCursor =
			rows.length > FEED_PAGE_SIZE
				? items[items.length - 1].createdAt.toISOString()
				: null;

		return { items, nextCursor };
	});

export const latestPublicArticlesQueryOptions = () =>
	queryOptions({
		queryKey: ["articles", "public-feed"],
		queryFn: () => getPublicArticlesFn({ data: {} }),
	});

export type PublicArticle = Awaited<
	ReturnType<typeof getPublicArticlesByCategoryFn>
>[number];

export const listArticlesFn = createServerFn({ method: "GET" }).handler(
	async () => {
		await requireAdmin();

		return db.query.articles.findMany({
			with: { author: true },
			orderBy: (articles, { desc }) => [desc(articles.createdAt)],
		});
	},
);

export const articlesQueryOptions = () =>
	queryOptions({
		queryKey: ["articles"],
		queryFn: () => listArticlesFn(),
	});

const updateArticleStatusSchema = z.object({
	id: z.string(),
	status: z.enum(["draft", "published"]),
});

export const updateArticleStatusFn = createServerFn({ method: "POST" })
	.validator(updateArticleStatusSchema)
	.handler(async ({ data }) => {
		await requireAdmin();

		const [row] = await db
			.update(articles)
			.set({ status: data.status })
			.where(eq(articles.id, data.id))
			.returning();

		return row;
	});

const deleteArticleSchema = z.object({ id: z.string() });

export const deleteArticleFn = createServerFn({ method: "POST" })
	.validator(deleteArticleSchema)
	.handler(async ({ data }) => {
		await requireAdmin();

		await db.delete(articles).where(eq(articles.id, data.id));
	});
