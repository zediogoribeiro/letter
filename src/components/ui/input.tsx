import type { VariantProps } from "cva";
import { cn, cva } from "@/lib/utils/classnames";

const inputStyle = cva({
	base: [
		"w-full",
		"font-medium [&,&_*]:placeholder:text-muted-foreground",
		"outline-none",
		"transition",
		"flex items-center",
		"disabled:cursor-not-allowed disabled:opacity-50",
		"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
		"autofill:shadow-[inset_0_0_0_1000px_var(--color-background)]",
		"autofill:[-webkit-text-fill-color:var(--color-foreground)]",
	],
	variants: {
		variant: {
			primary:
				"bg-transparent text-base border border-input shadow-sm autofill:border-input",
		},
		size: {
			md: "h-9 rounded-md px-3 py-1 text-sm",
			lg: "h-12 rounded-md px-3 py-1 text-lg",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

export interface InputProps
	extends Omit<React.ComponentPropsWithRef<"input">, "size">,
		VariantProps<typeof inputStyle> {}

const Input = ({
	className,
	size = "md",
	variant = "primary",
	...props
}: InputProps) => {
	return (
		<input
			className={cn(
				inputStyle({
					className,
					variant,
					size,
				}),
			)}
			{...props}
		/>
	);
};

export { inputStyle, Input };
