import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { ContinueWithGoogle } from "#/components/continue-with-google";
import { toast } from "@/components/ui/toaster";

const loginSchema = z.object({
	email: z.email("Enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async ({ email, password }: LoginValues) => {
		await authClient.signIn.email(
			{ email, password },
			{
				onSuccess: () => {
					toast({
						title: "Welcome back",
						description: "You're signed in.",
						variant: "positive",
					});
					navigate({ to: "/dashboard" });
				},
				onError: (ctx) => {
					toast({
						title: "Error",
						description: ctx.error.message,
						variant: "negative",
					});
				},
			},
		);
	};

	return (
		<main className="flex flex-col flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-sm">
				<div className="text-center">
					<h1 className="editorial-heading text-3xl">Welcome back</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Sign in to continue reading and writing.
					</p>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-8 space-y-5"
					noValidate
				>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@company.com"
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-sm text-red-500">{errors.password.message}</p>
						)}
					</div>
					<Button
						type="submit"
						size="sm"
						className="w-full"
						isLoading={isSubmitting}
					>
						Sign in
					</Button>
				</form>
				<div className="mt-6">
					<ContinueWithGoogle />
				</div>
				<p className="mt-8 text-center text-sm text-muted-foreground">
					Don't have an account?{" "}
					<Link
						to="/signup"
						className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
					>
						Sign up
					</Link>
				</p>
			</div>
		</main>
	);
}
