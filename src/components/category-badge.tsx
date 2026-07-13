import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, type Category } from "@/lib/categories";
import { cn } from "@/lib/utils/classnames";

const CATEGORY_STYLES: Record<Category, string> = {
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

const FALLBACK_STYLE =
	"border-transparent bg-muted text-muted-foreground hover:bg-muted/80";

const isCategory = (value: string): value is Category =>
	(CATEGORIES as readonly string[]).includes(value);

interface CategoryBadgeProps {
	category: string;
	linked?: boolean;
}

const CategoryBadge = ({ category, linked = false }: CategoryBadgeProps) => {
	const badge = (
		<Badge
			variant="secondary"
			size="sm"
			className={cn(
				"rounded-full transition-transform duration-200 hover:-translate-y-0.5",
				isCategory(category) ? CATEGORY_STYLES[category] : FALLBACK_STYLE,
			)}
		>
			{category}
		</Badge>
	);

	if (linked) {
		return (
			<Link to="/$category" params={{ category: category.toLowerCase() }}>
				{badge}
			</Link>
		);
	}

	return badge;
};

export { CategoryBadge };
