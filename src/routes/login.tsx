import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const callbackURL = "/dashboard";

		await authClient.signIn.email(
			{ email, password, callbackURL },
			{
				onSuccess: () => alert("sucesso singup"),
				onError: (ctx) => {
					alert(ctx.error.message);
				},
			},
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input name="email" type="email" placeholder="Email" />
			<input name="password" type="password" placeholder="Password" />
			<button type="submit">Log in</button>
		</form>
	);
}
