import { useCurrentEditor } from "@tiptap/react";

const EditorJSONPreview = () => {
	const { editor } = useCurrentEditor();

	return editor && <pre>{JSON.stringify(editor.getJSON(), null, 2)}</pre>;
};

export { EditorJSONPreview };
