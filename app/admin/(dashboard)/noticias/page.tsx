import ImagePickerInput from '@/components/image-picker-input'
import NewsBodyEditor from '@/components/news-body-editor'
import PublicationDatePicker from '@/components/publication-date-picker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { seedData } from '@/lib/news-seed'
import { eyebrowClass, panelClass } from '@/lib/admin/ui'

export default function AdminPage() {
  const categories = seedData.categories

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
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map(category => (
                  <label
                    className="flex min-h-12 items-center gap-3 rounded-md border border-[#f00018]/35 bg-[#050505] p-3 font-bold"
                    key={category.id}
                  >
                    <Checkbox defaultChecked={category.slug === 'cidades'} />
                    {category.name}
                  </label>
                ))}
              </div>
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
