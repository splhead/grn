import Link from 'next/link'
import RichTextEditor from '@/components/rich-text-editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { seedData } from '@/lib/news-seed'
import {
  compactPanelClass,
  eyebrowClass,
  panelClass
} from '@/lib/admin/ui'

export default function AdminPage() {
  const categories = seedData.categories

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 pt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className={eyebrowClass}>Painel administrativo</span>
          <h1 className="text-3xl font-black leading-tight text-[#061b3d]">
            Redação e categorias
          </h1>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#dfe5ee] bg-white px-4 font-black uppercase text-[#061b3d]"
          href="/admin/noticias"
        >
          Listar notícias
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#dfe5ee] bg-white px-4 font-black uppercase text-[#061b3d]"
          href="/admin/visao-geral"
        >
          Ver visão geral
        </Link>
      </div>

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section className={panelClass}>
          <div className="mb-5 grid gap-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <span className={eyebrowClass}>Nova noticia</span>
              <h2 className="text-2xl font-bold leading-tight">
                Editor de publicacao
              </h2>
              <p className="mt-2 text-sm leading-normal text-slate-500">
                Campos otimizados para redigir, salvar e publicar pelo celular
                ou tablet.
              </p>
            </div>
            <Button className="w-full sm:w-auto" type="button">
              Salvar rascunho
            </Button>
          </div>
          <form className="grid gap-5">
            <Label>
              Titulo
              <Input defaultValue="Nova pauta especial sobre Rondônia" />
            </Label>
            <Label>
              Subtitulo
              <Input defaultValue="Resumo curto para aparecer nas chamadas da home." />
            </Label>
            <Label>
              Imagem de capa opcional
              <Input placeholder="https://..." />
            </Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                Data de publicacao
                <Input
                  type="datetime-local"
                  defaultValue="2026-06-08T09:00"
                />
              </Label>
              <Label>
                Data de atualizacao
                <Input
                  type="datetime-local"
                  defaultValue="2026-06-08T11:30"
                />
              </Label>
            </div>
            <fieldset className="grid gap-3 rounded-md border border-[#dfe5ee] p-4 text-sm font-extrabold text-slate-700">
              <legend className="px-2">Categorias</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => (
                  <label
                    className="flex min-h-12 items-center gap-3 rounded-md border border-[#dfe5ee] bg-white p-3 font-bold"
                    key={category.id}
                  >
                    <Checkbox
                      defaultChecked={category.slug === 'cidades'}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </fieldset>
            <Label>
              Corpo da noticia
              <RichTextEditor
                initialContent="<p>Escreva o corpo da materia com paragrafos, intertitulos, listas, citacoes e separadores. Este campo agora armazena texto rico em HTML.</p><h2>Intertitulo da noticia</h2><p>Continue a redacao com detalhes, contexto e informacoes relevantes para publicacao.</p>"
                name="body"
              />
            </Label>
            <div className="sticky bottom-0 -mx-4 grid gap-3 border-t border-[#dfe5ee] bg-white/95 p-4 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:static sm:mx-0 sm:flex sm:justify-end sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
              <Button variant="outline" type="button">
                Salvar rascunho
              </Button>
              <Button variant="success" type="button">
                Publicar noticia
              </Button>
            </div>
          </form>
        </section>

        <section className={compactPanelClass}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <span className={eyebrowClass}>Revisor</span>
              <h2 className="text-2xl font-bold leading-tight">Categorias</h2>
            </div>
            <Button size="sm" type="button" variant="outline">
              Nova
            </Button>
          </div>
          <div className="grid gap-3.5">
            {categories.map((category) => (
              <article
                className="rounded-md border border-[#dfe5ee] bg-slate-50 p-3.5"
                key={category.id}
              >
                <strong className="block">{category.name}</strong>
                <small className="block leading-normal text-slate-500">
                  {category.description}
                </small>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
