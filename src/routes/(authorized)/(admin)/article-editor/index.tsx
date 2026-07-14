import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArticleForm } from "@/components/article-form";

export const Route = createFileRoute("/(authorized)/(admin)/article-editor/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return (
		<ArticleForm
			onSaved={(article) => {
				queryClient.invalidateQueries({ queryKey: ["articles"] });
				// slug is always set server-side (falls back to a slugified title)
				navigate({
					to: "/article-editor/$slug",
					params: { slug: article.slug as string },
					replace: true,
				});
			}}
		/>
	);
}
