import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import { Skeleton } from "@/components/ui/skeleton";
import { latestPublicArticlesQueryOptions } from "@/lib/articles";
import { getReadTime } from "@/lib/utils/read-time";

const SKELETON_ROWS = Array.from({ length: 5 }, (_, index) => index);

export const TrendingNow = () => {
	const { data, isPending } = useQuery(latestPublicArticlesQueryOptions());

	const trending = data?.items ?? [];

	if (!isPending && trending.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="editorial-subheading text-xl">Trending now</h3>
			<div className="mt-4 flex flex-col">
				{isPending
					? SKELETON_ROWS.map((index) => (
							<div key={index} className="flex gap-4 py-4">
								<Skeleton className="h-8 w-8" />
								<div className="flex flex-1 flex-col gap-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-3 w-24" />
								</div>
							</div>
						))
					: trending.map((article, index) => {
							const readTime = article.content
								? getReadTime(article.content as JSONContent)
								: null;

							return (
								<div
									key={article.id}
									className="group animate-fade-in-up flex gap-4 py-4"
									style={{ animationDelay: `${index * 80}ms` }}
								>
									<span className="editorial-heading text-2xl text-muted-foreground/40 transition-colors duration-300 group-hover:text-foreground">
										{String(index + 1).padStart(2, "0")}
									</span>
									<div className="flex flex-col gap-1">
										<Link
											to="/articles/$articleId"
											params={{ articleId: article.slug as string }}
											className="font-medium transition-colors duration-300 group-hover:text-muted-foreground"
										>
											{article.title}
										</Link>
										<span className="text-xs text-muted-foreground">
											{article.author.name}
											{readTime !== null && ` · ${readTime} min`}
										</span>
									</div>
								</div>
							);
						})}
			</div>
		</div>
	);
};
