import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const DIGITS = ["4", "0", "4"];

export const NotFound = () => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
			<div className="editorial-heading flex text-8xl tracking-tight sm:text-9xl">
				{DIGITS.map((digit, index) => (
					<span
						key={`${digit}-${index}`}
						className="animate-bounce-letter motion-reduce:animate-none"
						style={{ animationDelay: `${index * 150}ms` }}
					>
						{digit}
					</span>
				))}
			</div>
			<p className="max-w-sm text-muted-foreground">
				This page doesn't exist, or has wandered off somewhere else.
			</p>
			<Button asChild size="sm">
				<Link to="/">Back to feed</Link>
			</Button>
		</div>
	);
};
