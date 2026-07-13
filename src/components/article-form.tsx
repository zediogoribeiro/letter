import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "@phosphor-icons/react";
import type { JSONContent } from "@tiptap/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CoverImageUpload } from "@/components/cover-image-upload";
import RichTextEditor from "@/components/rich-text/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/text-area";
import { saveArticleFn, updateArticleFn } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";

const articleSchema = z
	.object({
		status: z.enum(["draft", "published"]),
		title: z.string().min(1, "Title is required").max(120),
		slug: z.string().optional(),
		category: z.enum(CATEGORIES).optional(),
		description: z.string().max(280, "Keep it under 280 characters").optional(),
		coverImage: z.string().url().or(z.literal("")).optional(),
		content: z.custom<JSONContent>().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.status !== "published") {
			return;
		}

		if (!data.slug) {
			ctx.addIssue({
				code: "custom",
				path: ["slug"],
				message: "Slug is required",
			});
		} else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
			ctx.addIssue({
				code: "custom",
				path: ["slug"],
				message: "Use lowercase letters, numbers and hyphens",
			});
		}

		if (!data.category) {
			ctx.addIssue({
				code: "custom",
				path: ["category"],
				message: "Select a category",
			});
		}

		if (!data.description) {
			ctx.addIssue({
				code: "custom",
				path: ["description"],
				message: "Description is required",
			});
		}

		if (!data.content) {
			ctx.addIssue({
				code: "custom",
				path: ["content"],
				message: "Content is required",
			});
		}
	});

export type ArticleValues = z.infer<typeof articleSchema>;

export interface SavedArticle {
	id: string;
	slug: string | null;
}

interface ArticleFormProps {
	articleId?: string;
	defaultValues?: Partial<ArticleValues>;
	onSaved?: (article: SavedArticle) => void;
}

export const ArticleForm = ({
	articleId,
	defaultValues,
	onSaved,
}: ArticleFormProps) => {
	const [isSavingDraft, setIsSavingDraft] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm<ArticleValues>({
		resolver: zodResolver(articleSchema),
		defaultValues: { status: "draft", ...defaultValues },
	});

	const onSubmit = async (values: ArticleValues) => {
		const payload = {
			status: values.status,
			title: values.title,
			slug: values.slug,
			category: values.category,
			description: values.description,
			coverImage: values.coverImage || undefined,
			content: values.content,
		};

		const article = articleId
			? await updateArticleFn({ data: { id: articleId, ...payload } })
			: await saveArticleFn({ data: payload });

		toast.success(
			values.status === "draft" ? "Draft saved" : "Article published",
			{ description: values.title },
		);
		onSaved?.(article);
	};

	const saveDraft = async () => {
		setValue("status", "draft");
		setIsSavingDraft(true);
		try {
			await handleSubmit(onSubmit)();
		} finally {
			setIsSavingDraft(false);
		}
	};

	const publish = async () => {
		setValue("status", "published");
		setIsPublishing(true);
		try {
			await handleSubmit(onSubmit)();
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="editorial-heading text-3xl sm:text-4xl">
						Write a story
					</h1>
					<p className="mt-2 text-muted-foreground">
						Share something worth reading.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button type="button" variant="outline" className="gap-2">
						<EyeIcon />
						<span>Preview</span>
					</Button>
				</div>
			</div>
			<form
				id="article-form"
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-8"
				noValidate
			>
				<div className="space-y-2">
					<Label htmlFor="title">Title</Label>
					<Input
						id="title"
						size="lg"
						placeholder="The quiet shift in product teams"
						{...register("title")}
					/>
					{errors.title && (
						<p className="text-sm font-medium text-destructive/70">
							{errors.title.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						placeholder="A one-sentence preview of what the reader will learn."
						{...register("description")}
					/>
					{errors.description && (
						<p className="text-sm font-medium text-destructive/70">
							{errors.description.message}
						</p>
					)}
				</div>

				<div className="grid gap-6 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="slug">Slug</Label>
						<Input
							id="slug"
							placeholder="A path to reach your article"
							{...register("slug")}
						/>
						{errors.slug && (
							<p className="text-sm font-medium text-destructive/70">
								{errors.slug.message}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Controller
							control={control}
							name="category"
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<Select.Trigger id="category">
										<Select.Value placeholder="Select a category" />
									</Select.Trigger>
									<Select.Content>
										{CATEGORIES.map((category) => (
											<Select.Item key={category} value={category}>
												{category}
											</Select.Item>
										))}
									</Select.Content>
								</Select>
							)}
						/>
						{errors.category && (
							<p className="text-sm font-medium text-destructive/70">
								{errors.category.message}
							</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="cover-image">Cover image</Label>
					<Controller
						control={control}
						name="coverImage"
						render={({ field }) => (
							<CoverImageUpload value={field.value} onChange={field.onChange} />
						)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="content">Content</Label>
					<Controller
						control={control}
						name="content"
						render={({ field }) => (
							<RichTextEditor
								content={defaultValues?.content}
								onChange={field.onChange}
							/>
						)}
					/>
					{errors.content && (
						<p className="text-sm font-medium text-destructive/70">
							{String(errors.content.message)}
						</p>
					)}
				</div>

				<div className="flex items-center justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						isLoading={isSavingDraft}
						disabled={isPublishing}
						onClick={saveDraft}
					>
						Save draft
					</Button>
					<Button
						type="button"
						isLoading={isPublishing}
						disabled={isSavingDraft}
						onClick={publish}
					>
						Publish article
					</Button>
				</div>
			</form>
		</div>
	);
};
