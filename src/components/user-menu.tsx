import {
	BookmarkSimpleIcon,
	LayoutIcon,
	SignOutIcon,
} from "@phosphor-icons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown";
import { authClient } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/middleware";
import { readLaterIdsQueryOptions } from "@/lib/read-later";

function UserMenu() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: session } = useQuery(sessionQueryOptions());
	const { data: readLaterIds } = useQuery({
		...readLaterIdsQueryOptions(),
		enabled: !!session,
	});

	const hasUnread = (readLaterIds?.length ?? 0) > 0;

	const handleSignOut = async () => {
		await authClient.signOut();
		await queryClient.invalidateQueries({ queryKey: ["session"] });
		navigate({ to: "/" });
	};

	if (!session) return null;

	return (
		<DropdownMenu>
			<DropdownMenu.Trigger asChild className="cursor-pointer ml-2">
				<Avatar size="sm">
					{session.user.image ? (
						<Avatar.Image src={session.user.image} />
					) : (
						<Avatar.Fallback>{session.user.name}</Avatar.Fallback>
					)}
				</Avatar>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content align="end">
				<DropdownMenu.Label className="flex flex-col gap-0.5">
					<span className="text-sm font-medium">{session.user.name}</span>
					<span className="text-xs font-normal text-muted-foreground">
						{session.user.email}
					</span>
					<span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
						{session.user.role}
					</span>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onSelect={() => navigate({ to: "/dashboard" })}>
					<LayoutIcon />
					Dashboard
				</DropdownMenu.Item>
				<DropdownMenu.Item onSelect={() => navigate({ to: "/read-later" })}>
					<BookmarkSimpleIcon />
					Read later
					{hasUnread && (
						<span className="ml-auto size-1.5 rounded-full bg-primary" />
					)}
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					onSelect={handleSignOut}
					className="cursor-pointer gap-2 text-destructive focus:text-destructive"
				>
					<SignOutIcon />
					Sign out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu>
	);
}

export { UserMenu };
