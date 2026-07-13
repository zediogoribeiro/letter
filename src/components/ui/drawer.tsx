import { XIcon } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn, cva } from "@/lib/utils/classnames";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

const DrawerOverlay = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>) => {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				"fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
				className,
			)}
			{...props}
		/>
	);
};

const contentStyle = cva({
	base: [
		"fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-popover text-popover-foreground shadow-lg outline-none",
		"data-[state=closed]:animate-slide-out-to-right data-[state=open]:animate-slide-in-from-right",
	],
});

const DrawerContent = ({
	className,
	children,
	...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) => {
	return (
		<DialogPrimitive.Portal>
			<DrawerOverlay />
			<DialogPrimitive.Content
				className={cn(contentStyle({ className }))}
				{...props}
			>
				{children}
				<DrawerClose
					aria-label="Close"
					className="absolute right-4 top-4 rounded-md opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:ring-(length:--ring-width) ring-ring"
				>
					<XIcon size={16} />
				</DrawerClose>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	);
};

const DrawerHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
	return (
		<div className={cn("flex flex-col gap-1 p-4 pr-10", className)} {...props} />
	);
};

const DrawerTitle = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Title>) => {
	return (
		<DialogPrimitive.Title
			className={cn("text-lg font-semibold", className)}
			{...props}
		/>
	);
};

const DrawerDescription = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Description>) => {
	return (
		<DialogPrimitive.Description
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
};

const CompoundDrawer = Object.assign(Drawer, {
	Trigger: DrawerTrigger,
	Content: DrawerContent,
	Header: DrawerHeader,
	Title: DrawerTitle,
	Description: DrawerDescription,
	Close: DrawerClose,
});

export { CompoundDrawer as Drawer };
