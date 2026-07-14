import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { isCategory } from "@/lib/categories";
import { CATEGORY_BADGE_STYLES } from "@/lib/category-colors";
import { cn } from "@/lib/utils/classnames";

const FALLBACK_STYLE =
	"border-transparent bg-muted text-muted-foreground hover:bg-muted/80";

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
				isCategory(category) ? CATEGORY_BADGE_STYLES[category] : FALLBACK_STYLE,
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
