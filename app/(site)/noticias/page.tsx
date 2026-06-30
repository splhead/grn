import Link from 'next/link'
import Image from 'next/image'
import { unstable_cache } from 'next/cache'
import { Fragment } from 'react'
import { and, count, desc, eq, ilike, inArray, or } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  categoriesTable,
  newsCategoriesTable,
  newsTable
} from '@/lib/db/schema'
import { getCachedCategories } from '@/lib/categories-cache'
import { createNewsSlug } from '@/lib/news'
import { NEWS_CACHE_TAG, NEWS_LIST_CACHE_TAG } from '@/lib/news-cache'
import { GoogleAdsenseAd } from '@/components/google-adsense-ad'
import { shouldShowNewsAd } from '@/lib/ad-placement'

type NewsListPageProps = {
  searchParams?: Promise<{
    busca?: string
    categoria?: string
    pagina?: string
  }>
}

type NewsPlacement = 'main_cover' | 'highlights' | 'latest'

const PAGE_SIZE = 9
const defaultArticleImage =
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeZone: 'America/Manaus'
})

export const revalidate = 300

function getValidPage(value?: string) {
  const page = Number(value)

  return Number.isInteger(page) && page > 0 ? page : 1
}

function getPlacementLabel(placement: NewsPlacement) {
  const placementLabels: Record<NewsPlacement, string> = {
    highlights: 'Destaques',
    latest: 'Últimas notícias',
    main_cover: 'Capa principal'
  }

  return placementLabels[placement]
}

function getPageHref(
  page: number,
  filters: {
    categorySlug: string
    search: string
  }
) {
  const params = new URLSearchParams()

  if (page > 1) {
    params.set('pagina', String(page))
  }

  if (filters.categorySlug) {
    params.set('categoria', filters.categorySlug)
  }

  if (filters.search) {
    params.set('busca', filters.search)
  }

  const query = params.toString()

  return query ? `/noticias?${query}` : '/noticias'
}

async function getNewsList({
  categorySlug,
  page,
  search
}: {
  categorySlug: string
  page: number
  search: string
}) {
  const conditions: SQL[] = [eq(newsTable.status, 'published')]

  if (search) {
    const searchPattern = `%${search}%`
    const searchCondition = or(
      ilike(newsTable.title, searchPattern),
      ilike(newsTable.subtitle, searchPattern),
      ilike(newsTable.body, searchPattern)
    )

    if (searchCondition) {
      conditions.push(searchCondition)
    }
  }

  let filteredNewsIds: string[] | null = null

  if (categorySlug) {
    const categoryNews = await db
      .select({ newsId: newsCategoriesTable.newsId })
      .from(newsCategoriesTable)
      .innerJoin(
        categoriesTable,
        eq(newsCategoriesTable.categoryId, categoriesTable.id)
      )
      .where(eq(categoriesTable.slug, categorySlug))

    filteredNewsIds = categoryNews.map(row => row.newsId)

    if (filteredNewsIds.length === 0) {
      return {
        articles: [],
        categoryRows: [],
        totalArticles: 0
      }
    }

    conditions.push(inArray(newsTable.id, filteredNewsIds))
  }

  const whereClause = and(...conditions)
  const [{ total }] = await db
    .select({ total: count() })
    .from(newsTable)
    .where(whereClause)
  const totalArticles = Number(total)
  const offset = (page - 1) * PAGE_SIZE
  const articles = await db
    .select({
      body: newsTable.body,
      coverImage: newsTable.coverImage,
      id: newsTable.id,
      placement: newsTable.placement,
      publishedAt: newsTable.publishedAt,
      slug: newsTable.slug,
      subtitle: newsTable.subtitle,
      title: newsTable.title,
      updatedAt: newsTable.updatedAt
    })
    .from(newsTable)
    .where(whereClause)
    .orderBy(desc(newsTable.publishedAt), desc(newsTable.updatedAt))
    .limit(PAGE_SIZE)
    .offset(offset)
  const articleIds = articles.map(article => article.id)
  const categoryRows =
    articleIds.length > 0
      ? await db
          .select({
            id: categoriesTable.id,
            name: categoriesTable.name,
            newsId: newsCategoriesTable.newsId,
            slug: categoriesTable.slug
          })
          .from(newsCategoriesTable)
          .innerJoin(
            categoriesTable,
            eq(newsCategoriesTable.categoryId, categoriesTable.id)
          )
          .where(inArray(newsCategoriesTable.newsId, articleIds))
      : []

  return {
    articles,
    categoryRows,
    totalArticles
  }
}

const getCachedBaseNewsList = unstable_cache(
  async (page: number) =>
    getNewsList({
      categorySlug: '',
      page,
      search: ''
    }),
  ['base-news-list'],
  {
    revalidate: 300,
    tags: [NEWS_CACHE_TAG, NEWS_LIST_CACHE_TAG]
  }
)

function EmptyNewsList() {
  return (
    <div className="rounded border border-[#f00018]/45 bg-[#0c0c0f] p-8 text-center text-white md:col-span-2 lg:col-span-3">
      <h2 className="text-2xl font-black text-[#ffcc00]">
        Nenhuma notícia encontrada
      </h2>
      <p className="mt-2 text-sm font-semibold text-zinc-300">
        Ajuste os filtros para realizar uma nova busca.
      </p>
    </div>
  )
}

