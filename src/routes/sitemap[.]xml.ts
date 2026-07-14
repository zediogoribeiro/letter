import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/seo";
import { db } from "../../db/drizzle";
import { articles } from "../../db/schema";

const escapeXml = (value: string) =>
	value.replace(
		/[<>&'"]/g,
		(char) =>
			(
				({
					"<": "&lt;",
					">": "&gt;",
					"&": "&amp;",
					"'": "&apos;",
					'"': "&quot;",
				}) as Record<string, string>
			)[char],
	);

const urlEntry = (path: string, lastmod?: Date) => `
	<url>
		<loc>${escapeXml(new URL(path, SITE_URL).toString())}</loc>
		${lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ""}
	</url>`;

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const published = await db.query.articles.findMany({
					where: eq(articles.status, "published"),
					columns: { slug: true, updatedAt: true },
				});

				const urls = [
					urlEntry("/"),
					...CATEGORIES.map((category) =>
						urlEntry(`/${category.toLowerCase()}`),
					),
					...published
						.filter((article) => article.slug)
						.map((article) =>
							urlEntry(`/articles/${article.slug}`, article.updatedAt),
						),
				].join("");

				const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`;

				return new Response(body, {
					headers: { "Content-Type": "application/xml" },
				});
			},
		},
	},
});
