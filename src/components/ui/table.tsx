import { cn } from "@/lib/utils/classnames";

const Table = ({
	className,
	...props
}: React.ComponentPropsWithRef<"table">) => {
	return (
		<div className="overflow-x-auto">
			<table className={cn("w-full text-sm", className)} {...props} />
		</div>
	);
};

const TableHead = ({
	className,
	...props
}: React.ComponentPropsWithRef<"thead">) => {
	return (
		<thead
			className={cn(
				"bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
};

const TableBody = ({
	className,
	...props
}: React.ComponentPropsWithRef<"tbody">) => {
	return (
		<tbody className={cn("divide-y divide-border", className)} {...props} />
	);
};

const TableRow = ({
	className,
	onClick,
	...props
}: React.ComponentPropsWithRef<"tr">) => {
	return (
		<tr
			onClick={onClick}
			className={cn(
				onClick && "cursor-pointer transition-colors hover:bg-muted/30",
				className,
			)}
			{...props}
		/>
	);
};

const TableHeadCell = ({
	className,
	...props
}: React.ComponentPropsWithRef<"th">) => {
	return <th className={cn("px-4 py-3 font-medium", className)} {...props} />;
};

const TableCell = ({
	className,
	...props
}: React.ComponentPropsWithRef<"td">) => {
	return <td className={cn("px-4 py-3", className)} {...props} />;
};

const CompoundTable = Object.assign(Table, {
	Head: TableHead,
	Body: TableBody,
	Row: TableRow,
	HeadCell: TableHeadCell,
	Cell: TableCell,
});

export { CompoundTable as Table };
