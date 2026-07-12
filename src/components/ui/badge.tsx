import type { VariantProps } from "cva";
import { cn, cva } from "@/lib/utils/classnames";

const badgeStyle = cva({
	base: "inline-flex items-center gap-1 rounded-md border font-semibold leading-none transition-colors",
	variants: {
		variant: {
			default: "border-transparent bg-primary text-primary-foreground",
			secondary: "border-transparent bg-secondary text-secondary-foreground",
			destructive:
				"border-transparent bg-destructive text-destructive-foreground",
			outline: "text-foreground",
		},
		size: {
			md: "h-6 px-2.5 text-sm",
			sm: "h-5 px-2 text-xs",
			xs: "h-4 px-2 text-xs",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

export interface BadgeProps extends React.ComponentPropsWithRef<"div"> {
	variant?: VariantProps<typeof badgeStyle>["variant"];
	size?: VariantProps<typeof badgeStyle>["size"];
}

const Badge = ({
	children,
	variant = "default",
	size = "md",
	className,
	...props
}: BadgeProps) => {
	return (
		<div className={cn(badgeStyle({ variant, size }), className)} {...props}>
			{children}
		</div>
	);
};

export { Badge };
