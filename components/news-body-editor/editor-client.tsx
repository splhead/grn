'use client'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, type ReactNode } from 'react'

type EditorClientProps = {
  initialContent: string
  name?: string
}

type ToolbarButtonProps = {
  active?: boolean
  children: ReactNode
  disabled?: boolean
  label: string
  onClick: () => void
}

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3]
    }
  }),
  Link.configure({
    autolink: true,
    defaultProtocol: 'https://',
    openOnClick: false
  }),
  Image.configure({
    allowBase64: true,
    inline: false
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph']
  })
]

function ToolbarButton({
  active = false,
  children,
  disabled = false,
  label,
  onClick
}: ToolbarButtonProps) {
  return (
    <button
      aria-label={label}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 text-sm font-black transition ${
        active
          ? 'border-[#ffcc00] bg-[#ffcc00] text-[#111114]'
          : 'border-transparent text-zinc-400 hover:border-[#f00018]/45 hover:bg-[#171717] hover:text-white'
      } disabled:cursor-not-allowed disabled:opacity-30`}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault()

        if (!disabled) {
          onClick()
        }
      }}
      title={label}
      type="button"
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <span className="my-2 hidden h-5 w-px flex-none bg-[#f00018]/35 sm:block" />
}

function AlignIcon({ alignment }: { alignment: 'left' | 'center' | 'right' | 'justify' }) {
  const rows = alignment === 'justify' ? ['full', 'full', 'full'] : ['full', 'mid', 'short']
  const itemClass =
    alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''

  return (
    <span aria-hidden="true" className="grid w-5 gap-1">
      {rows.map((row, index) => (
        <span
          className={`block h-0.5 rounded-full bg-current ${
            row === 'full' ? 'w-5' : row === 'mid' ? 'w-4' : 'w-3'
          } ${itemClass}`}
          key={`${row}-${index}`}
        />
      ))}
    </span>
  )
}

function setLink(editor: Editor) {
  const previousUrl = editor.getAttributes('link').href as string | undefined
  const url = window.prompt('URL do link', previousUrl || 'https://')

  if (url === null) {
    return
  }

  if (!url.trim()) {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
}

function insertImage(editor: Editor) {
  const src = window.prompt('URL da imagem', 'https://')

  if (!src?.trim()) {
    return
  }

  editor.chain().focus().setImage({ src: src.trim() }).run()
}

function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-[#f00018]/45 bg-[linear-gradient(135deg,#050505,#120608)] px-3 py-2">
      <ToolbarButton
        disabled={!editor.can().undo()}
        label="Desfazer"
        onClick={() => editor.chain().focus().undo().run()}
      >
        UN
      </ToolbarButton>
      <ToolbarButton
        disabled={!editor.can().redo()}
        label="Refazer"
        onClick={() => editor.chain().focus().redo().run()}
      >
        RE
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive('paragraph')}
        label="Paragrafo"
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 2 })}
        label="Intertitulo"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 3 })}
        label="Subtitulo"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive('bold')}
        label="Negrito"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('italic')}
        label="Italico"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('strike')}
        label="Tachado"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        S
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('code')}
        label="Codigo inline"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {'</>'}
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive({ textAlign: 'left' })}
        label="Alinhar a esquerda"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignIcon alignment="left" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'center' })}
        label="Centralizar"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignIcon alignment="center" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'right' })}
        label="Alinhar a direita"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignIcon alignment="right" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'justify' })}
        label="Justificar"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <AlignIcon alignment="justify" />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive('bulletList')}
        label="Lista"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        UL
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('orderedList')}
        label="Lista numerada"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('blockquote')}
        label="Citacao"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Q
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('codeBlock')}
        label="Bloco de codigo"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        {'{}'}
      </ToolbarButton>
      <ToolbarButton
        label="Separador"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        HR
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive('link')}
        label="Link"
        onClick={() => setLink(editor)}
      >
        L
      </ToolbarButton>
      <ToolbarButton label="Imagem" onClick={() => insertImage(editor)}>
        IMG
      </ToolbarButton>
    </div>
  )
}

export default function EditorClient({
  initialContent,
  name = 'body'
}: EditorClientProps) {
  const [content, setContent] = useState(initialContent)
  const editor = useEditor({
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'tiptap-news-content'
      }
    },
    extensions,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getHTML())
    }
  })

  if (!editor) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-md border border-[#f00018]/45 bg-[#050505] text-sm font-extrabold uppercase text-zinc-500">
        Carregando editor...
      </div>
    )
  }

  return (
    <div className="tiptap-news-editor overflow-hidden rounded-md border border-[#f00018]/45 bg-[#050505] focus-within:border-[#ffcc00] focus-within:ring-2 focus-within:ring-[#ffcc00]/20">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <input name={name} type="hidden" value={content} />
    </div>
  )
}
