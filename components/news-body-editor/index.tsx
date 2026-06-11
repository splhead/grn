'use client'

import dynamic from 'next/dynamic'

type NewsBodyEditorProps = {
  initialContent: string
  name?: string
}

const EditorClient = dynamic(() => import('./editor-client'), {
  loading: () => (
    <div className="grid min-h-[420px] place-items-center rounded-md border border-[#f00018]/45 bg-[#050505] text-sm font-extrabold uppercase text-zinc-500">
      Carregando editor...
    </div>
  ),
  ssr: false
})

export default function NewsBodyEditor(props: NewsBodyEditorProps) {
  return <EditorClient {...props} />
}
