import { MotionConfig, motion } from "motion/react";
import { Children, createContext, use, useId, useState } from "react";
import { Slot } from "@/components/ui/slot";
import { cn } from "@/lib/utils/classnames";

interface TabsContextValue {
	tabsId: string;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
	const context = use(TabsContext);
	if (!context) throw new Error("Tabs.* must be used within a Tabs component");
	return context;
};

let tabsInstanceCounter = 0;

export interface TabsProps
	extends Omit<React.ComponentPropsWithRef<"div">, "onChange"> {
	defaultIndex?: number;
	selectedIndex?: number;
	onChange?: (index: number) => void;
	children: React.ReactNode;
}

const Tabs = ({
	defaultIndex = 0,
	selectedIndex: selectedIndexProp,
	onChange,
	children,
	...props
}: TabsProps) => {
	const reactId = useId();
	const [tabsId] = useState(() => `${reactId}-${++tabsInstanceCounter}`);
	const [internalIndex, setInternalIndex] = useState(defaultIndex);

	const selectedIndex = selectedIndexProp ?? internalIndex;

	const setSelectedIndex = (index: number) => {
		setInternalIndex(index);
		onChange?.(index);
	};

	return (
		<TabsContext value={{ tabsId, selectedIndex, setSelectedIndex }}>
			<MotionConfig reducedMotion="user">
				<div {...props}>{children}</div>
			</MotionConfig>
		</TabsContext>
	);
};

const ItemIndexContext = createContext(0);

export interface TabsItemsProps
	extends Omit<React.ComponentPropsWithRef<"div">, "role"> {
	children: React.ReactNode;
}

const TabsItems = ({ children, className, ...props }: TabsItemsProps) => {
	return (
		<div
			role="tablist"
			className={cn("flex items-center gap-1.5 pb-4", className)}
			{...props}
		>
			{Children.toArray(children).map((child, index) => (
				<ItemIndexContext key={index} value={index}>
					{child}
				</ItemIndexContext>
			))}
		</div>
	);
};

export interface TabsItemProps
	extends Omit<React.ComponentPropsWithRef<"button">, "type"> {
	children: React.ReactNode;
	asChild?: boolean;
}

const TabsItem = ({
	children,
	asChild,
	onClick,
	className,
	...props
}: TabsItemProps) => {
	const index = use(ItemIndexContext);
	const { tabsId, selectedIndex, setSelectedIndex } = useTabsContext();
	const isSelected = index === selectedIndex;
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			id={`${tabsId}-tab-${index}`}
			type={asChild ? undefined : "button"}
			role="tab"
			aria-selected={isSelected}
			aria-controls={`${tabsId}-panel-${index}`}
			data-selected={isSelected || undefined}
			className={cn(
				"relative flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-foreground/50 outline-none transition hover:text-foreground data-selected:text-foreground",
				"focus-visible:ring-(length:--ring-width) ring-ring",
				"[&>*:not([data-tab-indicator])]:z-10",
				className,
			)}
			onClick={(e) => {
				onClick?.(e);

				if (!e.defaultPrevented) {
					setSelectedIndex(index);
				}
			}}
			{...props}
		>
			{typeof children === "string" ? <span>{children}</span> : children}
			{isSelected && (
				<motion.span
					data-tab-indicator="true"
					layoutId={tabsId}
					aria-hidden="true"
					className="absolute inset-0 z-0 rounded-xl bg-muted"
					transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
				/>
			)}
		</Comp>
	);
};

const PanelIndexContext = createContext(0);

export interface TabsPanelsProps
	extends Omit<React.ComponentPropsWithRef<"div">, "role"> {
	children: React.ReactNode;
}

const TabsPanels = ({ children, className, ...props }: TabsPanelsProps) => {
	return (
		<div className={className} {...props}>
			{Children.toArray(children).map((child, index) => (
				<PanelIndexContext key={index} value={index}>
					{child}
				</PanelIndexContext>
			))}
		</div>
	);
};

export interface TabsPanelProps extends React.ComponentPropsWithRef<"div"> {
	children: React.ReactNode;
	asChild?: boolean;
}

const TabsPanel = ({
	children,
	asChild,
	className,
	...props
}: TabsPanelProps) => {
	const index = use(PanelIndexContext);
	const { tabsId, selectedIndex } = useTabsContext();
	const isSelected = index === selectedIndex;
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			id={`${tabsId}-panel-${index}`}
			role="tabpanel"
			aria-labelledby={`${tabsId}-tab-${index}`}
			aria-hidden={!isSelected}
			className={cn("outline-none", className)}
			{...props}
		>
			{isSelected ? children : null}
		</Comp>
	);
};

const CompoundTabs = Object.assign(Tabs, {
	Items: TabsItems,
	Item: TabsItem,
	Panels: TabsPanels,
	Panel: TabsPanel,
});

export { CompoundTabs as Tabs };
