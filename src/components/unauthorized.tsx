import { LockKeyIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Unauthorized = () => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center animate-fade-in-up">
			<div className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
				<LockKeyIcon size={28} />
			</div>
			<div className="space-y-2">
				<h1 className="editorial-heading text-4xl sm:text-5xl">
					Access denied
				</h1>
				<p className="max-w-sm text-muted-foreground">
					You're signed in, but you don't have permission to view this page.
				</p>
			</div>
			<Button asChild size="sm">
				<Link to="/dashboard">Back to dashboard</Link>
			</Button>
		</div>
	);
};
