import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { asc, eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import {
  eyebrowClass,
  panelClass,
  roleLabels,
  statusClass
} from '@/lib/admin/ui'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'
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
      id: userTable.id,
      roles: userTable.roles
    })
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1)

  if (!currentUser?.roles.includes('admin')) {
    redirect('/admin')
  }

  return currentUser
}

async function updateUserAccess(formData: FormData) {
  'use server'

  const currentUser = await requireAdmin()
  const targetUserId = String(formData.get('userId') ?? '')

  if (!targetUserId) {
    return
  }

  const selectedRoles = formData
    .getAll('roles')
    .map(String)
    .filter((role): role is Role => allowedRoles.includes(role as Role))
  const roles = targetUserId === currentUser.id && !selectedRoles.includes('admin')
    ? [...selectedRoles, 'admin']
    : selectedRoles
  const active = targetUserId === currentUser.id ? true : formData.get('active') === 'on'

  await db
    .update(userTable)
    .set({
      active,
      roles,
      updatedAt: new Date()
    })
    .where(eq(userTable.id, targetUserId))

  revalidatePath('/admin/usuarios')
}

export default async function AdminUsersPage() {
  const currentUser = await requireAdmin()
  const users = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      active: userTable.active,
      roles: userTable.roles,
      createdAt: userTable.createdAt
    })
    .from(userTable)
    .orderBy(asc(userTable.name), asc(userTable.email))

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 pt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className={eyebrowClass}>Administração</span>
          <h1 className="text-3xl font-black italic leading-tight text-white">
            Usuários
          </h1>
          <p className="mt-2 text-sm text-zinc-300">
            Gerencie perfis de acesso e disponibilidade da equipe.
          </p>
        </div>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#ffcc00] px-5 text-sm font-black uppercase text-[#111114] transition hover:bg-[#e5b800] sm:w-auto"
          href="/admin/usuarios/novo"
        >
          Novo usuário
        </Link>
      </div>

      <section className={panelClass}>
        <div className="hidden overflow-hidden rounded-md border border-[#f00018]/45 lg:block">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#f00018] text-xs uppercase tracking-[0.08em] text-white">
              <tr>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Permissões</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f00018]/35">
              {users.map(user => (
                <tr className="bg-[#0c0c0f] align-top" key={user.id}>
                  <td className="px-4 py-4">
                    <strong className="block text-white">{user.name}</strong>
                    <small className="mt-1 block text-zinc-400">{user.email}</small>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`${statusClass} ${
                        user.active === false
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {user.active === false ? 'Inativo' : 'Ativo'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <form action={updateUserAccess} className="grid gap-3">
                      <input name="userId" type="hidden" value={user.id} />
                      <div className="flex flex-wrap gap-3">
                        {allowedRoles.map(role => (
                          <label
                            className="flex items-center gap-2 rounded-md border border-[#f00018]/35 bg-[#050505] px-3 py-2 text-sm font-bold text-zinc-200"
                            key={`${user.id}-${role}`}
                          >
                            <input
                              className="h-4 w-4 accent-[#ffcc00]"
                              defaultChecked={user.roles.includes(role)}
                              name="roles"
                              type="checkbox"
                              value={role}
                            />
                            {roleLabels[role]}
                          </label>
                        ))}
                        <label className="flex items-center gap-2 rounded-md border border-[#f00018]/35 bg-[#050505] px-3 py-2 text-sm font-bold text-zinc-200">
                          <input
                            className="h-4 w-4 accent-[#ffcc00]"
                            defaultChecked={user.active !== false}
                            disabled={user.id === currentUser.id}
                            name="active"
                            type="checkbox"
                          />
                          Ativo
                        </label>
                      </div>
                      <div className="flex justify-end">
                        <Button size="sm" type="submit">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-zinc-400">
                    {user.id === currentUser.id ? 'Você' : 'Equipe'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 lg:hidden">
          {users.map(user => (
            <article
              className="rounded-md border border-[#f00018]/45 bg-[#050505] p-4"
              key={user.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black leading-tight text-white">
                    {user.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">{user.email}</p>
                </div>
                <span
                  className={`${statusClass} ${
                    user.active === false
                      ? 'bg-zinc-800 text-zinc-300'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {user.active === false ? 'Inativo' : 'Ativo'}
                </span>
              </div>

              <form action={updateUserAccess} className="mt-4 grid gap-3">
                <input name="userId" type="hidden" value={user.id} />
                <div className="grid gap-2">
                  {allowedRoles.map(role => (
                    <label
                      className="flex items-center gap-2 rounded-md border border-[#f00018]/35 bg-[#0c0c0f] px-3 py-2 text-sm font-bold text-zinc-200"
                      key={`${user.id}-mobile-${role}`}
                    >
                      <input
                        className="h-4 w-4 accent-[#ffcc00]"
                        defaultChecked={user.roles.includes(role)}
                        name="roles"
                        type="checkbox"
                        value={role}
                      />
                      {roleLabels[role]}
                    </label>
                  ))}
                  <label className="flex items-center gap-2 rounded-md border border-[#f00018]/35 bg-[#0c0c0f] px-3 py-2 text-sm font-bold text-zinc-200">
                    <input
                      className="h-4 w-4 accent-[#ffcc00]"
                      defaultChecked={user.active !== false}
                      disabled={user.id === currentUser.id}
                      name="active"
                      type="checkbox"
                    />
                    Ativo
                  </label>
                </div>
                <Button size="sm" type="submit">
                  Salvar
                </Button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
