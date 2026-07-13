import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { Footer } from "#/components/globals/footer";
import { NavBar } from "@/components/globals/navbar";
import { NotFound } from "@/components/not-found";
import { useTheme } from "@/hooks/use-theme";
import { sessionQueryOptions } from "@/lib/middleware";
import appCss from "../styles/app.css?url";

const themeInitScript = `
(function () {
  var stored = localStorage.getItem('theme')
  var theme = stored === 'dark' || stored === 'light'
    ? stored
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  document.documentElement.dataset.theme = theme
})()
`;

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	beforeLoad: async ({ context }) => {
		const session = await context.queryClient.ensureQueryData(
			sessionQueryOptions(),
		);
		return { session };
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Letter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
		scripts: [
			{
				children: themeInitScript,
			},
		],
	}),
	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();

	return (
		<html lang="en" data-theme="light" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="flex min-h-screen flex-col">
				<NavBar />
				{children}
				<Footer />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Toaster theme={theme} richColors />
				<Scripts />
			</body>
		</html>
	);
}
