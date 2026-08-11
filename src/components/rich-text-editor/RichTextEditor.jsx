import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';
import { useEditorToolbar } from './useEditorToolbar';
import { FontSize } from './extensions/fontSize';

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  disabled = false,
  className = '',
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({ HTMLAttributes: { class: 'rte-image' } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rte-content ProseMirror',
      },
    },
  });

  const { groups } = useEditorToolbar(editor);

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    const normalizedValue = value || '';

    if (normalizedValue !== currentHtml) {
      editor.commands.setContent(normalizedValue, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className={['rich-text-editor', disabled ? 'rich-text-editor-disabled' : '', className].filter(Boolean).join(' ')}>
      <EditorToolbar groups={groups} disabled={disabled || !editor} />
      <EditorContent editor={editor} className="rte-editor-body" />
    </div>
  );
}
