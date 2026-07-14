import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleCard, ArticleCardSkeleton } from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { readLaterArticlesQueryOptions } from "@/lib/read-later";

const SKELETON_CARDS = Array.from({ length: 3 }, (_, index) => index);

export const Route = createFileRoute("/(authorized)/(user)/read-later")({
	component: RouteComponent,
	pendingComponent: ReadLaterPending,
	pendingMs: 0,
	pendingMinMs: 300,
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(readLaterArticlesQueryOptions()),
});

function ReadLaterPending() {
	return (
		<main className="flex-1">
			<div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<Skeleton className="h-5 w-24" />
				<Skeleton className="mt-4 h-10 w-56 sm:h-12" />
				<ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
					{SKELETON_CARDS.map((index) => (
						<li key={index}>
							<ArticleCardSkeleton />
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}

function RouteComponent() {
	const { data: articles } = useSuspenseQuery(readLaterArticlesQueryOptions());

	return (
		<main className="flex-1">
			<div className="mx-auto w-full max-w-7xl animate-fade-in px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<p className="text-sm text-muted-foreground">Your list</p>
				<h1 className="editorial-heading mt-1 text-3xl sm:text-4xl lg:text-5xl">
					Read later
				</h1>
				{articles.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
						<BookmarkSimpleIcon size={32} className="text-muted-foreground" />
						<p className="text-lg text-muted-foreground">
							No saved articles yet
						</p>
						<Button asChild className="w-fit">
							<Link to="/">Browse the feed</Link>
						</Button>
					</div>
				) : (
					<ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
						{articles.map((article) => (
							<li key={article.id} className="contents">
								<ArticleCard article={article} subgrid />
							</li>
						))}
					</ul>
				)}
			</div>
		</main>
	);
}
