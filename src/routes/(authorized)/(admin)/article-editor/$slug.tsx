import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArticleForm, type ArticleValues } from "@/components/article-form";
import { articleBySlugQueryOptions } from "@/lib/articles";

export const Route = createFileRoute(
	"/(authorized)/(admin)/article-editor/$slug",
)({
	component: RouteComponent,
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(articleBySlugQueryOptions(params.slug)),
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `Edit "${loaderData.title}" — Letter`
					: "Edit article — Letter",
			},
		],
	}),
});

function RouteComponent() {
	const { slug } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: article } = useSuspenseQuery(articleBySlugQueryOptions(slug));

	return (
		<ArticleForm
			articleId={article.id}
			defaultValues={{
				status: article.status as ArticleValues["status"],
				title: article.title,
				slug: article.slug ?? undefined,
				category: (article.category ?? undefined) as ArticleValues["category"],
				description: article.description ?? undefined,
				coverImage: article.coverImage ?? undefined,
				content: article.content as ArticleValues["content"],
			}}
			onSaved={(saved) => {
				queryClient.invalidateQueries({ queryKey: ["articles"] });
				if (saved.slug && saved.slug !== slug) {
					navigate({
						to: "/article-editor/$slug",
						params: { slug: saved.slug },
						replace: true,
					});
				} else {
					queryClient.invalidateQueries({
						queryKey: ["articles", "slug", slug],
					});
				}
			}}
		/>
	);
}
