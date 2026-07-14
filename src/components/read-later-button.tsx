import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sessionQueryOptions } from "@/lib/middleware";
import { readLaterIdsQueryOptions, toggleReadLaterFn } from "@/lib/read-later";

const useReadLater = (articleId: string) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: session } = useQuery(sessionQueryOptions());
	const { data: readLaterIds } = useQuery({
		...readLaterIdsQueryOptions(),
		enabled: !!session,
	});

	const saved = readLaterIds?.includes(articleId) ?? false;

	const mutation = useMutation({
		mutationFn: () => toggleReadLaterFn({ data: { articleId } }),
		onSuccess: ({ saved }) => {
			queryClient.invalidateQueries({ queryKey: ["read-later"] });
			toast.success(saved ? "Saved for later" : "Removed from read later");
		},
		onError: () => {
			toast.error("Error", {
				description: "Could not update your read later list.",
			});
		},
	});

	const toggle = () => {
		if (!session) {
			toast("Sign in to save articles for later");
			navigate({ to: "/login" });
			return;
		}

		mutation.mutate();
	};

	return { saved, isPending: mutation.isPending, toggle };
};

interface ReadLaterButtonProps {
	articleId: string;
	iconOnly?: boolean;
}

const ReadLaterButton = ({
	articleId,
	iconOnly = false,
}: ReadLaterButtonProps) => {
	const { saved, isPending, toggle } = useReadLater(articleId);

	if (iconOnly) {
		return (
			<Button
				variant="ghost"
				size="xs"
				className="px-2 text-muted-foreground"
				onClick={toggle}
				disabled={isPending}
				aria-label={saved ? "Remove from read later" : "Save for later"}
				aria-pressed={saved}
			>
				<BookmarkSimpleIcon size={16} weight={saved ? "fill" : "regular"} />
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			className="group gap-2 text-muted-foreground"
			onClick={toggle}
			disabled={isPending}
			aria-pressed={saved}
		>
			<BookmarkSimpleIcon
				weight={saved ? "fill" : "regular"}
				className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
			/>
			{saved ? "Saved" : "Save"}
		</Button>
	);
};

export { ReadLaterButton, useReadLater };
