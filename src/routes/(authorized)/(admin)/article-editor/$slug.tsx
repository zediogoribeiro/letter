import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArticleForm, type ArticleValues } from "@/components/article-form";
import { Skeleton } from "@/components/ui/skeleton";
import { articleBySlugQueryOptions } from "@/lib/articles";

export const Route = createFileRoute(
	"/(authorized)/(admin)/article-editor/$slug",
)({
	component: RouteComponent,
	pendingComponent: EditorPending,
	pendingMs: 0,
	pendingMinMs: 300,
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

function EditorPending() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<Skeleton className="h-9 w-48" />
					<Skeleton className="mt-2 h-5 w-64" />
				</div>
				<Skeleton className="h-9 w-24" />
			</div>
			<div className="space-y-8">
				<div className="space-y-2">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-11 w-full" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-20 w-full" />
				</div>
				<div className="grid gap-6 sm:grid-cols-2">
					<div className="space-y-2">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-9 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-9 w-full" />
					</div>
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="aspect-16/10 w-full rounded-lg" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-64 w-full" />
				</div>
			</div>
		</div>
	);
}

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
