import { Link } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import { CategoryBadge } from "@/components/category-badge";
import { ReadLaterButton } from "@/components/read-later-button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { PublicArticle } from "@/lib/articles";
import { cn } from "@/lib/utils/classnames";
import { formatDate } from "@/lib/utils/format-date";
import { getReadTime } from "@/lib/utils/read-time";

interface ArticleCardProps {
	article: PublicArticle;
	// aligns the card sections with its siblings; requires a grid parent with row-gap
	subgrid?: boolean;
}

const ArticleCard = ({ article, subgrid = false }: ArticleCardProps) => {
	const readTime = article.content
		? getReadTime(article.content as JSONContent)
		: null;

	return (
		<article
			className={cn(
				"group animate-fade-in-up gap-3",
				subgrid ? "grid row-span-5 grid-rows-subgrid" : "flex flex-col",
			)}
		>
			{article.coverImage && (
				<Link
					to="/articles/$articleId"
					params={{ articleId: article.slug as string }}
					className="block overflow-hidden rounded-lg"
				>
					<img
						src={article.coverImage}
						alt={article.title}
						className="aspect-16/10 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
						loading="lazy"
					/>
				</Link>
			)}
			<div className="flex items-center gap-3">
				<CategoryBadge category={article.category ?? "Uncategorized"} linked />
				<span className="text-xs text-muted-foreground mt-1">
					{formatDate(article.createdAt)}
				</span>
			</div>
			<Link
				to="/articles/$articleId"
				params={{ articleId: article.slug as string }}
				className="block"
			>
				<h3 className="editorial-heading text-2xl leading-snug transition-colors duration-300 group-hover:text-muted-foreground">
					{article.title}
				</h3>
			</Link>
			<p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
				{article.description}
			</p>
			<div className="flex items-center gap-2 pt-1">
				<Avatar
					size="xs"
					className="transition-transform duration-300 group-hover:scale-110"
				>
					{article.author.image ? (
						<Avatar.Image src={article.author.image} />
					) : (
						<Avatar.Fallback>{article.author.name}</Avatar.Fallback>
					)}
				</Avatar>
				<span className="text-sm font-medium">{article.author.name}</span>
				{readTime !== null && (
					<span className="text-sm text-muted-foreground">
						· {readTime} min read
					</span>
				)}
				<ReadLaterButton articleId={article.id} iconOnly />
			</div>
		</article>
	);
};

const ArticleCardSkeleton = () => {
	return (
		<div className="flex flex-col gap-3">
			<Skeleton className="aspect-16/10 w-full rounded-lg" />
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-3">
					<Skeleton className="h-5 w-16 rounded-full" />
					<Skeleton className="h-3.5 w-16" />
				</div>
				<Skeleton className="h-7 w-full" />
				<div className="flex flex-col gap-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-4/5" />
				</div>
				<div className="flex items-center gap-2 pt-1">
					<Skeleton className="size-6 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
		</div>
	);
};

export { ArticleCard, ArticleCardSkeleton };
