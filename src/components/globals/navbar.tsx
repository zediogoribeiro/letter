import { Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button, IconButton } from "../ui/button";
import {
	PencilSimpleLineIcon,
	SunIcon,
	MoonIcon,
	ListIcon,
} from "@phosphor-icons/react";
import { UserMenu } from "../user-menu";
import { sessionQueryOptions } from "@/lib/middleware";
import { useTheme } from "@/hooks/use-theme";
import { CATEGORIES, CATEGORY_PATHS } from "@/lib/categories";
import { Drawer } from "../ui/drawer";

export function NavBar() {
	const { data: session, isPending } = useQuery(sessionQueryOptions());
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="h-(--navbar-height) animate-fade-in sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-6">
					<Link to="/" className="group flex items-center gap-2">
						<span className="editorial-heading text-2xl tracking-tight transition-transform duration-300 group-hover:-translate-y-px">
							Letter
						</span>
					</Link>
					<nav className="hidden items-center gap-1 md:flex">
						{CATEGORIES.map((category) => (
							<Link
								key={category}
								to={CATEGORY_PATHS[category]}
								className="nav-underline rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								<span>{category}</span>
							</Link>
						))}
					</nav>
				</div>
				<div className="flex items-center">
					<IconButton
						size="xs"
						variant="secondary"
						aria-label={
							theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
						}
						onClick={toggleTheme}
					>
						{theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
					</IconButton>
					{isPending ? null : session ? (
						<>
							<Button
								size="xs"
								variant="secondary"
								className="flex gap-1 group"
								asChild
							>
								<Link to="/article-editor">
									<PencilSimpleLineIcon
										size={16}
										className="transform duration-300 group-hover:-rotate-12"
									/>
									<span>Write</span>
								</Link>
							</Button>
							<UserMenu />
						</>
					) : (
						<div className="flex gap-1.5">
							<Button asChild size="xs" variant="secondary">
								<Link to="/login">Sign in</Link>
							</Button>
							<Button asChild size="xs">
								<Link to="/signup">Get Started</Link>
							</Button>
						</div>
					)}
					<Drawer>
						<Drawer.Trigger asChild>
							<Button
								size="xs"
								variant="secondary"
								className="ml-1.5 md:hidden"
								aria-label="Open menu"
							>
								<ListIcon size={16} />
							</Button>
						</Drawer.Trigger>
						<Drawer.Content>
							<Drawer.Header className="sr-only">
								<Drawer.Title>Menu</Drawer.Title>
							</Drawer.Header>
							<nav className="flex flex-col p-4 pt-14">
								{CATEGORIES.map((category) => (
									<Drawer.Close key={category} asChild>
										<Link
											to={CATEGORY_PATHS[category]}
											className="rounded-md px-3 py-3 text-lg font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
										>
											{category}
										</Link>
									</Drawer.Close>
								))}
							</nav>
						</Drawer.Content>
					</Drawer>
				</div>
			</div>
		</header>
	);
}
