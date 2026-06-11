import Link from 'next/link'

const actionGroups = [
  {
    title: 'Gestão de notícias',
    actions: [
      { href: '/admin', label: 'Todas as notícias', description: 'Lista editorial' },
      {
        href: '/admin/noticias',
        label: 'Nova notícia',
        description: 'Criar matéria'
      },
      {
        href: '/admin/visao-geral',
        label: 'Fila editorial',
        description: 'Status e revisão'
      }
    ]
  },
  {
    title: 'Gestão de categorias',
    actions: [
      {
        href: '/admin/noticias',
        label: 'Categorias',
        description: 'Criar e revisar editorias'
      },
      {
        href: '/admin/visao-geral',
        label: 'Uso por matéria',
        description: 'Categorias vinculadas'
      }
    ]
  },
  {
    title: 'Administração de usuário',
    actions: [
      {
        href: '/admin/visao-geral',
        label: 'Usuários',
        description: 'Equipe e convites'
      },
      {
        href: '/admin/visao-geral',
        label: 'Permissões',
        description: 'Perfis de acesso'
      }
    ]
  }
]

export default function AdminDashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid min-h-full lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-[#f00018]/45 bg-[#050505]/95 px-4 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.32)] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
        <div className="flex items-center justify-between gap-4 lg:grid lg:gap-8">
          <Link className="grid leading-none" href="/admin">
            <span className="text-2xl font-black italic text-white">
              GIRO <span className="text-[#f00018]">RADAR</span>
            </span>
            <span className="mt-1 text-xs font-black uppercase tracking-[0.35em] text-[#ffcc00]">
              Admin
            </span>
          </Link>

          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#ffcc00] px-4 text-sm font-black uppercase text-[#111114]"
            href="/"
          >
            Sair
          </Link>
        </div>

        <div className="mt-5 grid gap-4 lg:mt-8">
          <section className="rounded-md border border-[#f00018]/35 bg-[#0c0c0f] p-4">
            <span className="text-xs font-black uppercase tracking-[0.08em] text-[#ffcc00]">
              Usuário logado
            </span>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f00018] text-lg font-black text-white">
                A
              </span>
              <div className="min-w-0">
                <strong className="block truncate text-white">
                  Administrador
                </strong>
                <small className="block truncate text-zinc-400">
                  admin@giroradar.com.br
                </small>
              </div>
            </div>
          </section>

          <nav className="grid gap-3">
            {actionGroups.map((group, index) => (
              <details
                className="group rounded-md border border-[#f00018]/30 bg-[#0c0c0f]"
                key={group.title}
                open={index === 0}
              >
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#ffcc00] [&::-webkit-details-marker]:hidden">
                  {group.title}
                  <span className="text-lg leading-none text-white transition group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <div className="grid gap-2 border-t border-[#f00018]/25 p-2">
                  {group.actions.map((action) => (
                    <Link
                      className="grid rounded-md border border-transparent bg-[#050505] px-3 py-3 text-white transition hover:border-[#ffcc00] hover:bg-[#171717]"
                      href={action.href}
                      key={`${group.title}-${action.label}`}
                    >
                      <span className="font-black uppercase">
                        {action.label}
                      </span>
                      <small className="mt-1 text-zinc-400">
                        {action.description}
                      </small>
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 pb-8">{children}</div>
    </div>
  )
}
