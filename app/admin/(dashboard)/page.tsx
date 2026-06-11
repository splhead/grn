import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { seedData, type NewsArticle } from '@/lib/news-seed'
import {
  categoryNames,
  eyebrowClass,
  formatDate,
  panelClass,
  statusClass
} from '@/lib/admin/ui'

type NewsListPageProps = {
  searchParams?: Promise<{
    page?: string
  }>
}

const pageSize = 6

const statusLabels: Record<NewsArticle['status'], string> = {
  draft: 'Rascunho',
  review: 'Em revisão',
  published: 'Publicado'
}

const statusStyles: Record<NewsArticle['status'], string> = {
  draft: 'bg-zinc-800 text-zinc-300',
  review: 'bg-[#ffcc00] text-[#111114]',
  published: 'bg-green-500 text-white'
}

function buildNewsList() {
  const statusCycle: NewsArticle['status'][] = ['published', 'review', 'draft']

  return Array.from({ length: 18 }, (_, index) => {
    const source = seedData.articles[index % seedData.articles.length]
    const date = new Date(source.updatedAt)
    date.setDate(date.getDate() - index)

    return {
      ...source,
      id: `${source.id}-${index + 1}`,
      title:
        index < seedData.articles.length
          ? source.title
          : `${source.title} (${index + 1})`,
      status: statusCycle[index % statusCycle.length],
      updatedAt: date.toISOString()
    }
  })
}

function pageHref(page: number) {
  return `/admin?page=${page}`
}

export default async function NewsListPage({
  searchParams
}: NewsListPageProps) {
  const params = await searchParams
  const currentPage = Math.max(Number(params?.page || 1), 1)
  const articles = buildNewsList()
  const totalPages = Math.max(Math.ceil(articles.length / pageSize), 1)
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * pageSize
  const pageArticles = articles.slice(start, start + pageSize)

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
              {pageArticles.map(article => (
                <tr className="bg-[#0c0c0f] align-top" key={article.id}>
                  <td className="px-4 py-4">
                    <strong className="block text-white">
                      {article.title}
                    </strong>
                    <small className="mt-1 block max-w-[420px] text-zinc-400">
                      {article.subtitle}
                    </small>
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-300">
                    {categoryNames(article, seedData.categories)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`${statusClass} ${statusStyles[article.status]}`}
                    >
                      {statusLabels[article.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-400">
                    {formatDate(article.updatedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" type="button" variant="outline">
                        Editar
                      </Button>
                      {article.status === 'published' ? (
                        <Button size="sm" type="button" variant="outline">
                          Ver
                        </Button>
                      ) : (
                        <Button size="sm" type="button" variant="success">
                          Publicar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 md:hidden">
          {pageArticles.map(article => (
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
              <p className="mt-2 text-sm text-zinc-400">{article.subtitle}</p>
              <div className="mt-3 grid gap-1 text-sm text-zinc-300">
                <span>{categoryNames(article, seedData.categories)}</span>
                <span>Atualizada em {formatDate(article.updatedAt)}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" type="button" variant="outline">
                  Editar
                </Button>
                {article.status === 'published' ? (
                  <Button size="sm" type="button" variant="outline">
                    Ver
                  </Button>
                ) : (
                  <Button size="sm" type="button" variant="success">
                    Publicar
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#f00018]/45 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            Página {safePage} de {totalPages} · {articles.length} notícias
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
