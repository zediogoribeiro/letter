import {
	HighlighterIcon,
	ListBulletsIcon,
	ListNumbersIcon,
	ParagraphIcon,
	TextAlignCenterIcon,
	TextAlignLeftIcon,
	TextBIcon,
	TextHOneIcon,
	TextHThreeIcon,
	TextHTwoIcon,
	TextItalicIcon,
	TextStrikethroughIcon,
} from "@phosphor-icons/react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { IconButton } from "../ui/button";
import { Divider } from "../ui/divider";

export const MenuBar = ({ editor }: { editor: Editor }) => {
	const editorState = useEditorState({
		editor,
		selector: (ctx) => {
			return {
				// Text formatting
				isBold: ctx.editor.isActive("bold") ?? false,
				isItalic: ctx.editor.isActive("italic") ?? false,
				isStrike: ctx.editor.isActive("strike") ?? false,
				isHighlight: ctx.editor.isActive("highlight") ?? false,

				// Text alignment
				isAlignLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
				isAlignCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
				isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }) ?? false,

				// Block types
				isParagraph: ctx.editor.isActive("paragraph") ?? false,
				isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
				isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
				isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
				isBulletList: ctx.editor.isActive("bulletList") ?? false,
				isOrderedList: ctx.editor.isActive("orderedList") ?? false,
			};
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="border border-border p-1 rounded-md mb-2 shadow-sm">
			<div className="control-group">
				<div className="button-group flex flex-wrap gap-1">
					<IconButton
						aria-label="H1 Button"
						variant="ghost"
						size="xs"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
						active={editorState.isHeading1}
					>
						<TextHOneIcon />
					</IconButton>
					<IconButton
						aria-label="H2 Button"
						variant="ghost"
						size="xs"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						active={editorState.isHeading2}
					>
						<TextHTwoIcon />
					</IconButton>
					<IconButton
						aria-label="H3 Button"
						variant="ghost"
						size="xs"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						active={editorState.isHeading3}
					>
						<TextHThreeIcon />
					</IconButton>
					<IconButton
						aria-label="Paragraph Button"
						variant="ghost"
						size="xs"
						onClick={() => editor.chain().focus().setParagraph().run()}
						active={editorState.isParagraph}
					>
						<ParagraphIcon />
					</IconButton>

					<Divider
						orientation="vertical"
						decorative
						className="mx-1 h-5 my-auto"
					/>

					<IconButton
						aria-label="Bold Button"
						variant="ghost"
						size="xs"
						onClick={() => editor.chain().focus().toggleBold().run()}
						active={editorState.isBold}
					>
						<TextBIcon />
					</IconButton>
					<IconButton
						aria-label="Italic Button"
						variant="ghost"
						size="xs"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						active={editorState.isItalic}
					>
						<TextItalicIcon />
					</IconButton>
					<IconButton
						aria-label="Strike Button"
						variant="ghost"
						size="xs"
						onClick={() => editor.chain().focus().toggleStrike().run()}
						active={editorState.isStrike}
					>
						<TextStrikethroughIcon />
					</IconButton>
					<IconButton
						aria-label="Highlight Button"
						variant="ghost"
						size="xs"
						onClick={() => editor.chain().focus().toggleHighlight().run()}
						active={editorState.isHighlight}
					>
						<HighlighterIcon />
					</IconButton>

					<Divider
						orientation="vertical"
						decorative
						className="mx-1 h-5 my-auto"
					/>

					<IconButton
						aria-label="Bullet List Button"
						variant="ghost"
						size="xs"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						active={editorState.isBulletList}
					>
						<ListBulletsIcon />
					</IconButton>
					<IconButton
						aria-label="Ordered List Button"
						variant="ghost"
						size="xs"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						active={editorState.isOrderedList}
					>
						<ListNumbersIcon />
					</IconButton>

					<Divider
						orientation="vertical"
						decorative
						className="mx-1 h-5 my-auto"
					/>

					<IconButton
						aria-label="Align Left Button"
						variant="ghost"
						size="xs"
						onClick={() => editor.chain().focus().setTextAlign("left").run()}
						active={editorState.isAlignLeft}
					>
						<TextAlignLeftIcon />
					</IconButton>
					<IconButton
						aria-label="Align Center Button"
						variant="ghost"
						size="xs"
						onClick={() => editor.chain().focus().setTextAlign("center").run()}
						active={editorState.isAlignCenter}
					>
						<TextAlignCenterIcon />
					</IconButton>
				</div>
			</div>
		</div>
	);
};
