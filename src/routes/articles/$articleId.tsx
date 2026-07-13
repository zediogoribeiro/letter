import { ArrowLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { generateHTML, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CategoryBadge } from "@/components/category-badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { publicArticleBySlugQueryOptions } from "@/lib/articles";

const CONTENT_EXTENSIONS = [
	StarterKit.configure({
		bulletList: { HTMLAttributes: { class: "list-disc ml-10" } },
		orderedList: { HTMLAttributes: { class: "list-decimal ml-10" } },
	}),
	Highlight,
	TextAlign.configure({
		types: ["heading", "paragraph", "listItem"],
		alignments: ["left", "center"],
	}),
];

const WORDS_PER_MINUTE = 200;

const extractText = (node: JSONContent): string => {
	const ownText = node.text ?? "";
	const childText = node.content?.map(extractText).join(" ") ?? "";
	return `${ownText} ${childText}`;
};

const getReadTime = (content: JSONContent) => {
	const wordCount = extractText(content)
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;

	return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
};

export const Route = createFileRoute("/articles/$articleId")({
	component: RouteComponent,
	pendingComponent: ArticlePending,
	pendingMs: 0,
	pendingMinMs: 300,
	beforeLoad: async ({ context, params }) => {
		const article = await context.queryClient.ensureQueryData(
			publicArticleBySlugQueryOptions(params.articleId),
		);

		if (!article) {
			throw notFound();
		}

		return { article };
	},
});

function ArticlePending() {
	return (
		<main className="flex-1">
			<article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
				<Skeleton className="mb-8 h-5 w-28" />
				<div className="mb-6 flex items-center gap-3">
					<Skeleton className="h-6 w-20 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
				<Skeleton className="h-10 w-full sm:h-12 lg:h-14" />
				<Skeleton className="mt-3 h-10 w-2/3 sm:h-12 lg:h-14" />
				<div className="mt-8 flex items-center justify-between border-y border-border py-4">
					<div className="flex items-center gap-3">
						<Skeleton className="size-10 rounded-full" />
						<div className="space-y-1.5">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-3.5 w-16" />
						</div>
					</div>
				</div>
				<Skeleton className="mt-8 aspect-video w-full rounded-lg" />
				<div className="mt-8 space-y-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			</article>
		</main>
	);
}

function RouteComponent() {
	const { article } = Route.useRouteContext();
	const readTime = article.content
		? getReadTime(article.content as JSONContent)
		: null;

	return (
		<main className="flex-1">
			<article className="mx-auto max-w-3xl animate-fade-in px-4 py-12 sm:px-6 lg:py-16">
				<Link
					to="/"
					className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeftIcon />
					Back to feed
				</Link>
				<div className="mb-6 flex items-center gap-3">
					<CategoryBadge
						category={article.category ?? "Uncategorized"}
						linked
					/>
					<span className="text-sm text-muted-foreground">
						{new Date(article.createdAt).toLocaleDateString()}
					</span>
				</div>

				<h1 className="editorial-heading text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
					{article.title}
				</h1>

				<div className="mt-8 flex items-center justify-between border-y border-border py-4">
					<div className="flex items-center gap-3">
						<Avatar size="md">
							{article.author.image ? (
								<Avatar.Image src={article.author.image} />
							) : (
								<Avatar.Fallback>{article.author.name}</Avatar.Fallback>
							)}
						</Avatar>
						<div>
							<p className="font-medium">{article.author.name}</p>
							{readTime !== null && (
								<p className="text-sm text-muted-foreground">
									{readTime} min read
								</p>
							)}
						</div>
					</div>
				</div>

				{article.coverImage && (
					<div className="mt-8 overflow-hidden rounded-lg">
						<img
							src={article.coverImage}
							alt={article.title}
							className="aspect-video w-full object-cover"
						/>
					</div>
				)}

				{article.content && (
					<div
						className="article-content mt-8"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: content is authored by admins via the rich text editor
						dangerouslySetInnerHTML={{
							__html: generateHTML(
								article.content as JSONContent,
								CONTENT_EXTENSIONS,
							),
						}}
					/>
				)}
			</article>
		</main>
	);
}
