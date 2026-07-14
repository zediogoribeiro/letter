import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(authorized)/(admin)")({
	beforeLoad: async ({ context }) => {
		if (context.session.user.role !== "admin") {
			throw redirect({ to: "/unauthorized" });
		}
	},
});
