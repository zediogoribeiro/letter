export const CATEGORIES = [
	"Marketing",
	"Design",
	"Engineering",
	"Product",
	"Culture",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const isCategory = (value: string): value is Category =>
	(CATEGORIES as readonly string[]).includes(value);
