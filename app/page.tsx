import Link from 'next/link'

const news = [
  {
    image:
      'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=300&q=80',
    title: 'ALE-RO aprova projetos que beneficiam a população',
    summary: 'Propostas incluem áreas da saúde, educação e infraestrutura.',
    meta: '16 de maio de 2025 • 2 min'
  },
  {
    image:
      'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=300&q=80',
    title: 'Operação da PM combate criminalidade em Rondônia',
    summary: 'Ação foi realizada em vários bairros da capital e interior do estado.',
    meta: '16 de maio de 2025 • 2 min'
  },
  {
    image:
      'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=300&q=80',
    title: 'Gasolina tem queda de preço em Rondônia nesta semana',
    summary: 'Levantamento aponta redução média nos postos de combustíveis.',
    meta: '16 de maio de 2025 • 2 min'
  },
  {
    image:
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=300&q=80',
    title: 'Rondônia intensifica combate ao desmatamento ilegal',
    summary: 'Operações integradas reforçam a fiscalização em áreas críticas.',
    meta: '15 de maio de 2025 • 3 min'
  },
  {
    image:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=300&q=80',
    title: 'Governo de RO lança programa de valorização dos professores',
    summary: 'Iniciativa prevê capacitação e novos incentivos para profissionais.',
    meta: '15 de maio de 2025 • 2 min'
  },
  {
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80',
    title: 'Obras na RO-010 avançam e beneficiam população',
    summary: 'Trecho que liga municípios recebe investimento em pavimentação.',
    meta: '15 de maio de 2025 • 2 min'
  }
]

const highlights = [
  {
    image:
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=160&q=80',
    title: 'Polícia prende suspeito de roubo em Porto Velho',
    meta: 'há 32 minutos'
  },
  {
    image:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=160&q=80',
    title: 'Governo anuncia novos investimentos para Rondônia',
    meta: 'há 1 hora'
  },
  {
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=160&q=80',
    title: 'Produtores de café comemoram alta na exportação',
    meta: 'há 2 horas'
  }
]

const categories = [
  ['🛡️', 'Polícia'],
  ['🏛️', 'Política'],
  ['📍', 'Cidades'],
  ['🌿', 'Meio Ambiente'],
  ['🌱', 'Agro'],
  ['💚', 'Saúde']
]

const cardClass = 'rounded-[5px] border border-[#dfe5ee] bg-white p-5'
const cardTitleClass =
  'border-b-2 border-[#dfe5ee] pb-2.5 text-2xl font-bold uppercase'

export default function Home() {
  return (
    <main className="mx-auto grid max-w-[1250px] grid-cols-1 gap-[25px] px-5 py-7 lg:grid-cols-[1fr_400px]">
      <section>
        <article className="relative h-[460px] overflow-hidden rounded bg-black text-white lg:h-[545px]">
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1100&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/85" />
          <span className="absolute left-8 top-9 rounded bg-[#07337a] px-[18px] py-2 font-bold uppercase">
            Cidades
          </span>
          <div className="absolute bottom-6 left-6 right-8">
            <h1 className="mb-3 max-w-[680px] text-[32px] font-bold leading-[1.05] lg:text-[42px]">
              Porto Velho terá nova orla turística no rio Madeira
            </h1>
            <p className="mb-5 max-w-[720px] text-xl lg:text-[22px]">
              Projeto vai requalificar a orla, promover turismo, lazer e
              desenvolvimento econômico para a capital.
            </p>
            <div>▣ 16 de maio de 2025 &nbsp;&nbsp; ◉ 3 min de leitura</div>
          </div>
        </article>

        <div className="my-[25px] grid grid-cols-1 rounded border border-[#dfe5ee] bg-white md:grid-cols-3 lg:grid-cols-6">
          {categories.map(([icon, label]) => (
            <div
              className="border-b border-[#dfe5ee] p-[22px_5px] text-center text-[33px] md:border-r lg:border-b-0"
              key={label}
            >
              {icon}
              <b className="mt-2 block text-[15px] uppercase">{label}</b>
            </div>
          ))}
        </div>

        <h2 className={cardTitleClass}>Últimas Notícias</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {news.map((item) => (
            <article
              className="grid grid-cols-1 gap-3.5 border-b border-[#dfe5ee] pb-4 sm:grid-cols-[130px_1fr]"
              key={item.title}
            >
              <img
                alt=""
                className="h-[125px] w-full rounded-[5px] object-cover"
                src={item.image}
              />
              <div>
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="mb-2 text-[#344]">{item.summary}</p>
                <small className="mt-2 block text-[#667]">{item.meta}</small>
              </div>
            </article>
          ))}
        </div>
        <button
          className="my-5 w-full rounded-[5px] border border-[#dfe5ee] bg-white p-4 font-black uppercase text-[#061b3d]"
          type="button"
        >
          Ver mais notícias⌄
        </button>
      </section>

      <aside className="grid content-start gap-[25px]">
        <div className={cardClass}>
          <h2 className={cardTitleClass}>Destaques</h2>
          {highlights.map((item) => (
            <div
              className="grid grid-cols-[115px_1fr] gap-3.5 border-b border-[#dfe5ee] py-[13px]"
              key={item.title}
            >
              <img
                alt=""
                className="h-[125px] w-full rounded-[5px] object-cover"
                src={item.image}
              />
              <p>
                <b className="text-[17px]">{item.title}</b>
                <small className="mt-2 block text-[#667]">{item.meta}</small>
              </p>
            </div>
          ))}
          <a className="mt-5 block text-center font-black uppercase">
            Ver todas as notícias →
          </a>
        </div>

        <div className={cardClass}>
          <h2 className={cardTitleClass}>✉ Boletim Informativo</h2>
          <p>Receba as principais notícias no seu e-mail.</p>
          <input
            className="my-3 w-full rounded border border-[#dfe5ee] p-[15px]"
            placeholder="Digite seu e-mail"
          />
          <button
            className="w-full rounded bg-[#052b67] px-6 py-3 font-black uppercase text-white"
            type="button"
          >
            Assinar
          </button>
        </div>

        <div className={cardClass}>
          <h2 className={cardTitleClass}>Redes Sociais</h2>
          <p>Siga o Giro Radar Notícias.</p>
          {[
            ['📷 @giroradarnoticias', 'Seguir'],
            ['f Giro Radar Notícias', 'Curtir'],
            ['▶ Giro Radar Notícias', 'Inscrever-se'],
            ['🟢 Grupo no WhatsApp', 'Entrar']
          ].map(([label, action]) => (
            <div
              className="flex items-center justify-between border-b border-[#dfe5ee] py-2.5"
              key={label}
            >
              {label}
              <button
                className="rounded bg-[#052b67] px-[15px] py-2 font-black uppercase text-white"
                type="button"
              >
                {action}
              </button>
            </div>
          ))}
        </div>

        <div className={cardClass}>
          <h2 className={cardTitleClass}>Área Administrativa</h2>
          <p>Acesso restrito para editor, revisor e administrador.</p>
          <Link
            className="mt-4 flex min-h-[42px] w-full items-center justify-center rounded bg-[#e31837] px-[18px] font-black uppercase text-white"
            href="/admin"
          >
            Acessar painel
          </Link>
        </div>
      </aside>
    </main>
  )
}
