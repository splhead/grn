import Link from 'next/link'
import { MainNewsCarousel } from '@/components/main-news-carousel'
import { desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  categoriesTable,
  newsCategoriesTable,
  newsTable
} from '@/lib/db/schema'
import { createNewsSlug } from '@/lib/news'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeZone: 'America/Manaus'
})

function getReadingTime(html: string) {
  const plainText = html.replace(/<[^>]+>/g, ' ').trim()
  const words = plainText ? plainText.split(/\s+/).length : 0

  return Math.max(1, Math.ceil(words / 220))
}

const categories = [
  ['🛡️', 'Polícia'],
  ['🏛️', 'Política'],
  ['📍', 'Cidades'],
  ['🌿', 'Meio Ambiente'],
  ['🌱', 'Agro'],
  ['💚', 'Saúde']
]

const cardClass =
  'rounded-[5px] border border-[#f00018]/45 bg-[#0c0c0f] p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)]'
const cardTitleClass =
  'border-b-2 border-[#f00018] pb-2.5 text-2xl font-black italic uppercase text-[#ffcc00] mb-3'
const defaultArticleImage =
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1100&q=80'

export const dynamic = 'force-dynamic'

async function getHomepageContent() {
  const publishedArticles = await db
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
    .where(eq(newsTable.status, 'published'))
    .orderBy(desc(newsTable.publishedAt), desc(newsTable.updatedAt))
    .limit(40)

  const mainCoverArticles = publishedArticles.filter(
    article => article.placement === 'main_cover'
  )
  const remainingSlots = Math.max(0, 7 - mainCoverArticles.length)
  const fallbackArticles = publishedArticles
    .filter(article => article.placement !== 'main_cover')
    .slice(0, remainingSlots)

  const articles = [...mainCoverArticles, ...fallbackArticles]
  const articleIds = articles.map(article => article.id)
  const categoryRows =
    articleIds.length > 0
      ? await db
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
      : []
  const categoryByArticleId = new Map<string, string>()

  categoryRows.forEach(row => {
    if (!categoryByArticleId.has(row.newsId)) {
      categoryByArticleId.set(row.newsId, row.categoryName)
    }
  })

  const mainArticles = articles.slice(0, 7).map(article => ({
    ...article,
    body: article.body ?? '',
    category: categoryByArticleId.get(article.id) ?? 'Notícias',
    publishedAt: article.publishedAt ?? article.updatedAt,
    slug: article.slug ?? createNewsSlug(article.title),
    subtitle: article.subtitle ?? ''
  }))

  const highlights = publishedArticles
    .filter(article => article.placement === 'highlights')
    .slice(0, 4)
    .map(article => ({
      href: `/noticias/${article.slug ?? createNewsSlug(article.title)}`,
      image: article.coverImage ?? defaultArticleImage,
      meta: dateFormatter.format(article.publishedAt ?? article.updatedAt),
      title: article.title
    }))

  const latestNews = publishedArticles
    .filter(article => article.placement === 'latest')
    .slice(0, 6)
    .map(article => ({
      href: `/noticias/${article.slug ?? createNewsSlug(article.title)}`,
      image: article.coverImage ?? defaultArticleImage,
      meta: `${dateFormatter.format(
        article.publishedAt ?? article.updatedAt
      )} • ${getReadingTime(article.body ?? '')} min`,
      summary: article.subtitle ?? '',
      title: article.title
    }))

  return {
    highlights,
    latestNews,
    mainArticles
  }
}

function EmptyNewsSection({
  className = '',
  placementName
}: {
  className?: string
  placementName: string
}) {
  return (
    <div
      className={`rounded border border-[#f00018]/45 bg-[#0c0c0f] p-8 text-center text-white ${className}`}
    >
      <h3 className="text-xl font-black text-[#ffcc00]">
        Ainda não existem notícias cadastradas
      </h3>
      <p className="mt-2 text-sm font-semibold text-zinc-300">
        Publique uma notícia na área de destaque {placementName} para ela
        aparecer nesta seção.
      </p>
    </div>
  )
}

