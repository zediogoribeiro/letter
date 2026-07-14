import { CategoryBadge } from "@/components/category-badge";
import { CATEGORIES } from "@/lib/categories";

export const ExploreTopics = () => {
	return (
		<div>
			<h3 className="editorial-subheading text-xl">Explore topics</h3>
			<div className="mt-4 flex flex-wrap gap-2">
				{CATEGORIES.map((category) => (
					<CategoryBadge key={category} category={category} linked />
				))}
			</div>
		</div>
	);
};
