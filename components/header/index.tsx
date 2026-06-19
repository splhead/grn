import Link from 'next/link'
import Logo from '../logo'

const menuItems = [
  { href: '/', label: 'Notícias' },
  { href: '/#cidades', label: 'Cidades⌄' },
  { href: '/#policia', label: 'Polícia' },
  { href: '/#politica', label: 'Política' },
  { href: '/#economia', label: 'Economia' },
  { href: '/#agro', label: 'Agro' },
  { href: '/#meio-ambiente', label: 'Meio Ambiente' },
  { href: '/#educacao', label: 'Educação' },
  { href: '/#saude', label: 'Saúde' },
  { href: '/#turismo', label: 'Turismo' }
]

export default function Header() {
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
            <form className="flex min-h-11 w-full overflow-hidden rounded-md border border-white/25 bg-white md:w-[320px]">
              <input
                aria-label="Buscar notícias"
                className="min-w-0 flex-1 border-0 px-3 font-bold text-[#111114] outline-0"
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
            {menuItems.map(item => (
              <Link
                className="border-t border-white/10 px-4 py-4 text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <a className="border-t border-white/10 px-4 py-4 text-[#ffcc00]">
              Mais⌄
            </a>
          </nav>
        </details>

        <nav className="hidden min-h-[66px] items-center overflow-x-auto md:flex">
          <Link
            className="flex-none bg-[#f00018] px-7 py-5 text-2xl text-white"
            href="/"
          >
            ⌂
          </Link>
          {menuItems.map(item => (
            <Link
              className="flex-none px-[18px] py-6 text-white transition hover:bg-[#f00018] hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <a className="flex-none px-[18px] py-6 text-[#ffcc00]">Mais⌄</a>
        </nav>
      </div>
    </header>
  )
}
