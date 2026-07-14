import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(authorized)/(admin)/article-editor")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex-1">
			<Outlet />
		</main>
	);
}
