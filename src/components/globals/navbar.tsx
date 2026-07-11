import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";

export function NavBar() {
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
				<div className="flex items-center gap-2">
					<Button size="xs" variant="secondary" className="flex gap-1 group">
						<PencilSimpleLineIcon
							size={16}
							className="transform duration-300 group-hover:-rotate-12"
						/>
						<span>Write</span>
					</Button>
					<Button asChild size="xs" variant="secondary">
						<Link to="/login">Sign in</Link>
					</Button>
					<Button asChild size="xs">
						<Link to="/signup">Get Started</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
