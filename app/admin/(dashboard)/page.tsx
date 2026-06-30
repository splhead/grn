import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  categoriesTable,
  newsCategoriesTable,
  newsTable
} from '@/lib/db/schema'
import { db } from '@/lib/db'
import {
  eyebrowClass,
  formatDate,
  panelClass,
  statusClass
} from '@/lib/admin/ui'
import { count, desc, eq, inArray } from 'drizzle-orm'
import { createNewsSlug } from '@/lib/news'
import { revalidatePublicNewsCache } from '@/lib/news-cache'

type NewsListPageProps = {
  searchParams?: Promise<{
    page?: string
  }>
}

const pageSize = 6
type NewsStatus = 'draft' | 'review' | 'published' | 'archived'

type AdminArticle = {
  categories: string[]
  id: string
  slug: string | null
  status: NewsStatus
  subtitle: string | null
  title: string
  updatedAt: Date
}

async function archiveNews(formData: FormData) {
  'use server'

  const articleId = String(formData.get('articleId') ?? '')

  if (!articleId) {
    return
  }

  await db
    .update(newsTable)
    .set({
      status: 'archived',
      updatedAt: new Date()
    })
    .where(eq(newsTable.id, articleId))

  revalidatePath('/admin')
  revalidatePath('/admin/visao-geral')
  revalidatePublicNewsCache()
  redirect('/admin')
}

async function restoreNews(formData: FormData) {
  'use server'

  const articleId = String(formData.get('articleId') ?? '')

  if (!articleId) {
    return
  }

  await db
    .update(newsTable)
    .set({
      status: 'draft',
      updatedAt: new Date()
    })
    .where(eq(newsTable.id, articleId))

  revalidatePath('/admin')
  revalidatePath('/admin/visao-geral')
  revalidatePublicNewsCache()
  redirect('/admin')
}

async function publishNews(formData: FormData) {
  'use server'

  const articleId = String(formData.get('articleId') ?? '')

  if (!articleId) {
    return
  }

  const [article] = await db
    .select({
      publishedAt: newsTable.publishedAt,
      slug: newsTable.slug,
      title: newsTable.title
    })
    .from(newsTable)
    .where(eq(newsTable.id, articleId))
    .limit(1)

  if (!article) {
    redirect('/admin')
  }

  await db
    .update(newsTable)
    .set({
      publishedAt: article.publishedAt ?? new Date(),
      slug: article.slug || createNewsSlug(article.title),
      status: 'published',
      updatedAt: new Date()
    })
    .where(eq(newsTable.id, articleId))

  revalidatePath('/admin')
  revalidatePath('/admin/visao-geral')
  revalidatePublicNewsCache(article.slug || createNewsSlug(article.title))
  redirect('/admin')
}

const statusLabels: Record<NewsStatus, string> = {
  draft: 'Rascunho',
  review: 'Em revisão',
  published: 'Publicado',
  archived: 'Arquivada'
}

const statusStyles: Record<NewsStatus, string> = {
  draft: 'bg-zinc-800 text-zinc-300',
  review: 'bg-[#ffcc00] text-[#111114]',
  published: 'bg-green-500 text-white',
  archived: 'bg-zinc-700 text-zinc-100'
}

function pageHref(page: number) {
  return `/admin?page=${page}`
}

async function getArticleCategories(articleIds: string[]) {
  if (articleIds.length === 0) {
    return new Map<string, string[]>()
  }

  const rows = await db
    .select({
      categoryName: categoriesTable.name,
      newsId: newsCategoriesTable.newsId
    })
    .from(newsCategoriesTable)
    .innerJoin(
      categoriesTable,
      eq(newsCategoriesTable.categoryId, categoriesTable.id)
    )
    .where(inArray(newsCategoriesTable.newsId, articleIds))

  return rows.reduce((categoryMap, row) => {
    const currentCategories = categoryMap.get(row.newsId) ?? []

    categoryMap.set(row.newsId, [...currentCategories, row.categoryName])

    return categoryMap
  }, new Map<string, string[]>())
}

async function getPaginatedArticles(page: number) {
  const [{ total }] = await db.select({ total: count() }).from(newsTable)
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)
  const safePage = Math.min(page, totalPages)
  const offset = (safePage - 1) * pageSize
  const articles = await db
    .select({
      id: newsTable.id,
      slug: newsTable.slug,
      status: newsTable.status,
      subtitle: newsTable.subtitle,
      title: newsTable.title,
      updatedAt: newsTable.updatedAt
    })
    .from(newsTable)
    .orderBy(desc(newsTable.updatedAt), desc(newsTable.createdAt))
    .limit(pageSize)
    .offset(offset)
  const categoryMap = await getArticleCategories(
    articles.map(article => article.id)
  )

  return {
    articles: articles.map(article => ({
      ...article,
      categories: categoryMap.get(article.id) ?? []
    })),
    safePage,
    total,
    totalPages
  }
}

function getPublicArticleSlug(article: AdminArticle) {
  return article.slug || createNewsSlug(article.title)
}

