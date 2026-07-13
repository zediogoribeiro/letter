import { Link } from "@tanstack/react-router";
import { Divider } from "../ui/divider";

export const Footer = () => {
	return (
		<footer className="border-t border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center  ">
					<div className="flex flex-col gap-2">
						<Link to="/" className="editorial-heading text-2xl">
							Letter
						</Link>
						<p className="max-w-sm text-sm text-muted-foreground">
							A quiet space for thought-provoking stories and ideas worth
							sharing.
						</p>
					</div>
				</div>
				<Divider className="my-4 " />
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Letter News. All rights reserved.
					</p>
					<p className="text-sm text-muted-foreground">
						Crafted with care for readers who think slowly.
					</p>
				</div>
			</div>
		</footer>
	);
};
