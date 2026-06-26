import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { eyebrowClass, panelClass } from '@/lib/admin/ui'
import { getCachedCategories } from '@/lib/categories-cache'
import { db } from '@/lib/db'
import { newsCategoriesTable, newsTable } from '@/lib/db/schema'
import { updateNews } from '../actions'
import NewsForm from '../news-form'

export const dynamic = 'force-dynamic'

type EditNewsPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams?: Promise<{
    erro?: string
    sucesso?: string
  }>
}

function getFeedbackMessage(feedback?: string, error?: string) {
  if (error === 'dados') {
    return {
      tone: 'error',
      text: 'Preencha pelo menos o titulo para salvar a noticia.'
    }
  }

  if (error === 'publicacao') {
    return {
      tone: 'error',
      text: 'Para publicar, preencha titulo, subtitulo e corpo da noticia.'
    }
  }

  if (error === 'categorias') {
    return {
      tone: 'error',
      text: 'Escolha ao menos uma categoria antes de publicar.'
    }
  }

  if (feedback === 'atualizada') {
    return {
      tone: 'success',
      text: 'Noticia atualizada com sucesso.'
    }
  }

  return null
}

export default async function EditNewsPage({
  params,
  searchParams
}: EditNewsPageProps) {
  const { id } = await params
  const query = await searchParams
  const feedback = getFeedbackMessage(query?.sucesso, query?.erro)
  const [article] = await db
    .select({
      body: newsTable.body,
      coverImage: newsTable.coverImage,
      id: newsTable.id,
      placement: newsTable.placement,
      publishedAt: newsTable.publishedAt,
      slug: newsTable.slug,
      subtitle: newsTable.subtitle,
      title: newsTable.title
    })
    .from(newsTable)
    .where(eq(newsTable.id, id))
    .limit(1)

  if (!article) {
    notFound()
  }

  const categories = await getCachedCategories()
  const selectedCategories = await db
    .select({
      categoryId: newsCategoriesTable.categoryId
    })
    .from(newsCategoriesTable)
    .where(eq(newsCategoriesTable.newsId, id))

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 pt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className={eyebrowClass}>Painel administrativo</span>
          <h1 className="text-3xl font-black italic leading-tight text-white">
            Editar notícia
          </h1>
        </div>
      </div>

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_0px]">
        <section className={panelClass}>
          {feedback ? (
            <div
              className={`mb-5 rounded-md border px-4 py-3 text-sm font-black ${
                feedback.tone === 'success'
                  ? 'border-green-500/50 bg-green-500/10 text-green-300'
                  : 'border-[#ffcc00]/50 bg-[#ffcc00]/10 text-[#ffcc00]'
              }`}
            >
              {feedback.text}
            </div>
          ) : null}
          <NewsForm
            action={updateNews}
            categories={categories}
            mode="edit"
            values={{
              ...article,
              categoryIds: selectedCategories.map(
                category => category.categoryId
              )
            }}
          />
        </section>
      </section>
    </main>
  )
}