function ArticleActions({ article }: { article: AdminArticle }) {
  return (
    <>
      <Link
        className="inline-flex min-h-[42px] items-center justify-center rounded-md border border-[#f00018]/55 bg-[#0c0c0f] px-4 text-sm font-black uppercase text-white transition hover:bg-[#f00018]"
        href={`/admin/noticias/${article.id}`}
      >
        Editar
      </Link>
      {article.status === 'archived' ? null : (
        <form action={archiveNews}>
          <input name="articleId" type="hidden" value={article.id} />
          <Button size="sm" type="submit" variant="outline">
            Arquivar
          </Button>
        </form>
      )}
      {article.status === 'published' ? (
        <Link
          className="inline-flex min-h-[42px] items-center justify-center rounded-md border border-[#f00018]/55 bg-[#0c0c0f] px-4 text-sm font-black uppercase text-white transition hover:bg-[#f00018]"
          href={`/noticias/${getPublicArticleSlug(article)}`}
        >
          Ver
        </Link>
      ) : article.status === 'archived' ? (
        <form action={restoreNews}>
          <input name="articleId" type="hidden" value={article.id} />
          <Button size="sm" type="submit" variant="success">
            Restaurar
          </Button>
        </form>
      ) : (
        <form action={publishNews}>
          <input name="articleId" type="hidden" value={article.id} />
          <Button size="sm" type="submit" variant="success">
            Publicar
          </Button>
        </form>
      )}
    </>
  )
}

export default async function NewsListPage({
  searchParams
}: NewsListPageProps) {
  const params = await searchParams
  const currentPage = Math.max(Number(params?.page || 1), 1)
  const { articles, safePage, total, totalPages } =
    await getPaginatedArticles(currentPage)

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 pt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className={eyebrowClass}>Painel administrativo</span>
          <h1 className="text-3xl font-black italic leading-tight text-white">
            Notícias
          </h1>
          <p className="mt-2 text-sm text-zinc-300">
            Acompanhe status, atualização e ações editoriais.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#f00018]/55 bg-[#0c0c0f] px-4 font-black uppercase text-white transition hover:bg-[#f00018]"
          href="/admin/noticias"
        >
          Nova notícia
        </Link>
      </div>

      <section className={panelClass}>
        <div className="hidden overflow-hidden rounded-md border border-[#f00018]/45 md:block">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#f00018] text-xs uppercase tracking-[0.08em] text-white">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Categorias</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Atualização</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f00018]/35">
              {articles.length > 0 ? (
                articles.map(article => (
                  <tr className="bg-[#0c0c0f] align-top" key={article.id}>
                    <td className="px-4 py-4">
                      <strong className="block text-white">
                        {article.title}
                      </strong>
                      {article.subtitle ? (
                        <small className="mt-1 block max-w-[420px] text-zinc-400">
                          {article.subtitle}
                        </small>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-300">
                      {article.categories.length > 0
                        ? article.categories.join(', ')
                        : 'Sem categoria'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`${statusClass} ${statusStyles[article.status]}`}
                      >
                        {statusLabels[article.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-400">
                      {formatDate(article.updatedAt.toISOString())}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <ArticleActions article={article} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-[#0c0c0f]">
                  <td
                    className="px-4 py-10 text-center text-sm font-bold text-zinc-400"
                    colSpan={5}
                  >
                    Nenhuma noticia cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 md:hidden">
          {articles.length > 0 ? (
            articles.map(article => (
              <article
                className="rounded-md border border-[#f00018]/45 bg-[#050505] p-4"
                key={article.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-black leading-tight text-white">
                    {article.title}
                  </h2>
                  <span
                    className={`${statusClass} ${statusStyles[article.status]}`}
                  >
                    {statusLabels[article.status]}
                  </span>
                </div>
                {article.subtitle ? (
                  <p className="mt-2 text-sm text-zinc-400">
                    {article.subtitle}
                  </p>
                ) : null}
                <div className="mt-3 grid gap-1 text-sm text-zinc-300">
                  <span>
                    {article.categories.length > 0
                      ? article.categories.join(', ')
                      : 'Sem categoria'}
                  </span>
                  <span>
                    Atualizada em {formatDate(article.updatedAt.toISOString())}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <ArticleActions article={article} />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-md border border-[#f00018]/45 bg-[#050505] px-4 py-10 text-center text-sm font-bold text-zinc-400">
              Nenhuma noticia cadastrada.
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#f00018]/45 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            Página {safePage} de {totalPages} · {total} notícias
          </p>
          <div className="flex items-center gap-2">
            <Link
              aria-disabled={safePage === 1}
              className={`inline-flex min-h-10 items-center justify-center rounded-md border border-[#f00018]/45 px-4 text-sm font-black uppercase ${
                safePage === 1
                  ? 'cursor-not-allowed bg-zinc-900 text-zinc-600'
                  : 'bg-[#0c0c0f] text-white'
              }`}
              href={pageHref(Math.max(safePage - 1, 1))}
            >
              Anterior
            </Link>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              page => (
                <Link
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#f00018]/45 text-sm font-black ${
                    page === safePage
                      ? 'bg-[#ffcc00] text-[#111114]'
                      : 'bg-[#0c0c0f] text-white'
                  }`}
                  href={pageHref(page)}
                  key={page}
                >
                  {page}
                </Link>
              )
            )}
            <Link
              aria-disabled={safePage === totalPages}
              className={`inline-flex min-h-10 items-center justify-center rounded-md border border-[#f00018]/45 px-4 text-sm font-black uppercase ${
                safePage === totalPages
                  ? 'cursor-not-allowed bg-zinc-900 text-zinc-600'
                  : 'bg-[#0c0c0f] text-white'
              }`}
              href={pageHref(Math.min(safePage + 1, totalPages))}
            >
              Próxima
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
