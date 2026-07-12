import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const accountSchema = z.object({
	name: z.string().min(1, "Name is required").max(80),
});

type AccountValues = z.infer<typeof accountSchema>;

interface AccountTabProps {
	user: {
		name: string;
		email: string;
		role?: string | null;
	};
}

export const AccountTab = ({ user }: AccountTabProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AccountValues>({
		resolver: zodResolver(accountSchema),
		defaultValues: { name: user.name },
	});

	const onSubmit = async ({ name }: AccountValues) => {
		await authClient.updateUser(
			{ name },
			{
				onSuccess: () => {
					toast.success("Account updated", {
						description: "Your display name has been changed.",
					});
				},
				onError: (ctx) => {
					toast.error("Error", {
						description: ctx.error.message,
					});
				},
			},
		);
	};

	return (
		<div className="rounded-lg border border-border bg-card p-6 sm:p-8">
			<h2 className="editorial-heading text-xl">Account</h2>
			<p className="mt-1 text-sm text-muted-foreground">Update your name.</p>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mt-6 space-y-6"
				noValidate
			>
				<div className="flex flex-col gap-5 sm:max-w-md">
					<div className="grid gap-2 sm:max-w-md">
						<Label htmlFor="name">Display name</Label>
						<Input id="name" maxLength={80} {...register("name")} />
						{errors.name && (
							<p className="text-sm font-medium text-destructive/70">
								{errors.name.message}
							</p>
						)}
					</div>

					<div className="grid gap-2 sm:max-w-md">
						<Label htmlFor="email">Email</Label>
						<Input id="email" value={user.email} disabled />
						<p className="text-xs text-muted-foreground">
							Email cannot be changed.
						</p>
					</div>

					<div className="grid gap-2 sm:max-w-md">
						<Label htmlFor="role">Role</Label>
						<div>
							<Badge id="role" size="sm" variant="secondary">
								{user.role === "admin" ? "Admin" : "Member"}
							</Badge>
						</div>
					</div>

					<Button
						type="submit"
						variant="outline"
						size="sm"
						isLoading={isSubmitting}
						className="w-fit justify-end"
					>
						Save changes
					</Button>
				</div>
			</form>
		</div>
	);
};
