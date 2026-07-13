import {
	CheckCircleIcon,
	DotsThreeVerticalIcon,
	PencilSimpleIcon,
	TrashIcon,
	XIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";
import {
	articlesQueryOptions,
	deleteArticleFn,
	updateArticleStatusFn,
} from "@/lib/articles";

const formatDate = (date: string | Date) =>
	new Date(date).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

export const ArticlesTab = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: articles, isPending } = useQuery(articlesQueryOptions());

	const { mutate: setStatus } = useMutation({
		mutationFn: (variables: { id: string; status: "draft" | "published" }) =>
			updateArticleStatusFn({ data: variables }),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["articles"] });
			toast.success(
				variables.status === "published"
					? "Article published"
					: "Moved to draft",
			);
		},
	});

	const { mutate: deleteArticle } = useMutation({
		mutationFn: (variables: { id: string; title: string }) =>
			deleteArticleFn({ data: { id: variables.id } }),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["articles"] });
			toast.success("Article deleted", { description: variables.title });
		},
	});

	const filtered = articles ?? [];

	return (
		<div className="rounded-lg border border-border bg-card shadow-sm">
			<Table>
				<Table.Head>
					<Table.Row>
						<Table.HeadCell>Title</Table.HeadCell>
						<Table.HeadCell className="hidden sm:table-cell">
							Category
						</Table.HeadCell>
						<Table.HeadCell className="hidden md:table-cell">
							Date
						</Table.HeadCell>
						<Table.HeadCell>Status</Table.HeadCell>
						<Table.HeadCell className="text-right">Actions</Table.HeadCell>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					{isPending &&
						Array.from({ length: 3 }).map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
							<Table.Row key={index}>
								<Table.Cell colSpan={5}>
									<Skeleton className="h-5 w-full" />
								</Table.Cell>
							</Table.Row>
						))}

					{!isPending && filtered.length === 0 && (
						<Table.Row>
							<Table.Cell
								colSpan={5}
								className="py-8 text-center text-muted-foreground"
							>
								No articles found.
							</Table.Cell>
						</Table.Row>
					)}

					{filtered.map((article) => (
						<Table.Row
							key={article.id}
							onClick={() =>
								navigate({
									to: "/article-editor/$slug",
									// slug is always set server-side (falls back to a slugified title)
									params: { slug: article.slug as string },
								})
							}
						>
							<Table.Cell>
								<div className="font-medium text-foreground">
									{article.title || (
										<span className="text-muted-foreground">Untitled</span>
									)}
								</div>
								<div className="text-xs text-muted-foreground">
									by {article.author.name}
								</div>
							</Table.Cell>
							<Table.Cell className="hidden text-muted-foreground sm:table-cell">
								{article.category ?? "—"}
							</Table.Cell>
							<Table.Cell className="hidden text-muted-foreground md:table-cell">
								{formatDate(article.createdAt)}
							</Table.Cell>
							<Table.Cell>
								<Badge
									variant={
										article.status === "published" ? "default" : "secondary"
									}
									className="capitalize"
								>
									{article.status}
								</Badge>
							</Table.Cell>
							<Table.Cell
								className="text-right"
								onClick={(e) => e.stopPropagation()}
							>
								<DropdownMenu>
									<DropdownMenu.Trigger asChild>
										<Button size="xs" variant="ghost">
											<DotsThreeVerticalIcon className="h-4 w-4" />
											<span className="sr-only">Actions</span>
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										{article.status === "draft" && (
											<DropdownMenu.Item
												className="gap-2"
												onSelect={() =>
													setStatus({ id: article.id, status: "published" })
												}
											>
												<CheckCircleIcon className="h-4 w-4" />
												Publish
											</DropdownMenu.Item>
										)}
										{article.status === "published" && (
											<DropdownMenu.Item
												className="gap-2"
												onSelect={() =>
													setStatus({ id: article.id, status: "draft" })
												}
											>
												<XIcon className="h-4 w-4" />
												Unpublish
											</DropdownMenu.Item>
										)}
										<DropdownMenu.Item
											className="gap-2"
											onSelect={() =>
												navigate({
													to: "/article-editor/$slug",
													params: { slug: article.slug as string },
												})
											}
										>
											<PencilSimpleIcon className="h-4 w-4" />
											Edit
										</DropdownMenu.Item>
										<DropdownMenu.Separator />
										<DropdownMenu.Item
											className="gap-2 text-destructive focus:text-destructive"
											onSelect={() =>
												deleteArticle({ id: article.id, title: article.title })
											}
										>
											<TrashIcon className="h-4 w-4" />
											Delete
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</div>
	);
};