export default async function NewsListPage({
  searchParams
}: NewsListPageProps) {
  const params = await searchParams
  const page = getValidPage(params?.pagina)
  const categorySlug = params?.categoria ?? ''
  const search = String(params?.busca ?? '').trim()
  const categories = await getCachedCategories()
  const isBaseList = !categorySlug && !search
  const { articles, categoryRows, totalArticles } = isBaseList
    ? await getCachedBaseNewsList(page)
    : await getNewsList({
        categorySlug,
        page,
        search
      })
  const totalPages = Math.max(1, Math.ceil(totalArticles / PAGE_SIZE))
  const categoryByArticleId = new Map<
    string,
    Array<{ id: string; name: string; slug: string }>
  >()

  categoryRows.forEach(category => {
    const currentCategories = categoryByArticleId.get(category.newsId) ?? []
    currentCategories.push({
      id: category.id,
      name: category.name,
      slug: category.slug
    })
    categoryByArticleId.set(category.newsId, currentCategories)
  })

  const filters = {
    categorySlug,
    search
  }

  return (
    <main className="mx-auto grid w-full max-w-[1250px] gap-7 px-5 py-7">
      <section className="grid gap-3">
        <span className="text-sm font-black uppercase text-[#ffcc00]">
          Giro Radar Notícias
        </span>
        <h1 className="text-[34px] font-black italic leading-tight text-white sm:text-[44px]">
          Todas as notícias
        </h1>
      </section>

      <form
        className="grid gap-4 rounded border border-[#f00018]/45 bg-[#0c0c0f] p-4 text-white md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto]"
        method="get"
      >
        <label className="grid gap-2 text-sm font-black">
          Categoria
          <select
            className="min-h-11 rounded border border-[#f00018]/45 bg-[#050505] px-3 text-white outline-none"
            defaultValue={categorySlug}
            name="categoria"
          >
            <option value="">Todas</option>
            {categories.map(category => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-black">
          Buscar
          <input
            className="min-h-11 rounded border border-[#f00018]/45 bg-[#050505] px-3 text-white outline-none"
            defaultValue={search}
            name="busca"
            placeholder="Título, subtítulo ou corpo da notícia"
            type="search"
          />
        </label>

        <div className="grid content-end gap-2 sm:grid-cols-2 md:min-w-[260px]">
          <button
            className="min-h-11 rounded bg-[#f00018] px-4 font-black uppercase text-white"
            type="submit"
          >
            Filtrar
          </button>
          <Link
            className="flex min-h-11 items-center justify-center rounded border border-[#f00018]/55 px-4 font-black uppercase text-[#ffcc00]"
            href="/noticias"
          >
            Limpar
          </Link>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#f00018]/45 py-4 text-sm font-bold text-zinc-300">
        <span>
          {totalArticles === 1
            ? '1 notícia encontrada'
            : `${totalArticles} notícias encontradas`}
        </span>
        <span>
          Página {Math.min(page, totalPages)} de {totalPages}
        </span>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((article, index) => {
            const articleCategories = categoryByArticleId.get(article.id) ?? []
            const articleHref = `/noticias/${article.slug ?? createNewsSlug(article.title)}`

            return (
              <Fragment key={article.id}>
                <Link
                  className="grid overflow-hidden rounded border border-[#f00018]/45 bg-[#0c0c0f] text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:border-[#ffcc00]/80"
                  href={articleHref}
                >
                  <span className="relative block h-48 overflow-hidden">
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) 390px, (min-width: 768px) calc((100vw - 60px) / 2), calc(100vw - 40px)"
                      src={article.coverImage ?? defaultArticleImage}
                    />
                  </span>
                  <div className="grid gap-3 p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded bg-[#f00018] px-2 py-1 text-xs font-black uppercase text-white">
                        {getPlacementLabel(article.placement)}
                      </span>
                      {articleCategories.slice(0, 2).map(category => (
                        <span
                          className="rounded border border-[#ffcc00]/55 px-2 py-1 text-xs font-black uppercase text-[#ffcc00]"
                          key={category.id}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-black leading-tight">
                      {article.title}
                    </h2>
                    {article.subtitle ? (
                      <p className="text-sm font-semibold leading-normal text-zinc-300">
                        {article.subtitle}
                      </p>
                    ) : null}
                    <small className="font-bold text-[#ffcc00]">
                      {dateFormatter.format(
                        article.publishedAt ?? article.updatedAt
                      )}
                    </small>
                  </div>
                </Link>
                {shouldShowNewsAd({
                  index,
                  seedKey: articleHref,
                  total: articles.length
                }) ? (
                  <GoogleAdsenseAd className="min-h-[180px] p-2 md:col-span-2 lg:col-span-3" />
                ) : null}
              </Fragment>
            )
          })
        ) : (
          <EmptyNewsList />
        )}
      </section>

      {totalPages > 1 ? (
        <nav className="flex flex-wrap items-center justify-center gap-2">
          {page > 1 ? (
            <Link
              className="rounded border border-[#f00018]/55 px-4 py-3 font-black uppercase text-[#ffcc00]"
              href={getPageHref(page - 1, filters)}
            >
              Anterior
            </Link>
          ) : null}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            pageNumber => (
              <Link
                aria-current={pageNumber === page ? 'page' : undefined}
                className={`rounded border px-4 py-3 font-black ${
                  pageNumber === page
                    ? 'border-[#ffcc00] bg-[#ffcc00] text-[#050505]'
                    : 'border-[#f00018]/55 text-white'
                }`}
                href={getPageHref(pageNumber, filters)}
                key={pageNumber}
              >
                {pageNumber}
              </Link>
            )
          )}
          {page < totalPages ? (
            <Link
              className="rounded border border-[#f00018]/55 px-4 py-3 font-black uppercase text-[#ffcc00]"
              href={getPageHref(page + 1, filters)}
            >
              Próxima
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  )
}
