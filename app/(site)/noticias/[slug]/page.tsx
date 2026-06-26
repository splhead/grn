import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, desc, eq, ne } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  categoriesTable,
  newsCategoriesTable,
  newsTable,
  user as userTable
} from '@/lib/db/schema'
import {
  createNewsSlug,
  getArticleAuthor,
  getArticleBySlug,
  getArticleCategories,
  getPublishedArticles
} from '@/lib/news'
import { getSession } from '@/lib/server'

type NewsDetailPageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams?: Promise<{
    preview?: string
  }>
}

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://giroradarnoticias.com.br'
).replace(/\/$/, '')

export const revalidate = 300

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Manaus'
})

function getReadingTime(html: string) {
  const plainText = html.replace(/<[^>]+>/g, ' ').trim()
  const words = plainText ? plainText.split(/\s+/).length : 0

  return Math.max(1, Math.ceil(words / 220))
}

async function getDbArticle(slug: string, previewId?: string) {
  const canPreview = Boolean(previewId && (await getSession())?.user)
  const [article] = await db
    .select({
      authorName: userTable.name,
      body: newsTable.body,
      coverImage: newsTable.coverImage,
      id: newsTable.id,
      publishedAt: newsTable.publishedAt,
      slug: newsTable.slug,
      status: newsTable.status,
      subtitle: newsTable.subtitle,
      title: newsTable.title
    })
    .from(newsTable)
    .leftJoin(userTable, eq(newsTable.authorId, userTable.id))
    .where(
      canPreview
        ? and(eq(newsTable.id, previewId as string), eq(newsTable.slug, slug))
        : and(eq(newsTable.slug, slug), eq(newsTable.status, 'published'))
    )
    .limit(1)

  if (!article) {
    return null
  }

  const categories = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug
    })
    .from(newsCategoriesTable)
    .innerJoin(
      categoriesTable,
      eq(newsCategoriesTable.categoryId, categoriesTable.id)
    )
    .where(eq(newsCategoriesTable.newsId, article.id))
  const relatedArticles = await db
    .select({
      id: newsTable.id,
      publishedAt: newsTable.publishedAt,
      slug: newsTable.slug,
      title: newsTable.title
    })
    .from(newsTable)
    .where(and(eq(newsTable.status, 'published'), ne(newsTable.id, article.id)))
    .orderBy(desc(newsTable.publishedAt), desc(newsTable.updatedAt))
    .limit(3)

  return {
    ...article,
    body: article.body ?? '',
    categories,
    coverImage: article.coverImage ?? '',
    publishedAt: article.publishedAt ?? new Date(),
    relatedArticles,
    subtitle: article.subtitle ?? ''
  }
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
      <path
        d="M19.1 4.9A9.7 9.7 0 0 0 3.9 16.6L3 21l4.5-1.2a9.6 9.6 0 0 0 4.7 1.2 9.7 9.7 0 0 0 6.9-16.1Zm-6.9 14.4a7.9 7.9 0 0 1-4-1.1l-.3-.2-2.6.7.7-2.5-.2-.3a8 8 0 1 1 6.4 3.4Zm4.3-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.3 0-.4.1-.6l.4-.4c.1-.2.2-.3.3-.5a.5.5 0 0 0 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8 14.6 14.6 0 0 0 1.4.5 3.4 3.4 0 0 0 1.6.1 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.2-.3-.2-.5-.3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
      <path
        d="M13.5 21v-7.7h2.6l.4-3h-3V8.4c0-.9.2-1.5 1.5-1.5h1.6V4.2c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v2.1H7.4v3h2.7V21h3.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M14.2 10.2 22 1h-1.9l-6.8 8-5.4-8H1.7l8.2 12L1.7 23h1.9l7.1-8.5 5.7 8.5h6.1l-8.3-12.8Zm-2.5 3-1-.1L3.3 2.4h3.7l5.3 7.7 1 1.4 7.7 10.1h-3.7l-5.6-8.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
      <path
        d="M21.7 4.3 18.4 20c-.2 1.1-.9 1.4-1.9.9l-5.2-3.8-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.3 9.6-8.7c.4-.4-.1-.6-.6-.2L5.3 13.3.2 11.7c-1.1-.4-1.1-1.1.2-1.6L20.2 2.5c.9-.3 1.7.2 1.5 1.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function generateStaticParams() {
  return getPublishedArticles().map(article => ({
    slug: createNewsSlug(article.title)
  }))
}

