import type { Category } from "@/lib/categories";

export const CATEGORY_BADGE_STYLES: Record<Category, string> = {
	Marketing:
		"border-transparent bg-category-marketing text-category-marketing-foreground hover:bg-category-marketing/80",
	Design:
		"border-transparent bg-category-design text-category-design-foreground hover:bg-category-design/80",
	Engineering:
		"border-transparent bg-category-engineering text-category-engineering-foreground hover:bg-category-engineering/80",
	Product:
		"border-transparent bg-category-product text-category-product-foreground hover:bg-category-product/80",
	Culture:
		"border-transparent bg-category-culture text-category-culture-foreground hover:bg-category-culture/80",
};

export const CATEGORY_TEXT_STYLES: Record<Category, string> = {
	Marketing: "text-category-marketing-foreground",
	Design: "text-category-design-foreground",
	Engineering: "text-category-engineering-foreground",
	Product: "text-category-product-foreground",
	Culture: "text-category-culture-foreground",
};

export const CATEGORY_HOVER_TEXT_STYLES: Record<Category, string> = {
	Marketing: "hover:text-category-marketing-foreground",
	Design: "hover:text-category-design-foreground",
	Engineering: "hover:text-category-engineering-foreground",
	Product: "hover:text-category-product-foreground",
	Culture: "hover:text-category-culture-foreground",
};

export const CATEGORY_HOVER_SURFACE_STYLES: Record<Category, string> = {
	Marketing:
		"hover:bg-category-marketing hover:text-category-marketing-foreground",
	Design: "hover:bg-category-design hover:text-category-design-foreground",
	Engineering:
		"hover:bg-category-engineering hover:text-category-engineering-foreground",
	Product: "hover:bg-category-product hover:text-category-product-foreground",
	Culture: "hover:bg-category-culture hover:text-category-culture-foreground",
};

// Radix Select.Item moves DOM focus to the highlighted item (pointer or
// keyboard), so `focus:` is what actually drives the highlight state here.
// The base item style fills `focus:bg-accent`; override it to transparent so
// only the category text color shows through.
export const CATEGORY_SELECT_ITEM_STYLES: Record<Category, string> = {
	Marketing: "focus:bg-transparent focus:text-category-marketing-foreground",
	Design: "focus:bg-transparent focus:text-category-design-foreground",
	Engineering:
		"focus:bg-transparent focus:text-category-engineering-foreground",
	Product: "focus:bg-transparent focus:text-category-product-foreground",
	Culture: "focus:bg-transparent focus:text-category-culture-foreground",
};
