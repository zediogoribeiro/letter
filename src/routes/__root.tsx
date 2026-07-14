import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { AppError } from "@/components/app-error";
import { Footer } from "@/components/globals/footer";
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
			{
				name: "description",
				content:
					"An editorial publishing platform — a magazine-style blog with articles on marketing, design, engineering, product, and culture.",
			},
			{
				name: "theme-color",
				content: "#faf9f5",
				media: "(prefers-color-scheme: light)",
			},
			{
				name: "theme-color",
				content: "#242230",
				media: "(prefers-color-scheme: dark)",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
			{
				rel: "icon",
				href: "/imgs/favicon.ico",
			},
		],
		scripts: [
			{
				children: themeInitScript,
			},
		],
	}),
	notFoundComponent: NotFound,
	errorComponent: AppError,
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
