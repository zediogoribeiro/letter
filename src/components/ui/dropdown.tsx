import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn, cva } from "@/lib/utils/classnames";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const contentStyle = cva({
	base: [
		"z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
		"origin-(--radix-dropdown-menu-content-transform-origin)",
	],
});

const DropdownMenuContent = ({
	className,
	sideOffset = 4,
	...props
}: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Content>) => {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				sideOffset={sideOffset}
				className={cn(contentStyle({ className }))}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	);
};

const itemStyle = cva({
	base: "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
});

const DropdownMenuItem = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Item>) => {
	return (
		<DropdownMenuPrimitive.Item
			className={cn(itemStyle({ className }))}
			{...props}
		/>
	);
};

const DropdownMenuLabel = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Label>) => {
	return (
		<DropdownMenuPrimitive.Label
			className={cn("px-2 py-1.5 text-sm font-semibold", className)}
			{...props}
		/>
	);
};

const DropdownMenuSeparator = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Separator>) => {
	return (
		<DropdownMenuPrimitive.Separator
			className={cn("-mx-1 my-1 h-px bg-muted", className)}
			{...props}
		/>
	);
};

const CompoundDropdownMenu = Object.assign(DropdownMenu, {
	Trigger: DropdownMenuTrigger,
	Content: DropdownMenuContent,
	Item: DropdownMenuItem,
	Label: DropdownMenuLabel,
	Separator: DropdownMenuSeparator,
});

export { CompoundDropdownMenu as DropdownMenu };
