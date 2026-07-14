import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(authorized)")({
	beforeLoad: async ({ context }) => {
		if (!context.session) {
			throw redirect({ to: "/login" });
		}

		return { session: context.session };
	},
});