export default async function Home() {
  const { highlights, latestNews, mainArticles } = await getHomepageContent()
  const mainNews = mainArticles.map(article => {
    return {
      href: `/noticias/${article.slug}`,
      image: article.coverImage ?? defaultArticleImage,
      title: article.title,
      summary: article.subtitle,
      category: article.category,
      meta: `▣ ${dateFormatter.format(new Date(article.publishedAt))}   ◉ ${getReadingTime(article.body)} min de leitura`
    }
  })

  return (
    <main className="mx-auto grid max-w-[1250px] grid-cols-1 gap-[25px] px-5 py-7 lg:grid-cols-[1fr_400px]">
      <section>
        <MainNewsCarousel items={mainNews} />

        <div className="my-[25px] grid grid-cols-1 rounded border border-[#f00018]/45 bg-[#0c0c0f] text-white md:grid-cols-3 lg:grid-cols-6">
          {categories.map(([icon, label]) => (
            <div
              className="border-b border-[#f00018]/35 p-[22px_5px] text-center text-[33px] md:border-r lg:border-b-0"
              key={label}
            >
              {icon}
              <b className="mt-2 block text-[15px] uppercase text-[#ffcc00]">
                {label}
              </b>
            </div>
          ))}
        </div>

        <h2 className={cardTitleClass}>Últimas Notícias</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {latestNews.length > 0 ? (
            latestNews.map(item => (
              <Link
                className="grid grid-cols-1 gap-3.5 border-b border-[#f00018]/35 pb-4 text-white sm:grid-cols-[130px_1fr]"
                href={item.href}
                key={item.href}
              >
                <img
                  alt=""
                  className="h-[125px] w-full rounded-[5px] object-cover"
                  src={item.image}
                />
                <div>
                  <h3 className="mb-2 text-xl font-black">{item.title}</h3>
                  <p className="mb-2 text-zinc-300">{item.summary}</p>
                  <small className="mt-2 block font-bold text-[#ffcc00]">
                    {item.meta}
                  </small>
                </div>
              </Link>
            ))
          ) : (
            <EmptyNewsSection
              className="md:col-span-2"
              placementName="Últimas notícias"
            />
          )}
        </div>
        {latestNews.length > 0 ? (
          <div className="flex justify-end">
            <Link
              className="my-5 w-full lg:w-64 rounded-[5px] border border-[#f00018] bg-[#f00018] p-4 font-black uppercase text-white shadow-[0_14px_30px_rgba(240,0,24,0.28)]"
              href="/noticias"
            >
              Ver mais notícias
            </Link>
          </div>
        ) : null}
      </section>

      <aside className="grid content-start gap-6.25">
        <div className={cardClass}>
          <h2 className={cardTitleClass}>Destaques</h2>
          {highlights.length > 0 ? (
            <>
              {highlights.map(item => (
                <Link
                  className="grid grid-cols-[115px_1fr] gap-3.5 border-b border-[#f00018]/35 py-3.25"
                  href={item.href}
                  key={item.href}
                >
                  <img
                    alt=""
                    className="h-[125px] w-full rounded-[5px] object-cover"
                    src={item.image}
                  />
                  <p>
                    <b className="text-[17px]">{item.title}</b>
                    <small className="mt-2 block text-[#ffcc00]">
                      {item.meta}
                    </small>
                  </p>
                </Link>
              ))}
              <Link
                className="mt-5 block text-center font-black uppercase text-[#ffcc00]"
                href="/noticias"
              >
                Ver todas as notícias →
              </Link>
            </>
          ) : (
            <EmptyNewsSection placementName="Destaques" />
          )}
        </div>

        {/* <div className={cardClass}>
          <h2 className={cardTitleClass}>✉ Boletim Informativo</h2>
          <p>Receba as principais notícias no seu e-mail.</p>
          <input
            className="my-3 w-full rounded border border-[#f00018]/45 bg-[#050505] p-3.75 text-white outline-none placeholder:text-zinc-500"
            placeholder="Digite seu e-mail"
          />
          <button
            className="w-full rounded bg-[#f00018] px-6 py-3 font-black uppercase text-white"
            type="button"
          >
            Assinar
          </button>
        </div> */}

        <div className={cardClass}>
          <h2 className={cardTitleClass}>Redes Sociais</h2>
          <p>Siga o Giro Radar Notícias.</p>
          {[
            ['📷 @giroradarnoticias', 'Seguir'],
            ['f Giro Radar Notícias', 'Curtir'],
            ['▶ Giro Radar Notícias', 'Inscrever-se'],
            ['🟢 Grupo no WhatsApp', 'Entrar']
          ].map(([label, action]) => (
            <div
              className="flex items-center justify-between border-b border-[#f00018]/35 py-2.5"
              key={label}
            >
              {label}
              <button
                className="rounded bg-[#f00018] px-3.75 py-2 font-black uppercase text-white"
                type="button"
              >
                {action}
              </button>
            </div>
          ))}
        </div>
      </aside>
    </main>
  )
}
