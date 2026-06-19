import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { hashPassword } from 'better-auth/crypto'
import { eq } from 'drizzle-orm'
import { v7 as uuidv7 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { eyebrowClass, panelClass, roleLabels } from '@/lib/admin/ui'
import { db } from '@/lib/db'
import { account, user as userTable } from '@/lib/db/schema'
import { getSession } from '@/lib/server'
import type { Role } from '@/lib/news-seed'

const allowedRoles: Role[] = ['admin', 'editor', 'reviewer']

async function requireAdmin() {
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

  if (!currentUser?.roles.includes('admin')) {
    redirect('/admin')
  }
}

async function createUser(formData: FormData) {
  'use server'

  await requireAdmin()

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const roles = formData
    .getAll('roles')
    .map(String)
    .filter((role): role is Role => allowedRoles.includes(role as Role))
  const active = formData.get('active') === 'on'

  if (!name || !email || password.length < 8 || roles.length === 0) {
    redirect('/admin/usuarios/novo?erro=dados')
  }

  const [existingUser] = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1)

  if (existingUser) {
    redirect('/admin/usuarios/novo?erro=email')
  }

  const userId = uuidv7()

  await db.transaction(async tx => {
    await tx.insert(userTable).values({
      id: userId,
      name,
      email,
      emailVerified: true,
      active,
      roles
    })

    await tx.insert(account).values({
      id: uuidv7(),
      accountId: userId,
      providerId: 'credential',
      userId,
      password: await hashPassword(password)
    })
  })

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios')
}

function getErrorMessage(error?: string) {
  if (error === 'email') {
    return 'Já existe um usuário cadastrado com este e-mail.'
  }

  if (error === 'dados') {
    return 'Preencha nome, e-mail, senha com 8 caracteres ou mais e pelo menos uma permissão.'
  }

  return ''
}

export default async function NewAdminUserPage({
  searchParams
}: {
  searchParams?: Promise<{ erro?: string }>
}) {
  await requireAdmin()

  const errorMessage = getErrorMessage((await searchParams)?.erro)

  return (
    <main className="mx-auto grid w-full max-w-[900px] gap-6 px-6 pt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className={eyebrowClass}>Administração</span>
          <h1 className="text-3xl font-black italic leading-tight text-white">
            Novo usuário
          </h1>
          <p className="mt-2 text-sm text-zinc-300">
            Crie um acesso para a equipe e defina as permissões iniciais.
          </p>
        </div>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#f00018]/55 bg-[#0c0c0f] px-5 text-sm font-black uppercase text-white transition hover:bg-[#f00018]"
          href="/admin/usuarios"
        >
          Gerir usuários
        </Link>
      </div>

      <section className={panelClass}>
        <form action={createUser} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Label>
              Nome
              <Input
                autoComplete="name"
                name="name"
                placeholder="Nome completo"
                required
              />
            </Label>
            <Label>
              E-mail
              <Input
                autoComplete="email"
                name="email"
                placeholder="usuario@giroradarnoticias.com.br"
                required
                type="email"
              />
            </Label>
          </div>

          <Label>
            Senha inicial
            <Input
              autoComplete="new-password"
              minLength={8}
              name="password"
              placeholder="Mínimo de 8 caracteres"
              required
              type="password"
            />
          </Label>

          <fieldset className="grid gap-3 rounded-md border border-[#f00018]/45 p-4 text-sm font-extrabold text-zinc-200">
            <legend className="px-2">Permissões</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {allowedRoles.map(role => (
                <label
                  className="flex min-h-12 items-center gap-3 rounded-md border border-[#f00018]/35 bg-[#050505] p-3 font-bold"
                  key={role}
                >
                  <Checkbox
                    defaultChecked={role === 'editor'}
                    name="roles"
                    value={role}
                  />
                  {roleLabels[role]}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-3 rounded-md border border-[#f00018]/35 bg-[#050505] p-3 text-sm font-bold text-zinc-200">
            <Checkbox defaultChecked name="active" />
            Usuário ativo
          </label>

          {errorMessage ? (
            <p className="rounded-md border border-[#f00018]/45 bg-[#f00018]/10 px-4 py-3 text-sm font-bold text-red-100">
              {errorMessage}
            </p>
          ) : null}

          <div className="sticky bottom-0 -mx-4 grid gap-3 border-t border-[#f00018]/45 bg-[#050505]/95 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] backdrop-blur sm:static sm:mx-0 sm:flex sm:justify-end sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#f00018]/55 bg-[#0c0c0f] px-5 font-black uppercase text-white transition hover:bg-[#f00018]"
              href="/admin/usuarios"
            >
              Cancelar
            </Link>
            <Button type="submit">Criar usuário</Button>
          </div>
        </form>
      </section>
    </main>
  )
}
