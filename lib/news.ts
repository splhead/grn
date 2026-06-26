import { getSeedData } from '@/lib/news-seed'
import type { Category } from '@/lib/news-seed'

export function createNewsSlug(title: string) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getPublishedArticles() {
  return getSeedData()
    .articles.filter(article => article.status === 'published')
    .sort(
      (firstArticle, secondArticle) =>
        new Date(secondArticle.publishedAt).getTime() -
        new Date(firstArticle.publishedAt).getTime()
    )
}

export function getArticleBySlug(slug: string) {
  return getPublishedArticles().find(
    article => createNewsSlug(article.title) === slug
  )
}

export function getArticleCategories(categoryIds: string[]) {
  const categories = getSeedData().categories

  return categoryIds
    .map(categoryId => categories.find(category => category.id === categoryId))
    .filter((category): category is Category => Boolean(category))
}

export function getArticleAuthor(authorId: string) {
  return getSeedData().users.find(user => user.id === authorId)
}
