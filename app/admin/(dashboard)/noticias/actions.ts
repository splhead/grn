'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { and, eq, ne } from 'drizzle-orm'
import { db } from '@/lib/db'
import { newsCategoriesTable, newsTable } from '@/lib/db/schema'
import { createNewsSlug } from '@/lib/news'
import { getSession } from '@/lib/server'

type NewsFormIntent = 'draft' | 'published' | 'save'
type NewsPlacement = 'main_cover' | 'highlights' | 'latest'
type NewsStatus = 'draft' | 'review' | 'published' | 'archived'

async function requireAuthor() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  return session.user
}

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function getBodyPlainText(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getPlacement(value: string): NewsPlacement {
  const placements: NewsPlacement[] = ['main_cover', 'highlights', 'latest']

  return placements.includes(value as NewsPlacement)
    ? (value as NewsPlacement)
    : 'latest'
}

async function createUniqueNewsSlug(title: string, ignoredArticleId?: string) {
  const baseSlug = createNewsSlug(title)
  let slug = baseSlug
  let suffix = 2

  while (true) {
    const existingArticles = await db
      .select({ id: newsTable.id })
      .from(newsTable)
      .where(
        ignoredArticleId
          ? and(eq(newsTable.slug, slug), ne(newsTable.id, ignoredArticleId))
          : eq(newsTable.slug, slug)
      )
      .limit(1)

    if (existingArticles.length === 0) {
      return slug
    }

    slug = `${baseSlug}-${suffix}`
    suffix += 1
  }
}

function validateNews({
  body,
  categoryIds,
  mode,
  redirectPath,
  subtitle,
  title
}: {
  body: string
  categoryIds: string[]
  mode: NewsFormIntent
  redirectPath: string
  subtitle: string
  title: string
}) {
  const hasBody = Boolean(getBodyPlainText(body))

  if (!title) {
    redirect(`${redirectPath}?erro=dados`)
  }

  if (mode === 'published') {
    if (!subtitle || !hasBody) {
      redirect(`${redirectPath}?erro=publicacao`)
    }

    if (categoryIds.length === 0) {
      redirect(`${redirectPath}?erro=categorias`)
    }
  }
}

function getPublishedAt(value: string, status: NewsStatus) {
  if (value) {
    return new Date(value)
  }

  return status === 'published' ? new Date() : null
}

function revalidateNewsPaths() {
  revalidatePath('/admin')
  revalidatePath('/admin/noticias')
  revalidatePath('/admin/visao-geral')
  revalidatePath('/')
  revalidatePath('/noticias/[slug]', 'page')
}

export async function createNews(formData: FormData) {
  const author = await requireAuthor()
  const intent = getStringValue(formData, 'intent') as NewsFormIntent
  const title = getStringValue(formData, 'title')
  const subtitle = getStringValue(formData, 'subtitle')
  const coverImage = getStringValue(formData, 'coverImage')
  const placement = getPlacement(getStringValue(formData, 'placement'))
  const publishedAtValue = getStringValue(formData, 'publishedAt')
  const body = getStringValue(formData, 'body')
  const categoryIds = formData
    .getAll('categoryIds')
    .map(categoryId => String(categoryId))
    .filter(Boolean)
  const status: NewsStatus = intent === 'published' ? 'published' : 'draft'

  validateNews({
    body,
    categoryIds,
    mode: intent,
    redirectPath: '/admin/noticias',
    subtitle,
    title
  })

  const slug = await createUniqueNewsSlug(title)

  await db.transaction(async tx => {
    const [article] = await tx
      .insert(newsTable)
      .values({
        authorId: author.id,
        body,
        coverImage: coverImage || null,
        placement,
        publishedAt: getPublishedAt(publishedAtValue, status),
        slug,
        status,
        subtitle: subtitle || null,
        title
      })
      .returning({ id: newsTable.id })

    if (categoryIds.length > 0) {
      await tx.insert(newsCategoriesTable).values(
        categoryIds.map(categoryId => ({
          categoryId,
          newsId: article.id
        }))
      )
    }
  })

  revalidateNewsPaths()

  redirect(
    status === 'published'
      ? '/admin/noticias?sucesso=publicada'
      : '/admin/noticias?sucesso=rascunho'
  )
}

export async function updateNews(formData: FormData) {
  const articleId = getStringValue(formData, 'articleId')
  const intent = getStringValue(formData, 'intent') as NewsFormIntent
  const title = getStringValue(formData, 'title')
  const subtitle = getStringValue(formData, 'subtitle')
  const coverImage = getStringValue(formData, 'coverImage')
  const placement = getPlacement(getStringValue(formData, 'placement'))
  const publishedAtValue = getStringValue(formData, 'publishedAt')
  const body = getStringValue(formData, 'body')
  const categoryIds = formData
    .getAll('categoryIds')
    .map(categoryId => String(categoryId))
    .filter(Boolean)
  const redirectPath = `/admin/noticias/${articleId}`

  await requireAuthor()

  if (!articleId) {
    redirect('/admin?erro=dados')
  }

  const [currentArticle] = await db
    .select({
      slug: newsTable.slug,
      status: newsTable.status
    })
    .from(newsTable)
    .where(eq(newsTable.id, articleId))
    .limit(1)

  if (!currentArticle) {
    redirect('/admin?erro=nao-encontrada')
  }

  validateNews({
    body,
    categoryIds,
    mode: intent,
    redirectPath,
    subtitle,
    title
  })

  const status: NewsStatus =
    intent === 'published' ? 'published' : currentArticle.status
  const slug =
    currentArticle.slug || (await createUniqueNewsSlug(title, articleId))

  await db.transaction(async tx => {
    await tx
      .update(newsTable)
      .set({
        body,
        coverImage: coverImage || null,
        placement,
        publishedAt: getPublishedAt(publishedAtValue, status),
        slug,
        status,
        subtitle: subtitle || null,
        title,
        updatedAt: new Date()
      })
      .where(eq(newsTable.id, articleId))

    await tx
      .delete(newsCategoriesTable)
      .where(eq(newsCategoriesTable.newsId, articleId))

    if (categoryIds.length > 0) {
      await tx.insert(newsCategoriesTable).values(
        categoryIds.map(categoryId => ({
          categoryId,
          newsId: articleId
        }))
      )
    }
  })

  revalidateNewsPaths()
  redirect(`${redirectPath}?sucesso=atualizada`)
}
