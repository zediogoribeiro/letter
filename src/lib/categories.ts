export const CATEGORIES = [
	"Marketing",
	"Design",
	"Engineering",
	"Product",
	"Culture",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_PATHS = {
	Marketing: "/marketing",
	Design: "/design",
	Engineering: "/engineering",
	Product: "/product",
	Culture: "/culture",
} as const satisfies Record<Category, string>;
