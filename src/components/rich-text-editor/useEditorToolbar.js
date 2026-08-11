import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Image,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';
import {
  FONT_SIZES,
  HEADING_OPTIONS,
  HIGHLIGHT_COLORS,
  SHORTCUTS,
  TEXT_COLORS,
} from './toolbarConstants';

function getActiveHeading(editor) {
  for (let level = 1; level <= 4; level += 1) {
    if (editor.isActive('heading', { level })) return String(level);
  }
  return 'paragraph';
}

function getActiveFontSize(editor) {
  return editor.getAttributes('textStyle').fontSize || '';
}

export function useEditorToolbar(editor) {
  const [, setRevision] = useState(0);

  useEffect(() => {
    if (!editor) return undefined;

    const refresh = () => setRevision((current) => current + 1);

    editor.on('selectionUpdate', refresh);
    editor.on('transaction', refresh);

    return () => {
      editor.off('selectionUpdate', refresh);
      editor.off('transaction', refresh);
    };
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl || 'https://');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt('Enter image URL');

    if (url) {
      editor.chain().focus().setImage({ src: url, alt: '' }).run();
    }
  }, [editor]);

  const setHeading = useCallback(
    (value) => {
      if (!editor) return;

      if (value === 'paragraph') {
        editor.chain().focus().setParagraph().run();
        return;
      }

      editor.chain().focus().toggleHeading({ level: Number(value) }).run();
    },
    [editor],
  );

  const groups = useMemo(() => {
    if (!editor) return [];

    const can = (command) => editor.can().chain().focus()[command]().run();

    return [
      {
        id: 'history',
        items: [
          {
            type: 'button',
            id: 'undo',
            icon: Undo2,
            label: 'Undo',
            shortcut: SHORTCUTS.undo,
            isActive: false,
            isDisabled: !editor.can().chain().focus().undo().run(),
            onClick: () => editor.chain().focus().undo().run(),
          },
          {
            type: 'button',
            id: 'redo',
            icon: Redo2,
            label: 'Redo',
            shortcut: SHORTCUTS.redo,
            isActive: false,
            isDisabled: !editor.can().chain().focus().redo().run(),
            onClick: () => editor.chain().focus().redo().run(),
          },
        ],
      },
      {
        id: 'formatting',
        items: [
          {
            type: 'button',
            id: 'bold',
            icon: Bold,
            label: 'Bold',
            shortcut: SHORTCUTS.bold,
            isActive: editor.isActive('bold'),
            isDisabled: !can('toggleBold'),
            onClick: () => editor.chain().focus().toggleBold().run(),
          },
          {
            type: 'button',
            id: 'italic',
            icon: Italic,
            label: 'Italic',
            shortcut: SHORTCUTS.italic,
            isActive: editor.isActive('italic'),
            isDisabled: !can('toggleItalic'),
            onClick: () => editor.chain().focus().toggleItalic().run(),
          },
          {
            type: 'button',
            id: 'underline',
            icon: Underline,
            label: 'Underline',
            shortcut: SHORTCUTS.underline,
            isActive: editor.isActive('underline'),
            isDisabled: !can('toggleUnderline'),
            onClick: () => editor.chain().focus().toggleUnderline().run(),
          },
          {
            type: 'button',
            id: 'strike',
            icon: Strikethrough,
            label: 'Strikethrough',
            shortcut: SHORTCUTS.strike,
            isActive: editor.isActive('strike'),
            isDisabled: !can('toggleStrike'),
            onClick: () => editor.chain().focus().toggleStrike().run(),
          },
        ],
      },
      {
        id: 'structure',
        items: [
          {
            type: 'select',
            id: 'heading',
            label: 'Block type',
            icon: Heading1,
            value: getActiveHeading(editor),
            options: HEADING_OPTIONS,
            onChange: setHeading,
          },
          {
            type: 'select',
            id: 'fontSize',
            label: 'Font size',
            value: getActiveFontSize(editor),
            options: [{ label: 'Default', value: '' }, ...FONT_SIZES],
            onChange: (value) => {
              if (!value) {
                editor.chain().focus().unsetFontSize().run();
                return;
              }
              editor.chain().focus().setFontSize(value).run();
            },
          },
        ],
      },
      {
        id: 'colors',
        items: [
          {
            type: 'color',
            id: 'textColor',
            label: 'Text color',
            colors: TEXT_COLORS,
            value: editor.getAttributes('textStyle').color || '#111827',
            onChange: (color) => editor.chain().focus().setColor(color).run(),
          },
          {
            type: 'color',
            id: 'highlight',
            label: 'Highlight',
            colors: HIGHLIGHT_COLORS,
            value: editor.getAttributes('highlight').color || '#FEF08A',
            onChange: (color) => editor.chain().focus().toggleHighlight({ color }).run(),
            isActive: editor.isActive('highlight'),
          },
        ],
      },
      {
        id: 'lists',
        items: [
          {
            type: 'button',
            id: 'bulletList',
            icon: List,
            label: 'Bullet list',
            shortcut: SHORTCUTS.bulletList,
            isActive: editor.isActive('bulletList'),
            isDisabled: !can('toggleBulletList'),
            onClick: () => editor.chain().focus().toggleBulletList().run(),
          },
          {
            type: 'button',
            id: 'orderedList',
            icon: ListOrdered,
            label: 'Numbered list',
            shortcut: SHORTCUTS.orderedList,
            isActive: editor.isActive('orderedList'),
            isDisabled: !can('toggleOrderedList'),
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
          },
        ],
      },
      {
        id: 'alignment',
        items: [
          {
            type: 'button',
            id: 'alignLeft',
            icon: AlignLeft,
            label: 'Align left',
            isActive: editor.isActive({ textAlign: 'left' }),
            onClick: () => editor.chain().focus().setTextAlign('left').run(),
          },
          {
            type: 'button',
            id: 'alignCenter',
            icon: AlignCenter,
            label: 'Align center',
            isActive: editor.isActive({ textAlign: 'center' }),
            onClick: () => editor.chain().focus().setTextAlign('center').run(),
          },
          {
            type: 'button',
            id: 'alignRight',
            icon: AlignRight,
            label: 'Align right',
            isActive: editor.isActive({ textAlign: 'right' }),
            onClick: () => editor.chain().focus().setTextAlign('right').run(),
          },
          {
            type: 'button',
            id: 'alignJustify',
            icon: AlignJustify,
            label: 'Justify',
            isActive: editor.isActive({ textAlign: 'justify' }),
            onClick: () => editor.chain().focus().setTextAlign('justify').run(),
          },
        ],
      },
      {
        id: 'blocks',
        items: [
          {
            type: 'button',
            id: 'blockquote',
            icon: Quote,
            label: 'Blockquote',
            shortcut: SHORTCUTS.blockquote,
            isActive: editor.isActive('blockquote'),
            isDisabled: !can('toggleBlockquote'),
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
          },
          {
            type: 'button',
            id: 'horizontalRule',
            icon: Minus,
            label: 'Horizontal rule',
            isActive: false,
            onClick: () => editor.chain().focus().setHorizontalRule().run(),
          },
        ],
      },
      {
        id: 'media',
        items: [
          {
            type: 'button',
            id: 'link',
            icon: Link2,
            label: 'Link',
            isActive: editor.isActive('link'),
            onClick: setLink,
          },
          {
            type: 'button',
            id: 'image',
            icon: Image,
            label: 'Image',
            isActive: false,
            onClick: addImage,
          },
        ],
      },
    ];
  }, [editor, setHeading, setLink, addImage]);

  return {
    groups,
    isReady: Boolean(editor),
  };
}
