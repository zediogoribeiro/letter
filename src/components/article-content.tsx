import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { generateHTML, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CategoryBadge } from "@/components/category-badge";
import { Avatar } from "@/components/ui/avatar";

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

interface ArticleContentProps {
	title: string;
	category?: string | null;
	coverImage?: string | null;
	content?: JSONContent | null;
	authorName: string;
	authorImage?: string | null;
	date: Date | string;
	categoryLinked?: boolean;
}

const ArticleContent = ({
	title,
	category,
	coverImage,
	content,
	authorName,
	authorImage,
	date,
	categoryLinked = true,
}: ArticleContentProps) => {
	const readTime = content ? getReadTime(content) : null;

	return (
		<>
			<div className="mb-6 flex items-center gap-3">
				<CategoryBadge
					category={category ?? "Uncategorized"}
					linked={categoryLinked}
				/>
				<span className="text-sm text-muted-foreground">
					{new Date(date).toLocaleDateString()}
				</span>
			</div>

			<h1 className="editorial-heading text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
				{title}
			</h1>

			<div className="mt-8 flex items-center justify-between border-y border-border py-4">
				<div className="flex items-center gap-3">
					<Avatar size="md">
						{authorImage ? (
							<Avatar.Image src={authorImage} />
						) : (
							<Avatar.Fallback>{authorName}</Avatar.Fallback>
						)}
					</Avatar>
					<div>
						<p className="font-medium">{authorName}</p>
						{readTime !== null && (
							<p className="text-sm text-muted-foreground">
								{readTime} min read
							</p>
						)}
					</div>
				</div>
			</div>

			{coverImage && (
				<div className="mt-8 overflow-hidden rounded-lg">
					<img
						src={coverImage}
						alt={title}
						className="aspect-video w-full object-cover"
					/>
				</div>
			)}

			{content && (
				<div
					className="article-content mt-8"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: content is authored by admins via the rich text editor
					dangerouslySetInnerHTML={{
						__html: generateHTML(content, CONTENT_EXTENSIONS),
					}}
				/>
			)}
		</>
	);
};

export { ArticleContent };
