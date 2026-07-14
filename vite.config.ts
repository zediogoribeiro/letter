import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [devtools(), tailwindcss(), tanstackStart(), nitro(), viteReact()],
	optimizeDeps: {
		include: [
			"@tiptap/react",
			"@tiptap/react/menus",
			"@tiptap/starter-kit",
			"@tiptap/extension-highlight",
			"@tiptap/extension-text-align",
		],
	},
});

export default config;
