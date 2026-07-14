import { useQuery } from "@tanstack/react-query";
import { ArticleCard, ArticleCardSkeleton } from "@/components/article-card";
import { Divider } from "@/components/ui/divider";
import { latestPublicArticlesQueryOptions } from "@/lib/articles";

const SKELETON_CARDS = Array.from({ length: 5 }, (_, index) => index);

export const LatestArticles = () => {
	const { data, isPending, isError } = useQuery(
		latestPublicArticlesQueryOptions(),
	);

	const feedArticles = data?.items ?? [];

	return (
		<div className="lg:col-span-8">
			<h2 className="editorial-subheading mb-8 text-2xl">Latest stories</h2>

			{isPending ? (
				<div className="flex flex-col gap-8">
					{SKELETON_CARDS.map((index) => (
						<div key={index}>
							<ArticleCardSkeleton />
							{index < SKELETON_CARDS.length - 1 && (
								<Divider decorative className="mt-8" />
							)}
						</div>
					))}
				</div>
			) : isError ? (
				<p className="py-8 text-muted-foreground">
					Couldn't load stories. Try refreshing the page.
				</p>
			) : feedArticles.length === 0 ? (
				<p className="py-8 text-muted-foreground">No stories published yet.</p>
			) : (
				<div className="flex flex-col gap-8">
					{feedArticles.map((article, index) => (
						<div key={article.id}>
							<ArticleCard article={article} />
							{index < feedArticles.length - 1 && (
								<Divider decorative className="mt-8" />
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
