import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const callbackURL = "/dashboard";

		await authClient.signUp.email({ name, email, password, callbackURL });
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input name="name" type="text" placeholder="Name" />
			<input name="email" type="email" placeholder="Email" />
			<input name="password" type="password" placeholder="Password" />
			<button type="submit">Sign up</button>
		</form>
	);
}
