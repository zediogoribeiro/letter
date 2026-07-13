import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AvatarUpload } from "@/components/avatar-upload";
import { authClient } from "@/lib/auth-client";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const accountSchema = z.object({
	name: z.string().min(1, "Name is required").max(80),
	image: z.string().url().or(z.literal("")).optional(),
});

type AccountValues = z.infer<typeof accountSchema>;

interface AccountTabProps {
	user: {
		name: string;
		email: string;
		role?: string | null;
		image?: string | null;
	};
}

export const AccountTab = ({ user }: AccountTabProps) => {
	const queryClient = useQueryClient();
	const [isAvatarUploading, setIsAvatarUploading] = useState(false);
	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AccountValues>({
		resolver: zodResolver(accountSchema),
		defaultValues: { name: user.name, image: user.image ?? undefined },
	});

	const onSubmit = async ({ name, image }: AccountValues) => {
		await authClient.updateUser(
			{ name, image: image === "" ? null : image },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["session"] });
					toast.success("Account updated", {
						description: "Your changes have been saved.",
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
						<Label htmlFor="avatar">Avatar</Label>
						<Controller
							control={control}
							name="image"
							render={({ field }) => (
								<AvatarUpload
									value={field.value}
									name={user.name}
									onChange={field.onChange}
									onUploadingChange={setIsAvatarUploading}
								/>
							)}
						/>
					</div>

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
						disabled={isAvatarUploading}
						className="w-fit justify-end"
					>
						Save changes
					</Button>
				</div>
			</form>
		</div>
	);
};
