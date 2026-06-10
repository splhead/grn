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
  draft: 'bg-slate-100 text-slate-600',
  review: 'bg-[#fff4d7] text-[#8a5a00]',
  published: 'bg-[#e8f7ee] text-[#0d7130]'
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
  return `/admin/noticias?page=${page}`
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
          <h1 className="text-3xl font-black leading-tight text-[#061b3d]">
            Notícias
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Acompanhe status, atualização e ações editoriais.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#dfe5ee] bg-white px-4 font-black uppercase text-[#061b3d]"
          href="/admin"
        >
          Nova notícia
        </Link>
      </div>

      <section className={panelClass}>
        <div className="hidden overflow-hidden rounded-md border border-[#dfe5ee] md:block">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#f5f7fb] text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Categorias</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Atualização</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe5ee]">
              {pageArticles.map(article => (
                <tr className="bg-white align-top" key={article.id}>
                  <td className="px-4 py-4">
                    <strong className="block text-[#061b3d]">
                      {article.title}
                    </strong>
                    <small className="mt-1 block max-w-[420px] text-slate-500">
                      {article.subtitle}
                    </small>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {categoryNames(article, seedData.categories)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`${statusClass} ${statusStyles[article.status]}`}
                    >
                      {statusLabels[article.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">
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
              className="rounded-md border border-[#dfe5ee] bg-white p-4"
              key={article.id}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold leading-tight text-[#061b3d]">
                  {article.title}
                </h2>
                <span
                  className={`${statusClass} ${statusStyles[article.status]}`}
                >
                  {statusLabels[article.status]}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{article.subtitle}</p>
              <div className="mt-3 grid gap-1 text-sm text-slate-600">
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

        <div className="mt-5 flex flex-col gap-3 border-t border-[#dfe5ee] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Página {safePage} de {totalPages} · {articles.length} notícias
          </p>
          <div className="flex items-center gap-2">
            <Link
              aria-disabled={safePage === 1}
              className={`inline-flex min-h-10 items-center justify-center rounded-md border border-[#dfe5ee] px-4 text-sm font-black uppercase ${
                safePage === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-[#061b3d]'
              }`}
              href={pageHref(Math.max(safePage - 1, 1))}
            >
              Anterior
            </Link>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              page => (
                <Link
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#dfe5ee] text-sm font-black ${
                    page === safePage
                      ? 'bg-[#08285c] text-white'
                      : 'bg-white text-[#061b3d]'
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
              className={`inline-flex min-h-10 items-center justify-center rounded-md border border-[#dfe5ee] px-4 text-sm font-black uppercase ${
                safePage === totalPages
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-[#061b3d]'
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
