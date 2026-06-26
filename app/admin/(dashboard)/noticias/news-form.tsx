import Link from 'next/link'
import CategoryTagsInput, {
  type CategoryTagOption
} from '@/components/category-tags-input'
import ImagePickerInput from '@/components/image-picker-input'
import NewsBodyEditor from '@/components/news-body-editor'
import PublicationDatePicker from '@/components/publication-date-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type NewsFormMode = 'create' | 'edit'
type NewsPlacement = 'main_cover' | 'highlights' | 'latest'

type NewsFormValues = {
  body?: string | null
  categoryIds?: string[]
  coverImage?: string | null
  id?: string
  placement?: NewsPlacement
  publishedAt?: Date | null
  slug?: string | null
  subtitle?: string | null
  title?: string
}

type NewsFormProps = {
  action: (formData: FormData) => void | Promise<void>
  categories: CategoryTagOption[]
  mode: NewsFormMode
  values?: NewsFormValues
}

const titlePlaceholder = 'Nova pauta especial sobre Rondônia'
const subtitlePlaceholder =
  'Resumo curto para aparecer nas chamadas da home.'
const bodyPlaceholder =
  'Escreva o corpo da materia com paragrafos, intertitulos, listas, citacoes e separadores. Use H2/H3 para intertitulos e insira imagens quando precisar.'

const placementOptions: Array<{
  description: string
  title: string
  value: NewsPlacement
}> = [
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

function formatDateInputValue(date?: Date | null) {
  if (!date) {
    return ''
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)

  return offsetDate.toISOString().slice(0, 16)
}

export default function NewsForm({
  action,
  categories,
  mode,
  values = {}
}: NewsFormProps) {
  const formId = mode === 'edit' ? 'news-edit-form' : 'news-editor-form'
  const selectedPlacement = values.placement ?? 'latest'
  const publicHref = values.slug
    ? `/noticias/${values.slug}${values.id ? `?preview=${values.id}` : ''}`
    : ''
  const saveLabel = mode === 'edit' ? 'Salvar alteracoes' : 'Salvar rascunho'

  return (
    <>
      <div className="mb-5 grid gap-4 sm:flex sm:items-center sm:justify-between">
        <div>
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#ffcc00]">
            {mode === 'edit' ? 'Editar noticia' : 'Nova noticia'}
          </span>
          <h2 className="text-2xl font-black leading-tight">
            Editor de publicacao
          </h2>
          <p className="mt-2 text-sm leading-normal text-zinc-300">
            Campos otimizados para redigir, salvar e publicar pelo celular ou
            tablet.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          form={formId}
          name="intent"
          type="submit"
          value={mode === 'edit' ? 'save' : 'draft'}
          variant="outline"
        >
          {saveLabel}
        </Button>
      </div>

      <form action={action} className="grid gap-5" id={formId}>
        {values.id ? (
          <input name="articleId" type="hidden" value={values.id} />
        ) : null}

        {mode === 'edit' ? (
          <div className="grid gap-2 rounded-md border border-[#f00018]/45 bg-[#050505] p-4">
            <span className="text-xs font-black uppercase text-zinc-400">
              Slug publico
            </span>
            {publicHref ? (
              <Link
                className="break-all text-sm font-black text-[#ffcc00] underline underline-offset-4"
                href={publicHref}
                target="_blank"
              >
                {values.slug}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-zinc-500">
                O slug sera gerado ao salvar a noticia.
              </span>
            )}
          </div>
        ) : null}

        <Label>
          Titulo
          <Input
            defaultValue={values.title ?? ''}
            name="title"
            placeholder={titlePlaceholder}
          />
        </Label>
        <Label>
          Subtitulo
          <Input
            defaultValue={values.subtitle ?? ''}
            name="subtitle"
            placeholder={subtitlePlaceholder}
          />
        </Label>
        <Label>
          Imagem de capa
          <ImagePickerInput
            defaultValue={values.coverImage ?? ''}
            name="coverImage"
          />
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
                    defaultChecked={option.value === selectedPlacement}
                    name="placement"
                    type="radio"
                    value={option.value}
                  />
                  <span className="font-black text-white">{option.title}</span>
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
              defaultValue={formatDateInputValue(values.publishedAt)}
              name="publishedAt"
            />
          </Label>
        </div>
        <fieldset className="grid gap-3 rounded-md border border-[#f00018]/45 p-4 text-sm font-extrabold text-zinc-200">
          <legend className="px-2">Categorias</legend>
          <CategoryTagsInput
            categories={categories}
            defaultSelectedIds={values.categoryIds ?? []}
          />
        </fieldset>
        <div className="grid gap-2 text-sm text-zinc-200">
          <span className="font-extrabold">Corpo da noticia</span>
          <NewsBodyEditor
            initialContent={values.body ?? ''}
            name="body"
            placeholder={bodyPlaceholder}
          />
        </div>
        <div className="sticky bottom-0 -mx-4 grid gap-3 border-t border-[#f00018]/45 bg-[#050505]/95 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] backdrop-blur sm:static sm:mx-0 sm:flex sm:justify-end sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
          <Button
            name="intent"
            type="submit"
            value={mode === 'edit' ? 'save' : 'draft'}
            variant="outline"
          >
            {saveLabel}
          </Button>
          <Button name="intent" type="submit" value="published" variant="success">
            Publicar noticia
          </Button>
        </div>
      </form>
    </>
  )
}
