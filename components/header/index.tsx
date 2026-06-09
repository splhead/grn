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
      <div className="flex flex-col items-center justify-between gap-4 bg-gradient-to-br from-[#071d41] to-[#092756] px-5 py-7 text-center text-white lg:flex-row lg:px-[60px] lg:text-left">
        <Logo />
        <p className="text-lg leading-normal uppercase">
          Informação com responsabilidade.
          <br />
          Compromisso com a verdade.
        </p>
        <div className="grid gap-3 text-center lg:text-right">
          <span>Sexta-feira, 16 de maio de 2025</span>
          <div className="flex rounded-md bg-white p-2">
            <input
              className="w-[210px] border-0 text-[#061b3d] outline-0 lg:w-[280px]"
              placeholder="Buscar notícias..."
            />
            <button className="border-0 bg-white text-lg" type="button">
              🔍
            </button>
          </div>
          <div className="text-2xl tracking-[8px]">● ● ▶ ☎</div>
        </div>
      </div>

      <nav className="flex min-h-[66px] items-center overflow-x-auto border-b border-[#dfe5ee] bg-white font-bold uppercase shadow-[0_2px_8px_#0001]">
        <Link
          className="flex-none bg-[#08285c] px-7 py-5 text-2xl text-white"
          href="/"
        >
          ⌂
        </Link>
        {menuItems.map((item) => (
          <Link className="flex-none px-[18px] py-6" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
        <a className="flex-none px-[18px] py-6">Mais⌄</a>
      </nav>
    </header>
  )
}