export async function generateMetadata({
  params
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const dbArticle = await getDbArticle(slug)
  const article = dbArticle ?? getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Noticia nao encontrada | Giro Radar Noticias'
    }
  }

  const url = `${siteUrl}/noticias/${slug}`

  return {
    title: `${article.title} | Giro Radar Noticias`,
    description: article.subtitle,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: article.title,
      description: article.subtitle,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
      url
    }
  }
}

export default async function NewsDetailPage({
  params,
  searchParams
}: NewsDetailPageProps) {
  const { slug } = await params
  const query = await searchParams
  const dbArticle = await getDbArticle(slug, query?.preview)
  const seedArticle = dbArticle ? null : getArticleBySlug(slug)
  const article = dbArticle ?? seedArticle

  if (!article) {
    notFound()
  }

  const categories = dbArticle
    ? dbArticle.categories
    : getArticleCategories(seedArticle?.categories ?? [])
  const author = dbArticle
    ? { name: dbArticle.authorName ?? 'Redacao Giro Radar' }
    : getArticleAuthor(seedArticle?.authorId ?? '')
  const articleUrl = `${siteUrl}/noticias/${slug}`
  const encodedUrl = encodeURIComponent(articleUrl)
  const encodedTitle = encodeURIComponent(article.title)
  const relatedArticles = dbArticle
    ? dbArticle.relatedArticles
    : getPublishedArticles()
        .filter(relatedArticle => relatedArticle.id !== article.id)
        .slice(0, 3)

  const shareLinks = [
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: <WhatsAppIcon />
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon />
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <XIcon />
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <TelegramIcon />
    }
  ]

  return (
    <main className="mx-auto grid w-full max-w-[1250px] grid-cols-1 gap-7 px-5 py-7 lg:grid-cols-[minmax(0,1fr)_360px]">
      <article className="min-w-0">
        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map(category => (
            <Link
              className="rounded bg-[#f00018] px-3 py-1.5 text-sm font-black uppercase text-white"
              href={`/#${category.slug}`}
              key={category.id}
            >
              {category.name}
            </Link>
          ))}
        </div>

        <h1 className="max-w-[900px] text-[34px] font-black italic leading-[1.06] text-[#ffcc00] sm:text-[44px] lg:text-[56px]">
          {article.title}
        </h1>
        <p className="mt-4 max-w-[880px] text-xl font-bold leading-normal text-zinc-200 lg:text-2xl">
          {article.subtitle}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y border-[#f00018]/45 py-4 text-sm font-bold text-zinc-300">
          <span>Por {author?.name ?? 'Redacao Giro Radar'}</span>
          <span>{dateFormatter.format(new Date(article.publishedAt))}</span>
          <span>{getReadingTime(article.body)} min de leitura</span>
        </div>

        {article.coverImage ? (
          <figure className="my-7 overflow-hidden rounded border border-[#f00018]/45 bg-[#0c0c0f]">
            <img
              alt=""
              className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              src={article.coverImage}
            />
          </figure>
        ) : null}

        <div
          className="news-article-body"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </article>

      <aside className="grid content-start gap-6">
        <section className="rounded-[5px] border border-[#f00018]/45 bg-[#0c0c0f] p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <h2 className="border-b-2 border-[#f00018] pb-2.5 text-2xl font-black italic uppercase text-[#ffcc00]">
            Compartilhar
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {shareLinks.map(link => (
              <a
                aria-label={`Compartilhar no ${link.label}`}
                className="flex min-h-12 items-center justify-center rounded-md border border-[#f00018]/55 bg-[#050505] px-3 text-white transition hover:bg-[#f00018]"
                href={link.href}
                key={link.label}
                rel="noreferrer"
                target="_blank"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[5px] border border-[#f00018]/45 bg-[#0c0c0f] p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <h2 className="border-b-2 border-[#f00018] pb-2.5 text-2xl font-black italic uppercase text-[#ffcc00]">
            Mais noticias
          </h2>
          <div className="mt-2 grid gap-0">
            {relatedArticles.map(relatedArticle => (
              <Link
                className="grid gap-2 border-b border-[#f00018]/35 py-4"
                href={`/noticias/${'slug' in relatedArticle && relatedArticle.slug ? relatedArticle.slug : createNewsSlug(relatedArticle.title)}`}
                key={relatedArticle.id}
              >
                <b className="text-lg leading-tight">{relatedArticle.title}</b>
                <small className="font-bold text-[#ffcc00]">
                  {dateFormatter.format(
                    new Date(relatedArticle.publishedAt ?? article.publishedAt ?? 0)
                  )}
                </small>
              </Link>
            ))}
          </div>
        </section>
      </aside>
    </main>
  )
}
