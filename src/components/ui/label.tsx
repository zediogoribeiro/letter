import { cn, cva } from "@/lib/utils/classnames";

const labelStyle = cva({
	base: ["text-sm font-medium leading-none"],
});

interface LabelProps extends React.ComponentPropsWithRef<"label"> {
	htmlFor: string;
	children: React.ReactNode;
}

const Label = ({ className, htmlFor, children, ...props }: LabelProps) => {
	return (
		<label
			htmlFor={htmlFor}
			className={cn(labelStyle({ className }))}
			{...props}
		>
			{children}
		</label>
	);
};

export { Label };
