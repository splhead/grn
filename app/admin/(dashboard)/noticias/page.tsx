import { asc } from 'drizzle-orm'
import CategoryTagsInput from '@/components/category-tags-input'
import ImagePickerInput from '@/components/image-picker-input'
import NewsBodyEditor from '@/components/news-body-editor'
import PublicationDatePicker from '@/components/publication-date-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { eyebrowClass, panelClass } from '@/lib/admin/ui'
import { db } from '@/lib/db'
import { categoriesTable } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const categories = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug
    })
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.name))
  const placementOptions = [
    {
      value: 'main_cover',
      title: 'Capa principal',
      description: 'Chamada maior da home, reservada para a noticia do dia.'
    },
    {
      value: 'highlights',
      title: 'Destaques',
      description: 'Lista lateral de noticias com prioridade editorial.'
    },
    {
      value: 'latest',
      title: 'Ultimas noticias',
      description: 'Fluxo padrao da home por ordem de publicacao.'
    }
  ]

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 pt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className={eyebrowClass}>Painel administrativo</span>
          <h1 className="text-3xl font-black italic leading-tight text-white">
            Redação e categorias
          </h1>
        </div>
      </div>

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_0px]">
        <section className={panelClass}>
          <div className="mb-5 grid gap-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <span className={eyebrowClass}>Nova noticia</span>
              <h2 className="text-2xl font-black leading-tight">
                Editor de publicacao
              </h2>
              <p className="mt-2 text-sm leading-normal text-zinc-300">
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
              Imagem de capa
              <ImagePickerInput name="coverImage" />
            </Label>
            <fieldset className="grid gap-3 rounded-md border border-[#f00018]/45 p-4 text-sm font-extrabold text-zinc-200">
              <legend className="px-2">Area de destaque</legend>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {placementOptions.map(option => (
                  <label
                    className="grid min-h-[122px] cursor-pointer gap-2 rounded-md border border-[#f00018]/35 bg-[#050505] p-4 transition has-[:checked]:border-[#ffcc00] has-[:checked]:bg-[#171204]"
                    key={option.value}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        className="h-4 w-4 accent-[#ffcc00]"
                        defaultChecked={option.value === 'latest'}
                        name="placement"
                        type="radio"
                        value={option.value}
                      />
                      <span className="font-black text-white">
                        {option.title}
                      </span>
                    </span>
                    <span className="text-sm font-normal leading-normal text-zinc-400">
                      {option.description}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Label>
                Data de publicacao
                <PublicationDatePicker
                  defaultValue="2026-06-08T09:00"
                  name="publishedAt"
                />
              </Label>
            </div>
            <fieldset className="grid gap-3 rounded-md border border-[#f00018]/45 p-4 text-sm font-extrabold text-zinc-200">
              <legend className="px-2">Categorias</legend>
              <CategoryTagsInput
                categories={categories}
                defaultSelectedIds={categories
                  .filter(category => category.slug === 'cidades')
                  .map(category => category.id)}
              />
            </fieldset>
            <div className="grid gap-2 text-sm text-zinc-200">
              <span className="font-extrabold">Corpo da noticia</span>
              <NewsBodyEditor
                initialContent="<p>Escreva o corpo da materia com paragrafos, intertitulos, listas, citacoes e separadores. Este campo agora armazena texto rico em HTML.</p><h2>Intertitulo da noticia</h2><p>Continue a redacao com detalhes, contexto e informacoes relevantes para publicacao.</p>"
                name="body"
              />
            </div>
            <div className="sticky bottom-0 -mx-4 grid gap-3 border-t border-[#f00018]/45 bg-[#050505]/95 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] backdrop-blur sm:static sm:mx-0 sm:flex sm:justify-end sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
              <Button variant="outline" type="button">
                Salvar rascunho
              </Button>
              <Button variant="success" type="button">
                Publicar noticia
              </Button>
            </div>
          </form>
        </section>
      </section>
    </main>
  )
}
