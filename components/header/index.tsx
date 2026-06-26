import Link from 'next/link'
import { getMenuCategories } from '@/lib/categories-cache'
import Logo from '../logo'

const VISIBLE_CATEGORY_COUNT = 8

async function getMenuItems() {
  const categories = await getMenuCategories()

  return [
    { href: '/noticias', id: 'all-news', label: 'Notícias' },
    ...categories.map(category => ({
      href: `/noticias?categoria=${category.slug}`,
      id: category.id,
      label: category.name
    }))
  ]
}

export default async function Header() {
  const menuItems = await getMenuItems()
  const [allNewsItem, ...categoryItems] = menuItems
  const visibleMenuItems = [
    allNewsItem,
    ...categoryItems.slice(0, VISIBLE_CATEGORY_COUNT)
  ]
  const extraMenuItems = categoryItems.slice(VISIBLE_CATEGORY_COUNT)

  return (
    <header>
      <div className="grid gap-5 border-b border-[#f00018]/50 bg-[linear-gradient(135deg,#050505_0%,#111114_58%,#3a0508_100%)] px-4 py-5 text-white shadow-[0_16px_44px_rgba(0,0,0,0.45)] sm:px-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:px-8 lg:px-[60px]">
        <div className="flex justify-center md:justify-start">
          <Logo />
        </div>

        <div className="grid gap-4 md:justify-items-end">
          <p className="text-center text-sm font-black italic leading-normal uppercase text-[#ffcc00] sm:text-base md:text-right lg:text-lg">
            Informação com responsabilidade.
            <br />
            <span className="text-white">Compromisso com a verdade.</span>
          </p>

          <div className="grid gap-3">
            <span className="px-3 py-2 text-center text-sm text-gray-400/50 md:text-right">
              Sexta-feira, 16 de maio de 2025
            </span>
            <form
              action="/noticias"
              className="flex min-h-11 w-full overflow-hidden rounded-md border border-white/25 bg-white md:w-[320px]"
            >
              <input
                aria-label="Buscar notícias"
                className="min-w-0 flex-1 border-0 px-3 font-bold text-[#111114] outline-0"
                name="busca"
                placeholder="Buscar notícias..."
              />
              <button
                className="flex w-12 items-center justify-center border-0 bg-[#f00018] text-lg text-white"
                type="submit"
              >
                ⌕
              </button>
            </form>
            <div className="text-center text-xl tracking-[8px] text-[#f00018] md:text-right">
              ● ● ▶ ☎
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[#f00018]/50 bg-[#08080a] font-bold uppercase shadow-[0_2px_18px_rgba(240,0,24,0.18)]">
        <details className="group md:hidden">
          <summary className="flex min-h-[58px] cursor-pointer list-none items-center justify-between px-4 text-white [&::-webkit-details-marker]:hidden">
            <span>Menu</span>
            <span className="text-2xl leading-none text-[#ffcc00] group-open:hidden">
              ☰
            </span>
            <span className="hidden text-2xl leading-none group-open:block">
              ×
            </span>
          </summary>
          <nav className="grid border-t border-[#f00018]/45">
            <Link className="bg-[#f00018] px-4 py-4 text-white" href="/">
              Início
            </Link>
            {visibleMenuItems.map(item => (
              <Link
                className="border-t border-white/10 px-4 py-4 text-white"
                href={item.href}
                key={item.id}
              >
                {item.label}
              </Link>
            ))}
            {extraMenuItems.length > 0 ? (
              <details className="group border-t border-white/10">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-[#ffcc00] [&::-webkit-details-marker]:hidden">
                  <span>Mais</span>
                  <span className="group-open:hidden">⌄</span>
                  <span className="hidden group-open:block">⌃</span>
                </summary>
                <div className="grid border-t border-white/10 bg-[#050505]">
                  {extraMenuItems.map(item => (
                    <Link
                      className="border-t border-white/10 px-6 py-4 text-white"
                      href={item.href}
                      key={item.id}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : null}
          </nav>
        </details>

        <nav className="mx-auto hidden min-h-[66px] max-w-[1250px] flex-wrap items-stretch overflow-visible px-5 md:flex">
          <Link
            className="flex items-center bg-[#f00018] px-7 py-5 text-2xl text-white"
            href="/"
          >
            ⌂
          </Link>
          {visibleMenuItems.map(item => (
            <Link
              className="flex items-center whitespace-nowrap px-[18px] py-5 text-white transition hover:bg-[#f00018] hover:text-white"
              href={item.href}
              key={item.id}
            >
              {item.label}
            </Link>
          ))}
          {extraMenuItems.length > 0 ? (
            <details className="group relative flex">
              <summary className="flex cursor-pointer list-none items-center whitespace-nowrap px-[18px] py-5 text-[#ffcc00] transition hover:bg-[#f00018] hover:text-white [&::-webkit-details-marker]:hidden">
                Mais⌄
              </summary>
              <div className="absolute left-0 top-full z-20 hidden min-w-56 border border-[#f00018]/50 bg-[#08080a] shadow-[0_18px_36px_rgba(0,0,0,0.45)] group-open:grid">
                {extraMenuItems.map(item => (
                  <Link
                    className="border-b border-white/10 px-4 py-3 text-white transition last:border-b-0 hover:bg-[#f00018]"
                    href={item.href}
                    key={item.id}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
