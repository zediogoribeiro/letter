import { Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button, IconButton } from "../ui/button";
import { PencilSimpleLineIcon, SunIcon, MoonIcon } from "@phosphor-icons/react";
import { UserMenu } from "../user-menu";
import { sessionQueryOptions } from "@/lib/middleware";
import { useTheme } from "@/hooks/use-theme";

export function NavBar() {
	const { data: session, isPending } = useQuery(sessionQueryOptions());
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="h-(--navbar-height) sm:px-6 lg:px-8 sticky top-0 w-full border-b border-border">
			<div className="flex justify-between items-center h-full">
				<div className="flex justify-center items-center h-full gap-6">
					<span className="editorial-heading text-3xl tracking-tight transition-transform duration-700 hover:-translate-y-0.5">
						Letter
					</span>
					<nav className="hidden items-center gap-6 md:flex">
						<span>Marketing</span>
						<span>Design</span>
						<span>Engineering</span>
						<span>Product</span>
						<span>Culture</span>
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
						<>
							<Button asChild size="xs" variant="secondary">
								<Link to="/login">Sign in</Link>
							</Button>
							<Button asChild size="xs">
								<Link to="/signup">Get Started</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
