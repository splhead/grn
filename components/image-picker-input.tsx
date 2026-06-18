'use client'

import {
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent
} from 'react'

type ImagePickerDialogProps = {
  onClose: () => void
  onInsert: (src: string) => void
  open: boolean
}

type ImagePickerInputProps = {
  defaultValue?: string
  name: string
}

function ImageIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <rect
        fill="none"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        width="16"
        x="4"
        y="5"
      />
      <circle cx="9" cy="10" fill="currentColor" r="1.5" />
      <path
        d="m6 17 4-4 3 3 2-2 3 3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export function ImagePickerDialog({
  onClose,
  onInsert,
  open
}: ImagePickerDialogProps) {
  const [url, setUrl] = useState('')
  const [imageSrc, setImageSrc] = useState('')
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  if (!open) {
    return null
  }

  function resetDialog() {
    setUrl('')
    setImageSrc('')
    setFileName('')
    setError('')
    setIsDragging(false)
  }

  function handleClose() {
    resetDialog()
    onClose()
  }

  function readImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Escolha um arquivo de imagem.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setImageSrc(String(reader.result || ''))
      setFileName(file.name)
      setError('')
    }

    reader.onerror = () => {
      setError('Nao foi possivel ler a imagem.')
    }

    reader.readAsDataURL(file)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (file) {
      readImageFile(file)
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]

    if (file) {
      readImageFile(file)
    }
  }

  function handleInsert() {
    const src = imageSrc || url.trim()

    if (!src) {
      setError('Informe uma URL ou selecione uma imagem.')
      return
    }

    onInsert(src)
    resetDialog()
    onClose()
  }

  function clearFile() {
    setImageSrc('')
    setFileName('')
    setError('')
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 py-6"
      role="dialog"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-md border border-[#f00018]/45 bg-[#080808] shadow-2xl shadow-black/50"
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
            event.preventDefault()
            handleInsert()
          }
        }}
      >
        <div className="flex items-center justify-between border-b border-[#f00018]/35 px-5 py-4">
          <h2 className="text-sm font-black uppercase tracking-wide text-white">
            Adicionar imagem
          </h2>
          <button
            aria-label="Fechar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-zinc-400 transition hover:border-[#f00018]/45 hover:bg-[#171717] hover:text-white"
            onClick={handleClose}
            type="button"
          >
            x
          </button>
        </div>

        <div className="grid gap-4 px-5 py-5">
          <label className="grid gap-2 text-xs font-black uppercase text-zinc-400">
            URL da imagem
            <input
              className="h-11 rounded-md border border-[#f00018]/35 bg-[#050505] px-3 text-sm font-semibold normal-case text-white outline-none transition placeholder:text-zinc-600 focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/20"
              inputMode="url"
              onChange={(event) => {
                setUrl(event.target.value)
                setError('')
              }}
              placeholder="https://exemplo.com/imagem.jpg"
              type="text"
              value={url}
            />
          </label>

          <label
            className={`grid min-h-44 cursor-pointer place-items-center rounded-md border border-dashed px-5 py-6 text-center transition ${
              isDragging
                ? 'border-[#ffcc00] bg-[#ffcc00]/10 text-white'
                : 'border-[#f00018]/45 bg-[#050505] text-zinc-400 hover:border-[#ffcc00]/70 hover:text-white'
            }`}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDrop={handleDrop}
          >
            <input
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              type="file"
            />
            <span className="grid gap-2">
              <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#f00018]/45 text-white">
                <ImageIcon />
              </span>
              <span className="text-sm font-black uppercase">
                Arraste uma imagem ou clique para escolher
              </span>
              <span className="text-xs font-semibold normal-case text-zinc-500">
                PNG, JPG, GIF ou WebP
              </span>
            </span>
          </label>

          {imageSrc && (
            <div className="grid gap-3 rounded-md border border-[#f00018]/35 bg-[#050505] p-3">
              <div
                aria-label="Previa da imagem selecionada"
                className="h-44 rounded-md bg-zinc-950 bg-contain bg-center bg-no-repeat"
                role="img"
                style={{ backgroundImage: `url("${imageSrc}")` }}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-400">{fileName}</span>
                <button
                  className="rounded-md border border-[#f00018]/45 px-3 py-2 text-xs font-black uppercase text-zinc-300 transition hover:bg-[#171717] hover:text-white"
                  onClick={clearFile}
                  type="button"
                >
                  Remover arquivo
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-sm font-bold text-[#ffcc00]">{error}</p>}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-[#f00018]/35 px-5 py-4">
          <button
            className="rounded-md border border-[#f00018]/45 px-4 py-2 text-sm font-black uppercase text-zinc-300 transition hover:bg-[#171717] hover:text-white"
            onClick={handleClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-md border border-[#ffcc00] bg-[#ffcc00] px-4 py-2 text-sm font-black uppercase text-[#111114] transition hover:brightness-110"
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

export default function ImagePickerInput({
  defaultValue = '',
  name
}: ImagePickerInputProps) {
  const [value, setValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const shouldShowImageSource = value && !value.startsWith('data:image/')

  return (
    <div className="grid gap-3">
      <input name={name} type="hidden" value={value} />
      {value && (
        <div className="grid gap-3 rounded-md border border-[#f00018]/35 bg-[#050505] p-3">
          <div
            aria-label="Imagem de capa selecionada"
            className="h-56 rounded-md bg-zinc-950 bg-cover bg-center bg-no-repeat"
            role="img"
            style={{ backgroundImage: `url("${value}")` }}
          />
          {shouldShowImageSource && (
            <p className="break-all text-xs font-semibold text-zinc-500">{value}</p>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          className="min-h-12 rounded-md border border-[#ffcc00] bg-[#ffcc00] px-4 py-3 text-sm font-black uppercase text-[#111114] transition hover:brightness-110"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          {value ? 'Trocar imagem' : 'Adicionar imagem'}
        </button>
        {value && (
          <button
            className="min-h-12 rounded-md border border-[#f00018]/45 px-4 py-3 text-sm font-black uppercase text-zinc-300 transition hover:bg-[#171717] hover:text-white"
            onClick={() => setValue('')}
            type="button"
          >
            Remover
          </button>
        )}
      </div>
      <ImagePickerDialog
        onClose={() => setIsOpen(false)}
        onInsert={setValue}
        open={isOpen}
      />
    </div>
  )
}
