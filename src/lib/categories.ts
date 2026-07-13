export const CATEGORIES = [
	"Marketing",
	"Design",
	"Engineering",
	"Product",
	"Culture",
] as const;

export type Category = (typeof CATEGORIES)[number];
