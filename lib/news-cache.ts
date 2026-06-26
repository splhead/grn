'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateNewsArticle(slug: string) {
  revalidatePath(`/noticias/${slug}`)
  revalidatePath('/')
}
