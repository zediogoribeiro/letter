import type { JSONContent } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import { getReadTime } from "@/lib/utils/read-time";

const paragraph = (text: string): JSONContent => ({
	type: "paragraph",
	content: [{ type: "text", text }],
});

describe("getReadTime", () => {
	it("rounds to the nearest minute at 200 words per minute", () => {
		const words = Array.from({ length: 400 }, () => "word").join(" ");
		expect(getReadTime(paragraph(words))).toBe(2);
	});

	it("returns a minimum of 1 minute for very short content", () => {
		expect(getReadTime(paragraph("hello world"))).toBe(1);
	});

	it("returns a minimum of 1 minute for empty content", () => {
		expect(getReadTime({ type: "doc", content: [] })).toBe(1);
	});

	it("counts words across nested nodes", () => {
		const doc: JSONContent = {
			type: "doc",
			content: [paragraph("one two three"), paragraph("four five six")],
		};

		expect(getReadTime(doc)).toBe(1);
	});
});
