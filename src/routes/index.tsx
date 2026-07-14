import { createFileRoute } from "@tanstack/react-router";
import { HomeHero } from "@/components/home-hero";
import { LatestArticles } from "@/components/latest-articles";
import { Sidebar } from "@/components/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { heroArticleQueryOptions } from "@/lib/articles";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
	component: Home,
	pendingComponent: HomePending,
	pendingMs: 0,
	pendingMinMs: 300,
	head: () =>
		seoHead({
			title: "Letter — an editorial publishing platform",
			description:
				"A magazine-style blog with articles on marketing, design, engineering, product, and culture.",
			path: "/",
		}),
	beforeLoad: async ({ context }) => {
		const heroArticle = await context.queryClient.ensureQueryData(
			heroArticleQueryOptions(),
		);

		return { heroArticle };
	},
});

function HomePending() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<section className="border-b border-border">
				<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
					<div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
						<div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5">
							<div className="mb-4 flex items-center gap-3">
								<Skeleton className="h-6 w-20 rounded-full" />
								<Skeleton className="h-4 w-24" />
							</div>
							<Skeleton className="h-10 w-full sm:h-12 lg:h-14" />
							<Skeleton className="mt-3 h-10 w-2/3 sm:h-12 lg:h-14" />
							<Skeleton className="mt-4 h-6 w-full" />
							<Skeleton className="mt-6 h-10 w-36" />
							<div className="mt-8 flex items-center gap-3">
								<Skeleton className="size-8 rounded-full" />
								<Skeleton className="h-4 w-24" />
							</div>
						</div>
						<div className="order-1 lg:order-2 lg:col-span-7">
							<Skeleton className="aspect-16/10 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</section>
			<section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid gap-12 lg:grid-cols-12">
					<LatestArticles />
					<Sidebar />
				</div>
			</section>
		</div>
	);
}

function Home() {
	const { heroArticle } = Route.useRouteContext();

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{heroArticle && <HomeHero article={heroArticle} />}
			<section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid gap-12 lg:grid-cols-12">
					<LatestArticles />
					<Sidebar />
				</div>
			</section>
		</div>
	);
}
