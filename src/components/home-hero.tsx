import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import { CategoryBadge } from "@/components/category-badge";
import { ReadLaterButton } from "@/components/read-later-button";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { PublicArticle } from "@/lib/articles";
import { formatDate } from "@/lib/utils/format-date";
import { getReadTime } from "@/lib/utils/read-time";

interface HomeHeroProps {
	article: PublicArticle;
}

export const HomeHero = ({ article }: HomeHeroProps) => {
	const readTime = article.content
		? getReadTime(article.content as JSONContent)
		: null;

	return (
		<section className="border-b border-border">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
				<div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
					<div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5">
						<div className="animate-fade-in-up mb-4 flex items-center gap-3">
							<CategoryBadge
								category={article.category ?? "Uncategorized"}
								linked
							/>
							<span className="text-xs text-muted-foreground">
								{formatDate(article.createdAt)}
							</span>
						</div>
						<Link
							to="/articles/$articleId"
							params={{ articleId: article.slug as string }}
							className="group"
						>
							<h1 className="editorial-heading animate-fade-in-up delay-75 text-4xl leading-[1.05] transition-colors duration-300 group-hover:text-muted-foreground sm:text-5xl lg:text-6xl">
								{article.title}
							</h1>
						</Link>
						{article.description && (
							<p className="animate-fade-in-up delay-300 mt-4 text-lg text-muted-foreground">
								{article.description}
							</p>
						)}
						<div className="animate-fade-in-up delay-450 mt-6 flex items-center gap-2">
							<Button asChild className="group gap-2">
								<Link
									to="/articles/$articleId"
									params={{ articleId: article.slug as string }}
								>
									Read the story
									<ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
								</Link>
							</Button>
							<ReadLaterButton articleId={article.id} />
						</div>
						<div className="animate-fade-in-up delay-600 mt-8 flex items-center gap-3">
							<Avatar size="sm">
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
						</div>
					</div>
					{article.coverImage && (
						<div className="order-1 lg:order-2 lg:col-span-7">
							<Link
								to="/articles/$articleId"
								params={{ articleId: article.slug as string }}
								className="group animate-zoom-fade-in block overflow-hidden rounded-lg"
							>
								<img
									src={article.coverImage}
									alt={article.title}
									className="aspect-16/10 w-full object-cover transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
								/>
							</Link>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
