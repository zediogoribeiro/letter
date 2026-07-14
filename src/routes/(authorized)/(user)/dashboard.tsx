import { AccountTab } from "#/components/account-tab";
import { ArticlesTab } from "#/components/articles-tab";
import { Tabs } from "#/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authorized)/(user)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();
	const user = session.user;
	const isAdmin = user.role === "admin";

	return (
		<main className="flex-1">
			<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="mb-8 animate-fade-in-up">
					<p className="text-sm text-muted-foreground">Dashboard</p>
					<h1 className="editorial-heading mt-1 text-3xl sm:text-4xl">
						Welcome, {user.name.split(" ")[0]}
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						{isAdmin
							? "Manage articles and your account."
							: "Manage your account details."}
					</p>
				</div>
				<Tabs defaultIndex={0}>
					<Tabs.Items>
						{isAdmin && <Tabs.Item>Articles</Tabs.Item>}
						<Tabs.Item>Account</Tabs.Item>
					</Tabs.Items>

					<Tabs.Panels>
						{isAdmin && (
							<Tabs.Panel>
								<ArticlesTab />
							</Tabs.Panel>
						)}
						<Tabs.Panel>
							<AccountTab user={user} />
						</Tabs.Panel>
					</Tabs.Panels>
				</Tabs>
			</div>
		</main>
	);
}
