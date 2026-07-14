import { createFileRoute } from "@tanstack/react-router";
import { HomeHero } from "@/components/home-hero";
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
		</div>
	);
}
