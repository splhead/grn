import { revalidatePath, revalidateTag } from 'next/cache'

export const NEWS_CACHE_TAG = 'news'
export const HOMEPAGE_NEWS_CACHE_TAG = 'homepage-news'
export const NEWS_LIST_CACHE_TAG = 'news-list'

export function revalidatePublicNewsCache(slug?: string | null) {
  revalidateTag(NEWS_CACHE_TAG, 'max')
  revalidateTag(HOMEPAGE_NEWS_CACHE_TAG, 'max')
  revalidateTag(NEWS_LIST_CACHE_TAG, 'max')

  revalidatePath('/')
  revalidatePath('/noticias')
  revalidatePath('/noticias/[slug]', 'page')

  if (slug) {
    revalidatePath(`/noticias/${slug}`)
  }
}

export async function revalidateNewsArticle(slug: string) {
  revalidatePublicNewsCache(slug)
}
