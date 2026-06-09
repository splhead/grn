'use client'

import { Extension } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

type RichTextEditorProps = {
  initialContent: string
  name?: string
}

type ToolbarButtonProps = {
  active?: boolean
  'aria-label'?: string
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
}

type ImagePickerModalProps = {
  onClose: () => void
  onInsert: (src: string) => void
}

const paragraphStyles = [
  { label: 'Normal', value: 'normal' },
  { label: 'Chamada', value: 'lead' },
  { label: 'Destaque', value: 'highlight' },
  { label: 'Nota', value: 'note' }
]

const ParagraphStyle = Extension.create({
  name: 'paragraphStyle',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          paragraphStyle: {
            default: 'normal',
            parseHTML: (element) =>
              element.getAttribute('data-paragraph-style') || 'normal',
            renderHTML: (attributes) => {
              if (!attributes.paragraphStyle || attributes.paragraphStyle === 'normal') {
                return {}
              }

              return {
                'data-paragraph-style': attributes.paragraphStyle
              }
            }
          }
        }
      }
    ]
  }
})

function getParagraphStyle(editor: Editor) {
  if (!editor.isActive('paragraph')) {
    return 'normal'
  }

  return (editor.getAttributes('paragraph').paragraphStyle as string) || 'normal'
}

function ToolbarButton({
  active = false,
  'aria-label': ariaLabel,
  children,
  disabled = false,
  onClick
}: ToolbarButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded px-2.5 text-sm font-semibold transition ${
        active
          ? 'bg-white/10 text-white'
          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
      } disabled:cursor-not-allowed disabled:opacity-30`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <span className="my-2 h-5 w-px flex-none bg-zinc-700" />
}

function ImagePickerModal({ onClose, onInsert }: ImagePickerModalProps) {
  const [fileName, setFileName] = useState('')
  const [imageSrc, setImageSrc] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(String(reader.result || ''))
      setImageUrl('')
    }
    reader.readAsDataURL(file)
  }

  function handleInsert() {
    const src = imageSrc || imageUrl.trim()

    if (!src) {
      return
    }

    onInsert(src)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-[#061b3d]/70 p-0 backdrop-blur-sm sm:place-items-center sm:p-6">
      <div
        aria-modal="true"
        className="w-full rounded-t-2xl border border-[#dfe5ee] bg-white shadow-2xl sm:max-w-[520px] sm:rounded-xl"
        role="dialog"
      >
        <div className="border-b border-[#dfe5ee] bg-gradient-to-r from-[#061b3d] to-[#08285c] px-5 py-4 text-white sm:rounded-t-xl">
          <span className="block text-xs font-black uppercase tracking-[0.08em] text-[#ffccd4]">
            Corpo da noticia
          </span>
          <h2 className="mt-1 text-xl font-black">Adicionar imagem</h2>
        </div>

        <div className="grid gap-4 p-5">
          <label className="grid min-h-[150px] cursor-pointer place-items-center rounded-lg border-2 border-dashed border-[#dfe5ee] bg-[#f5f7fb] p-5 text-center transition hover:border-[#08285c]">
            <input
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              type="file"
            />
            <span className="text-3xl text-[#e31837]">▧</span>
            <strong className="mt-2 block text-[#061b3d]">
              Escolher arquivo
            </strong>
            <small className="mt-1 block text-slate-500">
              {fileName || 'PNG, JPG ou WEBP'}
            </small>
          </label>

          {imageSrc ? (
            <img
              alt=""
              className="max-h-[220px] w-full rounded-lg object-cover"
              src={imageSrc}
            />
          ) : null}

          <label className="grid gap-2 text-sm font-extrabold text-slate-700">
            Ou informe uma URL
            <input
              className="min-h-12 rounded-md border border-[#dfe5ee] bg-slate-50 px-3.5 py-3 text-base text-[#061b3d] outline-none focus:border-[#08285c] focus:ring-2 focus:ring-[#08285c]/15"
              onChange={(event) => {
                setImageUrl(event.target.value)
                setImageSrc('')
                setFileName('')
              }}
              placeholder="https://..."
              type="url"
              value={imageUrl}
            />
          </label>
        </div>

        <div className="grid gap-3 border-t border-[#dfe5ee] p-5 sm:flex sm:justify-end">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#dfe5ee] bg-white px-5 font-black uppercase text-[#061b3d]"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#e31837] px-5 font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!imageSrc && !imageUrl.trim()}
            onClick={handleInsert}
            type="button"
          >
            Inserir imagem
          </button>
        </div>
      </div>
    </div>
  )
}

function RichTextToolbar({
  editor,
  onAddImage
}: {
  editor: Editor | null
  onAddImage: () => void
}) {
  if (!editor) {
    return null
  }

  function setParagraphStyle(style: string) {
    editor
      ?.chain()
      .focus()
      .setParagraph()
      .updateAttributes('paragraph', { paragraphStyle: style })
      .run()
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-[#0f1419] bg-[#181b20] px-3 py-1.5">
      <ToolbarButton
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        ↶
      </ToolbarButton>
      <ToolbarButton
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        ↷
      </ToolbarButton>
      <ToolbarDivider />
      <select
        aria-label="Estilo do parágrafo"
        className="h-9 flex-none rounded border-0 bg-transparent px-2 text-sm font-semibold text-zinc-300 outline-none hover:bg-white/5"
        onChange={(event) => setParagraphStyle(event.target.value)}
        value={getParagraphStyle(editor)}
      >
        {paragraphStyles.map((style) => (
          <option key={style.value} value={style.value}>
            {style.label}
          </option>
        ))}
      </select>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive('paragraph')}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        S
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {'</>'}
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        ≡
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        ❝
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        —
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton aria-label="Adicionar imagem" onClick={onAddImage}>
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <path
            d="M4 16l4.2-4.2a1.5 1.5 0 0 1 2.1 0L14 15.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <path
            d="M4 9v8.5A2.5 2.5 0 0 0 6.5 20H14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <path
            d="M18 13v6m-3-3h6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <circle cx="12.5" cy="8.5" r="1.2" fill="currentColor" />
        </svg>
      </ToolbarButton>
    </div>
  )
}

export default function RichTextEditor({
  initialContent,
  name = 'body'
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const editor = useEditor({
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'min-h-[320px] px-4 py-4 text-[17px] font-normal leading-8 text-slate-700 outline-none sm:min-h-[380px] [&_blockquote]:border-l-4 [&_blockquote]:border-[#dfe5ee] [&_blockquote]:pl-4 [&_blockquote]:font-normal [&_blockquote]:text-slate-600 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#061b3d] [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#061b3d] [&_hr]:my-6 [&_hr]:border-[#dfe5ee] [&_img]:my-5 [&_img]:max-h-[520px] [&_img]:w-full [&_img]:rounded-md [&_img]:object-cover [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_p]:font-normal [&_p[data-paragraph-style=highlight]]:rounded-md [&_p[data-paragraph-style=highlight]]:bg-[#f5f7fb] [&_p[data-paragraph-style=highlight]]:p-4 [&_p[data-paragraph-style=highlight]]:font-medium [&_p[data-paragraph-style=lead]]:text-xl [&_p[data-paragraph-style=lead]]:font-normal [&_p[data-paragraph-style=lead]]:leading-9 [&_p[data-paragraph-style=lead]]:text-slate-600 [&_p[data-paragraph-style=note]]:border-l-4 [&_p[data-paragraph-style=note]]:border-[#e31837] [&_p[data-paragraph-style=note]]:bg-[#fff5f7] [&_p[data-paragraph-style=note]]:p-4 [&_p[data-paragraph-style=note]]:font-normal [&_ul]:list-disc [&_ul]:pl-6'
      }
    },
    extensions: [
      StarterKit,
      ParagraphStyle,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'not-prose'
        }
      })
    ],
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getHTML())
    }
  })

  function insertImage(src: string) {
    editor?.chain().focus().setImage({ src }).run()
  }

  return (
    <div className="overflow-hidden rounded-md border border-[#dfe5ee] bg-white focus-within:border-[#08285c] focus-within:ring-2 focus-within:ring-[#08285c]/15">
      <RichTextToolbar
        editor={editor}
        onAddImage={() => setIsImageModalOpen(true)}
      />
      <EditorContent editor={editor} />
      <input name={name} type="hidden" value={content} />
      {isImageModalOpen ? (
        <ImagePickerModal
          onClose={() => setIsImageModalOpen(false)}
          onInsert={insertImage}
        />
      ) : null}
    </div>
  )
}
