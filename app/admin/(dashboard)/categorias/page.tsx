import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { asc, eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { eyebrowClass, panelClass } from '@/lib/admin/ui'
import { db } from '@/lib/db'
import { categoriesTable, user as userTable } from '@/lib/db/schema'
import { getSession } from '@/lib/server'

async function requireCategoryManager() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  const [currentUser] = await db
    .select({
      roles: userTable.roles
    })
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1)

  if (
    !currentUser?.roles.some(role => role === 'admin' || role === 'reviewer')
  ) {
    redirect('/admin')
  }
}

function normalizeSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function categorySlugExists(slug: string, ignoredCategoryId?: string) {
  const categories = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable)
    .where(eq(categoriesTable.slug, slug))
    .limit(1)

  return categories.some(category => category.id !== ignoredCategoryId)
}

async function createCategory(formData: FormData) {
  'use server'

  await requireCategoryManager()

  const name = String(formData.get('name') ?? '').trim()
  const slug = normalizeSlug(String(formData.get('slug') ?? name))
  const description = String(formData.get('description') ?? '').trim()

  if (!name || !slug) {
    redirect('/admin/categorias?erro=dados')
  }

  if (await categorySlugExists(slug)) {
    redirect('/admin/categorias?erro=slug')
  }

  await db.insert(categoriesTable).values({
    name,
    slug,
    description: description || null
  })

  revalidatePath('/admin/categorias')
  redirect('/admin/categorias?sucesso=criada')
}

async function updateCategory(formData: FormData) {
  'use server'

  await requireCategoryManager()

  const categoryId = String(formData.get('categoryId') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const slug = normalizeSlug(String(formData.get('slug') ?? name))
  const description = String(formData.get('description') ?? '').trim()

  if (!categoryId || !name || !slug) {
    redirect('/admin/categorias?erro=dados')
  }

  const [category] = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable)
    .where(eq(categoriesTable.id, categoryId))
    .limit(1)

  if (!category) {
    redirect('/admin/categorias?erro=nao-encontrada')
  }

  if (await categorySlugExists(slug, categoryId)) {
    redirect('/admin/categorias?erro=slug')
  }

  await db
    .update(categoriesTable)
    .set({
      name,
      slug,
      description: description || null
    })
    .where(eq(categoriesTable.id, categoryId))

  revalidatePath('/admin/categorias')
  redirect('/admin/categorias?sucesso=atualizada')
}

async function deleteCategory(formData: FormData) {
  'use server'

  await requireCategoryManager()

  const categoryId = String(formData.get('categoryId') ?? '')

  if (!categoryId) {
    redirect('/admin/categorias?erro=dados')
  }

  await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId))

  revalidatePath('/admin/categorias')
  redirect('/admin/categorias?sucesso=excluida')
}

function getFeedbackMessage(feedback?: string, error?: string) {
  if (error === 'slug') {
    return {
      tone: 'error',
      text: 'Já existe uma categoria com este slug.'
    }
  }

  if (error === 'dados') {
    return {
      tone: 'error',
      text: 'Preencha nome e slug para salvar a categoria.'
    }
  }

  if (error === 'nao-encontrada') {
    return {
      tone: 'error',
      text: 'Categoria não encontrada.'
    }
  }

  if (feedback === 'criada') {
    return {
      tone: 'success',
      text: 'Categoria criada com sucesso.'
    }
  }

  if (feedback === 'atualizada') {
    return {
      tone: 'success',
      text: 'Categoria atualizada com sucesso.'
    }
  }

  if (feedback === 'excluida') {
    return {
      tone: 'success',
      text: 'Categoria excluída com sucesso.'
    }
  }

  return null
}

export default async function AdminCategoriesPage({
  searchParams
}: {
  searchParams?: Promise<{ erro?: string; sucesso?: string }>
}) {
  await requireCategoryManager()

  const params = await searchParams
  const feedback = getFeedbackMessage(params?.sucesso, params?.erro)
  const categories = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description
    })
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.name), asc(categoriesTable.slug))

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 pt-7">
      <div>
        <span className={eyebrowClass}>Gestão de categorias</span>
        <h1 className="text-3xl font-black italic leading-tight text-white">
          Categorias
        </h1>
        <p className="mt-2 text-sm text-zinc-300">
          Cadastre categorias, ajuste slugs e exclua categorias fora de uso.
        </p>
      </div>

      {feedback ? (
        <p
          className={`rounded-md border px-4 py-3 text-sm font-bold ${
            feedback.tone === 'error'
              ? 'border-[#f00018]/45 bg-[#f00018]/10 text-red-100'
              : 'border-green-500/45 bg-green-500/10 text-green-100'
          }`}
        >
          {feedback.text}
        </p>
      ) : null}

      <section className={panelClass}>
        <div className="mb-5">
          <span className={eyebrowClass}>Nova categoria</span>
          <h2 className="text-2xl font-black leading-tight">Criar categoria</h2>
        </div>

        <form action={createCategory} className="grid gap-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <Label>
              Nome
              <Input name="name" placeholder="Ex.: Política" required />
            </Label>
            <Label>
              Slug
              <Input name="slug" placeholder="politica" />
            </Label>
          </div>
          <Label>
            Descrição
            <Input
              name="description"
              placeholder="Resumo curto para organização editorial"
            />
          </Label>
          <div className="flex justify-end">
            <Button className="w-full sm:w-auto" type="submit">
              Criar categoria
            </Button>
          </div>
        </form>
      </section>

      <section className={panelClass}>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className={eyebrowClass}>Categorias cadastradas</span>
            <h2 className="text-2xl font-black leading-tight">
              {categories.length} categorias
            </h2>
          </div>
        </div>

        <div className="grid gap-3">
          {categories.length === 0 ? (
            <p className="rounded-md border border-[#f00018]/35 bg-[#050505] px-4 py-5 text-sm font-bold text-zinc-300">
              Nenhuma categoria cadastrada ainda.
            </p>
          ) : null}

          {categories.map(category => (
            <article
              className="grid gap-4 rounded-md border border-[#f00018]/45 bg-[#050505] p-4"
              key={category.id}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-black leading-tight text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">/{category.slug}</p>
                </div>
              </div>

              <form action={updateCategory} className="grid gap-4">
                <input name="categoryId" type="hidden" value={category.id} />
                <div className="grid gap-4 lg:grid-cols-2">
                  <Label>
                    Nome
                    <Input defaultValue={category.name} name="name" required />
                  </Label>
                  <Label>
                    Slug
                    <Input defaultValue={category.slug} name="slug" required />
                  </Label>
                </div>
                <Label>
                  Descrição
                  <Input
                    defaultValue={category.description ?? ''}
                    name="description"
                  />
                </Label>
                <div className="flex justify-end">
                  <Button className="w-full sm:w-auto" size="sm" type="submit">
                    Salvar
                  </Button>
                </div>
              </form>

              <form action={deleteCategory} className="flex justify-end">
                <input name="categoryId" type="hidden" value={category.id} />
                <Button
                  className="w-full sm:w-auto"
                  size="sm"
                  type="submit"
                  variant="outline"
                >
                  Excluir
                </Button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
