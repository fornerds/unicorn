import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Node } from '@tiptap/core';

const YouTubeNode = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [
      {
        tag: 'div.ql-youtube-embed',
        getAttrs: (dom) => {
          const iframe = (dom as HTMLElement).querySelector('iframe');
          return { src: iframe?.getAttribute('src') || null };
        },
      },
    ];
  },
  renderHTML({ node }) {
    return [
      'div',
      { class: 'ql-youtube-embed' },
      ['iframe', { src: node.attrs.src, frameborder: '0', allowfullscreen: 'true' }],
    ];
  },
  addCommands() {
    // Tiptap v3에서 addCommands 타입이 까다롭기 때문에 any 캐스팅으로 단순화
    return {
      setYouTube:
        (src: string) =>
        ({ editor }: any) =>
          editor.chain().focus().insertContent({ type: this.name, attrs: { src } }).run(),
    } as any;
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

function parseYouTubeUrl(input: string): string | null {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;
  const m = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/) || trimmed.match(/^([a-zA-Z0-9_-]{11})$/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  if (trimmed.startsWith('https://www.youtube.com/embed/')) return trimmed;
  return null;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = '내용을 입력하세요',
  className = '',
  minHeight = '240px',
  onImageUpload,
}: RichTextEditorProps) {
  const lastEmittedRef = useRef(value ?? '');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      YouTubeNode,
    ],
    content: value ?? '',
    editorProps: {
      attributes: { class: 'min-h-[380px] p-3 outline-none text-gray-900', 'data-placeholder': placeholder },
      handlePaste: (view, event) => {
        const url = event.clipboardData?.getData('text/plain') ?? '';
        const embedUrl = parseYouTubeUrl(url);
        if (embedUrl && view.state.schema.nodes.youtube) {
          const node = view.state.schema.nodes.youtube.create({ src: embedUrl });
          const tr = view.state.tr.replaceSelectionWith(node);
          view.dispatch(tr);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedRef.current = html;
      onChange(html);
    },
  });

  useEffect(() => {
    const next = value ?? '';
    if (editor && next !== lastEmittedRef.current) {
      lastEmittedRef.current = next;
      editor.commands.setContent(next);
    }
  }, [value, editor]);

  const setImage = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
  };

  const setYouTube = () => {
    const raw = window.prompt('유튜브 링크를 붙여넣으세요');
    const embedUrl = parseYouTubeUrl(raw || '');
    if (embedUrl) (editor as any)?.commands?.setYouTube?.(embedUrl);
  };

  if (!editor) return <div className={className} style={{ minHeight }} />;

  return (
    <div className={className} style={{ minHeight }}>
      <div className="flex flex-wrap gap-1 border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 p-1">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`rounded px-2 py-1 text-sm ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>
          B
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`rounded px-2 py-1 text-sm italic ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>
          I
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`rounded px-2 py-1 text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>
          H1
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`rounded px-2 py-1 text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`rounded px-2 py-1 text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>
          H3
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`rounded px-2 py-1 text-sm ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>
          •
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`rounded px-2 py-1 text-sm ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>
          1.
        </button>
        <div className="mx-2 h-5 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          왼쪽
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          가운데
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        >
          오른쪽
        </button>
        <button
          type="button"
          onClick={() => {
            if (onImageUpload) {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = async () => {
                const file = input.files?.[0];
                if (file) try { setImage(await onImageUpload(file)); } catch { /* noop */ }
                input.value = '';
              };
              input.click();
            } else {
              const url = window.prompt('이미지 URL');
              if (url) setImage(url);
            }
          }}
          className="rounded px-2 py-1 text-sm hover:bg-gray-200"
        >
          이미지
        </button>
        <button type="button" onClick={setYouTube} className="rounded px-2 py-1 text-sm hover:bg-gray-200">
          유튜브
        </button>
      </div>
      <EditorContent editor={editor} className="rounded-b-lg border border-gray-300 bg-white" />
    </div>
  );
}
