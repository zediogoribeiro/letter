import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
	EditorContent,
	EditorContext,
	type JSONContent,
	useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuBar } from "./menu-bar";

interface RichTextEditorProps {
	content?: JSONContent;
	onChange?: (content: JSONContent) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
	const editor = useEditor({
		immediatelyRender: false,
		content,
		extensions: [
			StarterKit.configure({
				bulletList: {
					HTMLAttributes: {
						class: "list-disc ml-10",
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal ml-10",
					},
				},
			}),
			Highlight,
			TextAlign.configure({
				types: ["heading", "paragraph", "listItem"],
				alignments: ["left", "center"],
			}),
		],
		editorProps: {
			attributes: {
				class:
					"min-h-39 border border-border py-2 px-3 s rounded-md shadow-sm font-display outline-none transition focus-visible:ring-1 focus-visible:ring-ring",
			},
		},
		onUpdate: ({ editor }) => {
			onChange?.(editor.getJSON());
		},
	});

	const providerValue = useMemo(() => ({ editor }), [editor]);

	if (!editor) {
		return (
			<div>
				<Skeleton className="mb-2 h-11 border border-border shadow-sm" />
				<Skeleton className="min-h-39 border border-border shadow-sm" />
			</div>
		);
	}

	return (
		<EditorContext.Provider value={providerValue}>
			<div>
				<MenuBar editor={editor} />
				<EditorContent editor={editor} />
			</div>
		</EditorContext.Provider>
	);
};

export default RichTextEditor;
