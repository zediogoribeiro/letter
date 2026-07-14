import { EnvelopeIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";

export const Newsletter = () => {
	return (
		<div className="warm-surface animate-fade-in-up rounded-lg p-6 transition-shadow duration-300 hover:shadow-md">
			<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background transition-transform duration-500 hover:rotate-6">
				<EnvelopeIcon size={24} />
			</div>
			<h3 className="editorial-subheading text-xl">The Weekly Scroll</h3>
			<p className="body-text mt-2 text-sm text-muted-foreground">
				A curated selection of the best stories, delivered every Sunday.
			</p>
			<div className="mt-4 flex flex-col gap-2">
				<input
					type="email"
					placeholder="your@email.com"
					className="rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
				/>
				<Button className="w-full bg-primary text-primary-foreground transition-transform duration-200 hover:bg-primary/90 active:scale-[0.98]">
					Subscribe
				</Button>
			</div>
			<p className="mt-3 text-xs text-muted-foreground">
				No spam. Unsubscribe anytime.
			</p>
		</div>
	);
};
