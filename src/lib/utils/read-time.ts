import type { JSONContent } from "@tiptap/react";

const WORDS_PER_MINUTE = 200;

const extractText = (node: JSONContent): string => {
	const ownText = node.text ?? "";
	const childText = node.content?.map(extractText).join(" ") ?? "";
	return `${ownText} ${childText}`;
};

export const getReadTime = (content: JSONContent) => {
	const wordCount = extractText(content)
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;

	return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
};
