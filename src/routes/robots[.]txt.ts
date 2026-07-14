import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: async () => {
				const body = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /read-later
Disallow: /article-editor
Disallow: /unauthorized
Disallow: /api/

Sitemap: ${new URL("/sitemap.xml", SITE_URL).toString()}
`;

				return new Response(body, {
					headers: { "Content-Type": "text/plain" },
				});
			},
		},
	},
});
