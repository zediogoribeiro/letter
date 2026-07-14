const SITE_NAME = "Letter";

export const SITE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

interface SeoHeadOptions {
	title: string;
	description?: string | null;
	path: string;
	image?: string | null;
	type?: "website" | "article";
}

export const seoHead = ({
	title,
	description,
	path,
	image,
	type = "website",
}: SeoHeadOptions) => {
	const url = new URL(path, SITE_URL).toString();

	return {
		meta: [
			{ title },
			...(description ? [{ name: "description", content: description }] : []),
			{ property: "og:title", content: title },
			...(description
				? [{ property: "og:description", content: description }]
				: []),
			{ property: "og:type", content: type },
			{ property: "og:url", content: url },
			{ property: "og:site_name", content: SITE_NAME },
			...(image ? [{ property: "og:image", content: image }] : []),
			{
				name: "twitter:card",
				content: image ? "summary_large_image" : "summary",
			},
			{ name: "twitter:title", content: title },
			...(description
				? [{ name: "twitter:description", content: description }]
				: []),
			...(image ? [{ name: "twitter:image", content: image }] : []),
		],
		links: [{ rel: "canonical", href: url }],
	};
};
