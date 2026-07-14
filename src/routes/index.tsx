import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "#/components/sidebar";
import { HomeHero } from "@/components/home-hero";
import { LatestArticles } from "@/components/latest-articles";
import { latestPublicArticleQueryOptions } from "@/lib/articles";

export const Route = createFileRoute("/")({
	component: Home,
	beforeLoad: async ({ context }) => {
		const latestArticle = await context.queryClient.ensureQueryData(
			latestPublicArticleQueryOptions(),
		);

		return { latestArticle };
	},
});

function Home() {
	const { latestArticle } = Route.useRouteContext();

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{latestArticle && <HomeHero article={latestArticle} />}
			<section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid gap-12 lg:grid-cols-12">
					<LatestArticles />
					<Sidebar />
				</div>
			</section>
		</div>
	);
}
