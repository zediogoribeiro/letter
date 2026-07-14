import { ArrowLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import { ArticleContent } from "@/components/article-content";
import { ReadLaterButton } from "@/components/read-later-button";
import { Skeleton } from "@/components/ui/skeleton";
import { publicArticleBySlugQueryOptions } from "@/lib/articles";
import { SITE_URL, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/articles/$articleId")({
	component: RouteComponent,
	pendingComponent: ArticlePending,
	pendingMs: 0,
	pendingMinMs: 300,
	beforeLoad: async ({ context, params }) => {
		const article = await context.queryClient.ensureQueryData(
			publicArticleBySlugQueryOptions(params.articleId),
		);

		if (!article) {
			throw notFound();
		}

		return { article };
	},
	head: ({ match }) => {
		const { article } = match.context;
		const path = `/articles/${match.params.articleId}`;

		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: article.title,
			description: article.description ?? undefined,
			image: article.coverImage ?? undefined,
			datePublished: article.createdAt,
			dateModified: article.updatedAt,
			author: {
				"@type": "Person",
				name: article.author.name,
			},
			mainEntityOfPage: new URL(path, SITE_URL).toString(),
		};

		return {
			...seoHead({
				title: `${article.title} — Letter`,
				description: article.description,
				path,
				image: article.coverImage,
				type: "article",
			}),
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify(jsonLd),
				},
			],
		};
	},
});

function ArticlePending() {
	return (
		<main className="flex-1">
			<article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
				<Skeleton className="mb-8 h-5 w-28" />
				<div className="mb-6 flex items-center gap-3">
					<Skeleton className="h-6 w-20 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
				<Skeleton className="h-10 w-full sm:h-12 lg:h-14" />
				<Skeleton className="mt-3 h-10 w-2/3 sm:h-12 lg:h-14" />
				<div className="mt-8 flex items-center justify-between border-y border-border py-4">
					<div className="flex items-center gap-3">
						<Skeleton className="size-10 rounded-full" />
						<div className="space-y-1.5">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-3.5 w-16" />
						</div>
					</div>
				</div>
				<Skeleton className="mt-8 aspect-video w-full rounded-lg" />
				<div className="mt-8 space-y-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			</article>
		</main>
	);
}

function RouteComponent() {
	const { article } = Route.useRouteContext();

	return (
		<main className="flex-1">
			<article className="mx-auto max-w-3xl animate-fade-in px-4 py-12 sm:px-6 lg:py-16">
				<Link
					to="/"
					className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeftIcon />
					Back to feed
				</Link>
				<ArticleContent
					title={article.title}
					category={article.category}
					coverImage={article.coverImage}
					content={article.content as JSONContent}
					authorName={article.author.name}
					authorImage={article.author.image}
					date={article.createdAt}
					actions={<ReadLaterButton articleId={article.id} />}
				/>
			</article>
		</main>
	);
}
