import { revalidateTag, unstable_cache } from 'next/cache'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categoriesTable } from '@/lib/db/schema'

const CATEGORIES_CACHE_TAG = 'categories'

export const getCachedCategories = unstable_cache(
  async () =>
    db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug
      })
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.name)),
  ['categories'],
  {
    tags: [CATEGORIES_CACHE_TAG]
  }
)

export const getMenuCategories = getCachedCategories

export function revalidateCategoriesCache() {
  revalidateTag(CATEGORIES_CACHE_TAG, 'max')
}

export const revalidateMenuCategories = revalidateCategoriesCache
