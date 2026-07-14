import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "#/components/sidebar";
import { HomeHero } from "@/components/home-hero";
import { LatestArticles } from "@/components/latest-articles";
import { heroArticleQueryOptions } from "@/lib/articles";

export const Route = createFileRoute("/")({
	component: Home,
	head: () => ({
		meta: [{ title: "Home — Letter" }],
	}),
	beforeLoad: async ({ context }) => {
		const heroArticle = await context.queryClient.ensureQueryData(
			heroArticleQueryOptions(),
		);

		return { heroArticle };
	},
});

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
