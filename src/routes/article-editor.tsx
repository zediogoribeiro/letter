import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/article-editor")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.session) {
			throw redirect({ to: "/login" });
		}

		if (context.session.user.role !== "admin") {
			throw redirect({ to: "/dashboard" });
		}

		return { session: context.session };
	},
});

function RouteComponent() {
	return (
		<main className="flex-1">
			<Outlet />
		</main>
	);
}
