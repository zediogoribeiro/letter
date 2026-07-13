import { Link } from "@tanstack/react-router";

export const CategoryHeader = ({ category }: { category: string }) => {
	return (
		<section className="border-b border-border bg-paper/30">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<Link
					to="/"
					className="text-sm text-muted-foreground hover:text-foreground"
				>
					← Back to feed
				</Link>
				<h1 className="editorial-heading mt-4 text-4xl sm:text-5xl lg:text-6xl">
					{category}
				</h1>
				<p className="mt-4 max-w-2xl text-lg text-muted-foreground">
					Explore stories, ideas, and perspectives from the{" "}
					{category.toLowerCase()} community.
				</p>
			</div>
		</section>
	);
};
