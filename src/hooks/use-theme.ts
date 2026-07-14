import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
	return (document.documentElement.dataset.theme as Theme) ?? "light";
}

function getServerSnapshot(): Theme {
	return "light";
}

function applyTheme(theme: Theme) {
	document.documentElement.dataset.theme = theme;
	try {
		localStorage.setItem("theme", theme);
	} catch {
		// localStorage can throw in private browsing; the theme still applies.
	}
	for (const listener of listeners) {
		listener();
	}
}

function setTheme(theme: Theme) {
	if (theme === getSnapshot()) return;
	// Cross-fade the whole page (duration set on ::view-transition-* in app.css).
	if (document.startViewTransition) {
		document.startViewTransition(() => applyTheme(theme));
	} else {
		applyTheme(theme);
	}
}

export function useTheme() {
	const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	const toggleTheme = useCallback(() => {
		setTheme(getSnapshot() === "dark" ? "light" : "dark");
	}, []);

	return { theme, setTheme, toggleTheme };
}
