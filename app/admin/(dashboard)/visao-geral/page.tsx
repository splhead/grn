import { seedData, type Role } from '@/lib/news-seed'
import {
  categoryNames,
  compactPanelClass,
  editorialUsers,
  eyebrowClass,
  formatDate,
  panelClass,
  roleLabels,
  rolePermissions,
  statusClass
} from '@/lib/admin/ui'

export default function AdminOverviewPage() {
  const [featuredArticle, ...latestArticles] = seedData.articles
  const categories = seedData.categories

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 pt-7">
      <section className="relative grid min-h-[310px] grid-cols-1 gap-6 overflow-hidden border border-[#f00018]/45 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center p-6 text-white before:absolute before:inset-0 before:bg-[linear-gradient(110deg,rgba(0,0,0,0.94),rgba(90,0,8,0.58))] before:content-[''] lg:grid-cols-[1fr_280px] lg:p-10">
        <div className="relative z-10 self-end">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#ffcc00]">
            Painel administrativo
          </span>
          <h1 className="mb-3.5 max-w-[720px] text-[32px] font-black italic leading-none lg:text-[52px]">
            Visão geral editorial
          </h1>
          <p className="max-w-[760px] text-xl leading-normal text-zinc-200">
            Acompanhe matérias, fila editorial, usuários, permissões e dados
            iniciais do portal.
          </p>
        </div>
        <div className="relative z-10 grid self-end rounded-lg border border-white/30 bg-white/10 p-5">
          <span className="text-[#dce7f5]">Status editorial</span>
          <strong className="text-4xl">3 noticias</strong>
          <small className="text-[#dce7f5]">1 em revisao, 2 publicadas</small>
        </div>
      </section>

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="grid gap-6">
          <section className={panelClass}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <span className={eyebrowClass}>Materia principal</span>
                <h2 className="text-2xl font-black leading-tight">
                  {featuredArticle.title}
                </h2>
              </div>
              <span className={`${statusClass} bg-[#f00018] text-white`}>
                Publicado
              </span>
            </div>
            <img
              src={featuredArticle.coverImage}
              alt=""
              className="aspect-[16/7] w-full rounded-md object-cover"
            />
            <p className="my-5 text-[19px] leading-normal text-zinc-300">
              {featuredArticle.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-[#ffcc00]">
              <span>{categoryNames(featuredArticle, categories)}</span>
              <span>Publicada em {formatDate(featuredArticle.publishedAt)}</span>
              <span>Atualizada em {formatDate(featuredArticle.updatedAt)}</span>
            </div>
          </section>

          <section className={panelClass}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <span className={eyebrowClass}>Fila editorial</span>
                <h2 className="text-2xl font-black leading-tight">
                  Noticias cadastradas
                </h2>
              </div>
            </div>
            <div className="grid gap-3.5">
              {latestArticles.map((article) => (
                <article
                  key={article.id}
                  className="grid grid-cols-1 gap-4 border-b border-[#f00018]/35 pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[140px_1fr]"
                >
                  <img
                    src={article.coverImage}
                    alt=""
                    className="aspect-[1.25/1] w-full rounded-md object-cover"
                  />
                  <div>
                    <div className="flex items-start justify-between gap-3.5">
                      <h3 className="text-[21px] font-black leading-tight">
                        {article.title}
                      </h3>
                      <span
                        className={`${statusClass} ${
                          article.status === 'review'
                            ? 'bg-[#ffcc00] text-[#111114]'
                            : 'bg-[#f00018] text-white'
                        }`}
                      >
                        {article.status === 'review' ? 'Revisao' : 'Publicado'}
                      </span>
                    </div>
                    <p className="my-2 leading-normal text-zinc-300">
                      {article.subtitle}
                    </p>
                    <small className="block leading-normal text-zinc-400">
                      {categoryNames(article, categories)} · Atualizada em{' '}
                      {formatDate(article.updatedAt)}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid gap-6">
          <section className={compactPanelClass}>
            <span className={eyebrowClass}>Perfis</span>
            <h2 className="text-2xl font-black leading-tight">Permissoes</h2>
            <div className="mt-4 grid gap-3.5">
              {(Object.keys(roleLabels) as Role[]).map((role) => (
                <article
                  key={role}
                  className="grid gap-2 rounded-md border border-[#f00018]/35 bg-[#050505] p-3.5"
                >
                  <strong className="block">{roleLabels[role]}</strong>
                  {rolePermissions[role].map((permission) => (
                    <span className="text-sm text-zinc-400" key={permission}>
                      {permission}
                    </span>
                  ))}
                </article>
              ))}
            </div>
          </section>

          <section className={compactPanelClass}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <span className={eyebrowClass}>Administrador</span>
                <h2 className="text-2xl font-black leading-tight">Usuarios</h2>
              </div>
              <button
                className="inline-flex min-h-[42px] items-center justify-center rounded-md border border-[#f00018]/55 bg-[#0c0c0f] px-4 font-black uppercase text-white transition hover:bg-[#f00018]"
                type="button"
              >
                Convidar
              </button>
            </div>
            <div className="grid gap-3.5">
              {editorialUsers.map((user) => (
                <article
                  key={user.id}
                  className="grid grid-cols-[42px_1fr] items-center gap-3 rounded-md border border-[#f00018]/35 bg-[#050505] p-3.5"
                >
                  <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#f00018] font-black text-white">
                    {user.name.slice(0, 1)}
                  </span>
                  <div>
                    <strong className="block">{user.name}</strong>
                    <small className="block leading-normal text-zinc-400">
                      {user.email} · {roleLabels[user.role]}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={compactPanelClass}>
            <span className={eyebrowClass}>Seed</span>
            <h2 className="text-2xl font-black leading-tight">Dados iniciais</h2>
            <p className="my-4 leading-normal text-zinc-300">
              A rota <code>/api/seed</code> cria o administrador inicial e as
              categorias editoriais.
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <a
                className="inline-flex min-h-[42px] items-center justify-center rounded-md border border-[#f00018]/55 bg-[#0c0c0f] px-4 font-black uppercase text-white transition hover:bg-[#f00018]"
                href="/api/seed"
              >
                Ver seed
              </a>
              <form action="/api/seed" method="post">
                <button
                  className="inline-flex min-h-[42px] w-full items-center justify-center rounded-md bg-[#ffcc00] px-4 font-black uppercase text-[#111114]"
                  type="submit"
                >
                  Executar seed
                </button>
              </form>
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}
