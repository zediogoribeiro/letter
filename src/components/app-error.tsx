import { WarningIcon } from "@phosphor-icons/react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const AppError = ({ error, reset }: ErrorComponentProps) => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center animate-fade-in-up">
			<div className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
				<WarningIcon size={28} />
			</div>
			<div className="space-y-2">
				<h1 className="editorial-heading text-4xl sm:text-5xl">
					Something went wrong
				</h1>
				<p className="max-w-sm text-muted-foreground">
					{error.message || "An unexpected error occurred."}
				</p>
			</div>
			<div className="flex items-center gap-3">
				<Button size="sm" variant="outline" onClick={reset}>
					Try again
				</Button>
				<Button asChild size="sm">
					<Link to="/">Back to feed</Link>
				</Button>
			</div>
		</div>
	);
};
