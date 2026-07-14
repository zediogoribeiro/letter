import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArticleCard, ArticleCardSkeleton } from "@/components/article-card";
import { CategoryHeader } from "@/components/category-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { publicArticlesByCategoryQueryOptions } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import { seoHead } from "@/lib/seo";

const SKELETON_CARDS = Array.from({ length: 6 }, (_, index) => index);

export const Route = createFileRoute("/$category")({
	component: RouteComponent,
	pendingComponent: CategoryPending,
	pendingMs: 0,
	pendingMinMs: 300,
	beforeLoad: async ({ context, params }) => {
		const category = CATEGORIES.find(
			(candidate) => candidate.toLowerCase() === params.category,
		);

		if (!category) {
			throw notFound();
		}

		const articles = await context.queryClient.ensureQueryData(
			publicArticlesByCategoryQueryOptions(category),
		);

		return { category, articles };
	},
	head: ({ match }) =>
		seoHead({
			title: `${match.context.category} — Letter`,
			description: `Stories, ideas, and perspectives from the ${match.context.category.toLowerCase()} community.`,
			path: `/${match.context.category.toLowerCase()}`,
		}),
});

function CategoryPending() {
	return (
		<>
			<section className="border-b border-border bg-paper/30">
				<div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
					<Skeleton className="h-5 w-28" />
					<Skeleton className="mt-4 h-10 w-48 sm:h-12 lg:h-14" />
					<Skeleton className="mt-4 h-6 w-full max-w-2xl" />
				</div>
			</section>
			<section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
					{SKELETON_CARDS.map((index) => (
						<li key={index}>
							<ArticleCardSkeleton />
						</li>
					))}
				</ul>
			</section>
		</>
	);
}

function RouteComponent() {
	const { category, articles } = Route.useRouteContext();

	return (
		<>
			<CategoryHeader category={category} />
			<section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				{articles.length === 0 ? (
					<div className="py-16 text-center flex flex-col items-center justify-center gap-3">
						<p className="text-lg text-muted-foreground">
							No sotries published in this category yet
						</p>
						<Button asChild className="w-fit">
							<Link to="/article-editor">Write the first one</Link>
						</Button>
					</div>
				) : (
					<ul className="grid grid-cols-1 gap-x-8 gap-y-6 lg:gap-y-12  sm:grid-cols-2 lg:grid-cols-3">
						{articles.map((article) => (
							<li key={article.id} className="contents">
								<ArticleCard article={article} subgrid />
							</li>
						))}
					</ul>
				)}
			</section>
		</>
	);
}
