'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { useEffect } from 'react';
import {
  Bold, Italic, Strikethrough, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered
} from 'lucide-react';
import './tiptap.css';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const buttonStyle = (active) =>
    `p-2 rounded transition-all ${
      active ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }`;

  return (
    <div className="w-full border-t border-gray-400 p-2 bg-white rounded-t flex flex-wrap gap-2 shadow-inner z-10">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonStyle(editor.isActive('bold'))}><Bold size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonStyle(editor.isActive('italic'))}><Italic size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonStyle(editor.isActive('strike'))}><Strikethrough size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={buttonStyle(editor.isActive('highlight'))}><Highlighter size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonStyle(editor.isActive('bulletList'))}><List size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonStyle(editor.isActive('orderedList'))}><ListOrdered size={16} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonStyle(editor.isActive({ textAlign: 'left' }))}><AlignLeft size={16} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={buttonStyle(editor.isActive({ textAlign: 'center' }))}><AlignCenter size={16} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonStyle(editor.isActive({ textAlign: 'right' }))}><AlignRight size={16} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={buttonStyle(editor.isActive({ textAlign: 'justify' }))}><AlignJustify size={16} /></button>
    </div>
  );
};

export default function TiptapEditor({ noteText, setNoteText }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: noteText,
    onUpdate: ({ editor }) => {
      setNoteText(editor.getHTML());
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  return (
    <div className="w-full max-w-[90%] h-[70vh] border border-gray-400 rounded bg-white/20 backdrop-blur-sm flex flex-col overflow-hidden">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto p-2">
        <EditorContent editor={editor} className="tiptap" />
      </div>
      
    </div>
  );
}
