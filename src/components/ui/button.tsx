import type { VariantProps } from "cva";
import { Slot, Slottable } from "@/components/ui/slot";
import { cn, cva } from "@/lib/utils/classnames";
import { Spinner } from "./spinner";

const buttonStyle = cva({
	base: [
		"relative inline-flex h-(--button-height) shrink-0 items-center justify-center",
		"transition duration-200 enabled:cursor-pointer disabled:opacity-40",
		"focus-visible:ring-(length:--ring-width) ring-ring focus-visible:outline-none",
	],
	variants: {
		variant: {
			primary:
				"bg-primary text-primary-foreground hover:bg-primary/90 [--button-text-color:var(--color-primary-foreground)]",
			secondary:
				"hover:bg-accent hover:text-accent-foreground [--button-text-color:var(--color-foreground)]",
			outline:
				"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground [--button-text-color:var(--color-foreground)]",
			ghost:
				"hover:bg-accent hover:text-accent-foreground active:bg-accent/90 [--button-text-color:var(--color-foreground)]",
		},
		size: {
			xs: "rounded-md px-3 text-xs [--button-height:--spacing(8)]",
			sm: "rounded-md px-4 text-sm",
			md: "rounded-md px-4 text-base [--button-height:--spacing(10)]",
		},
		active: {
			true: "bg-accent text-accent-foreground border-accent",
			false: "",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
		active: false,
	},
});

export interface ButtonProps
	extends React.ComponentPropsWithRef<"button">,
		VariantProps<typeof buttonStyle> {
	asChild?: boolean;
	isLoading?: boolean;
}

const CompoundButton = ({
	children,
	className,
	variant,
	asChild = false,
	isLoading,
	size = "md",
	active,
	type = "button",
	ref,
	...props
}: ButtonProps) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			className={cn(
				buttonStyle({
					className,
					variant,
					size,
					active,
				}),
				isLoading && "text-transparent transition-none",
			)}
			ref={ref}
			type={asChild ? undefined : type}
			aria-busy={isLoading}
			{...props}
			disabled={isLoading || props.disabled}
		>
			<Slottable asChild={asChild} child={children}>
				{(child) => (
					<>
						{child}
						{isLoading && (
							<span
								data-button-spinner
								aria-hidden="true"
								className={cn(
									"size-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
									"text-(--button-text-color)",
								)}
							>
								<Spinner size={size} />
							</span>
						)}
					</>
				)}
			</Slottable>
		</Comp>
	);
};

export interface IconButtonProps extends ButtonProps {
	"aria-label": string;
}

const IconButton = ({ ref, ...props }: IconButtonProps) => {
	return <CompoundButton {...props} ref={ref} />;
};

export { buttonStyle, CompoundButton as Button, IconButton };
