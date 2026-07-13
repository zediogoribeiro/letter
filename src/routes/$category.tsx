import { createFileRoute, notFound } from "@tanstack/react-router";
import { CategoryHeader } from "@/components/category-header";
import { CATEGORIES } from "@/lib/categories";

export const Route = createFileRoute("/$category")({
	component: RouteComponent,
	loader: ({ params }) => {
		const category = CATEGORIES.find(
			(candidate) => candidate.toLowerCase() === params.category,
		);

		if (!category) {
			throw notFound();
		}

		return category;
	},
});

function RouteComponent() {
	const category = Route.useLoaderData();
	return <CategoryHeader category={category} />;
}
