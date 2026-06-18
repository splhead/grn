'use client'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ImagePickerDialog } from '@/components/image-picker-input'
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

type EditorIconName =
  | 'blockquote'
  | 'bulletList'
  | 'codeBlock'
  | 'horizontalRule'
  | 'image'
  | 'inlineCode'
  | 'link'
  | 'orderedList'
  | 'paragraph'
  | 'redo'
  | 'undo'

const extensions = [
  StarterKit.configure({
    link: false,
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

function EditorIcon({ name }: { name: EditorIconName }) {
  const strokeProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      {name === 'undo' && (
        <>
          <path {...strokeProps} d="M9 7 5 11l4 4" />
          <path {...strokeProps} d="M5 11h8a6 6 0 0 1 6 6v1" />
        </>
      )}
      {name === 'redo' && (
        <>
          <path {...strokeProps} d="m15 7 4 4-4 4" />
          <path {...strokeProps} d="M19 11h-8a6 6 0 0 0-6 6v1" />
        </>
      )}
      {name === 'paragraph' && (
        <>
          <path {...strokeProps} d="M6 5h12" />
          <path {...strokeProps} d="M6 9h12" />
          <path {...strokeProps} d="M6 13h8" />
          <path {...strokeProps} d="M6 17h10" />
        </>
      )}
      {name === 'inlineCode' && (
        <>
          <path {...strokeProps} d="m9 8-4 4 4 4" />
          <path {...strokeProps} d="m15 8 4 4-4 4" />
        </>
      )}
      {name === 'bulletList' && (
        <>
          <path {...strokeProps} d="M10 6h9" />
          <path {...strokeProps} d="M10 12h9" />
          <path {...strokeProps} d="M10 18h9" />
          <circle cx="5" cy="6" fill="currentColor" r="1.4" />
          <circle cx="5" cy="12" fill="currentColor" r="1.4" />
          <circle cx="5" cy="18" fill="currentColor" r="1.4" />
        </>
      )}
      {name === 'orderedList' && (
        <>
          <path {...strokeProps} d="M10 6h9" />
          <path {...strokeProps} d="M10 12h9" />
          <path {...strokeProps} d="M10 18h9" />
          <text fill="currentColor" fontSize="5" fontWeight="800" x="3.2" y="7.7">
            1
          </text>
          <text fill="currentColor" fontSize="5" fontWeight="800" x="3.2" y="13.7">
            2
          </text>
          <text fill="currentColor" fontSize="5" fontWeight="800" x="3.2" y="19.7">
            3
          </text>
        </>
      )}
      {name === 'blockquote' && (
        <>
          <path {...strokeProps} d="M8 7H5v5h4v5H5" />
          <path {...strokeProps} d="M17 7h-3v5h4v5h-4" />
        </>
      )}
      {name === 'codeBlock' && (
        <>
          <path {...strokeProps} d="M8 8H5v8h3" />
          <path {...strokeProps} d="M16 8h3v8h-3" />
          <path {...strokeProps} d="m11 17 2-10" />
        </>
      )}
      {name === 'horizontalRule' && <path {...strokeProps} d="M5 12h14" />}
      {name === 'link' && (
        <>
          <path {...strokeProps} d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
          <path {...strokeProps} d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
        </>
      )}
      {name === 'image' && (
        <>
          <rect {...strokeProps} height="14" rx="2" width="16" x="4" y="5" />
          <circle cx="9" cy="10" fill="currentColor" r="1.5" />
          <path {...strokeProps} d="m6 17 4-4 3 3 2-2 3 3" />
        </>
      )}
    </svg>
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

function EditorToolbar({
  editor,
  onOpenImageDialog
}: {
  editor: Editor
  onOpenImageDialog: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-[#f00018]/45 bg-[linear-gradient(135deg,#050505,#120608)] px-3 py-2">
      <ToolbarButton
        disabled={!editor.can().undo()}
        label="Desfazer"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <EditorIcon name="undo" />
      </ToolbarButton>
      <ToolbarButton
        disabled={!editor.can().redo()}
        label="Refazer"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <EditorIcon name="redo" />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive('paragraph')}
        label="Paragrafo"
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <EditorIcon name="paragraph" />
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
        <EditorIcon name="inlineCode" />
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
        <EditorIcon name="bulletList" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('orderedList')}
        label="Lista numerada"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <EditorIcon name="orderedList" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('blockquote')}
        label="Citacao"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <EditorIcon name="blockquote" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('codeBlock')}
        label="Bloco de codigo"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <EditorIcon name="codeBlock" />
      </ToolbarButton>
      <ToolbarButton
        label="Separador"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <EditorIcon name="horizontalRule" />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive('link')}
        label="Link"
        onClick={() => setLink(editor)}
      >
        <EditorIcon name="link" />
      </ToolbarButton>
      <ToolbarButton label="Imagem" onClick={onOpenImageDialog}>
        <EditorIcon name="image" />
      </ToolbarButton>
    </div>
  )
}

export default function EditorClient({
  initialContent,
  name = 'body'
}: EditorClientProps) {
  const [content, setContent] = useState(initialContent)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
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
      <EditorToolbar
        editor={editor}
        onOpenImageDialog={() => setIsImageDialogOpen(true)}
      />
      <EditorContent editor={editor} />
      <input name={name} type="hidden" value={content} />
      <ImagePickerDialog
        onClose={() => setIsImageDialogOpen(false)}
        onInsert={(src) => {
          editor.chain().focus().setImage({ src }).createParagraphNear().run()
          setContent(editor.getHTML())
        }}
        open={isImageDialogOpen}
      />
    </div>
  )
}
