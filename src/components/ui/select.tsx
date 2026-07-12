import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn, cva } from "@/lib/utils/classnames";
import { inputStyle } from "./input";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const triggerStyle = cva({
	base: ["justify-between gap-2 data-[placeholder]:text-muted-foreground"],
});

const SelectTrigger = ({
	className,
	children,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Trigger>) => {
	return (
		<SelectPrimitive.Trigger
			className={cn(inputStyle({ className: triggerStyle({ className }) }))}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<CaretDownIcon size={14} className="shrink-0 opacity-50" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
};

const contentStyle = cva({
	base: [
		"z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
		"origin-(--radix-select-content-transform-origin)",
	],
});

const SelectContent = ({
	className,
	children,
	position = "popper",
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Content>) => {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				position={position}
				className={cn(contentStyle({ className }))}
				{...props}
			>
				<SelectPrimitive.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							"w-full min-w-(--radix-select-trigger-width)",
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
};

const itemStyle = cva({
	base: "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
});

const SelectItem = ({
	className,
	children,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Item>) => {
	return (
		<SelectPrimitive.Item className={cn(itemStyle({ className }))} {...props}>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
				<CheckIcon size={14} />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
};

const SelectLabel = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Label>) => {
	return (
		<SelectPrimitive.Label
			className={cn("px-2 py-1.5 text-sm font-semibold", className)}
			{...props}
		/>
	);
};

const SelectSeparator = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Separator>) => {
	return (
		<SelectPrimitive.Separator
			className={cn("-mx-1 my-1 h-px bg-muted", className)}
			{...props}
		/>
	);
};

const CompoundSelect = Object.assign(Select, {
	Group: SelectGroup,
	Value: SelectValue,
	Trigger: SelectTrigger,
	Content: SelectContent,
	Item: SelectItem,
	Label: SelectLabel,
	Separator: SelectSeparator,
});

export { CompoundSelect as Select };
