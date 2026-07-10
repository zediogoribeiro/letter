import { getSessionFn } from "@/lib/middleware";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getSessionFn();
		if (!session) {
			throw redirect({ to: "/login" });
		}

		return { session };
	},
});

function RouteComponent() {
	return <div>Hello "/dashboar"!</div>;
}
