export type Role = 'editor' | 'reviewer' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string
}

export type NewsArticle = {
  id: string
  title: string
  subtitle: string
  coverImage?: string
  placement: 'main_cover' | 'highlights' | 'latest'
  publishedAt: string
  updatedAt: string
  categories: string[]
  body: string
  authorId: string
  status: 'draft' | 'review' | 'published' | 'archived'
}

export type SeedData = {
  users: User[]
  categories: Category[]
  articles: NewsArticle[]
}

export const seedData: SeedData = {
  users: [
    {
      id: 'usr-admin',
      name: 'Administrador GRN',
      email: 'admin@giroradarnoticias.com.br',
      role: 'admin',
      active: true
    }
  ],
  categories: [
    {
      id: 'cat-politica',
      name: 'Politica',
      slug: 'politica',
      description: 'Poder publico, legislativo, executivo e bastidores.'
    },
    {
      id: 'cat-cidades',
      name: 'Cidades',
      slug: 'cidades',
      description: 'Cotidiano, infraestrutura e servicos municipais.'
    },
    {
      id: 'cat-policia',
      name: 'Policia',
      slug: 'policia',
      description: 'Seguranca publica, operacoes e ocorrencias.'
    },
    {
      id: 'cat-economia',
      name: 'Economia',
      slug: 'economia',
      description: 'Mercado, consumo, emprego e negocios.'
    },
    {
      id: 'cat-agro',
      name: 'Agro',
      slug: 'agro',
      description: 'Producao rural, safras, tecnologia e exportacao.'
    },
    {
      id: 'cat-saude',
      name: 'Saude',
      slug: 'saude',
      description: 'Atendimento, prevencao, vigilancia e bem-estar.'
    }
  ],
  articles: [
    {
      id: 'art-orla-madeira',
      title: 'Porto Velho tera nova orla turistica no rio Madeira',
      subtitle:
        'Projeto vai requalificar a orla e ampliar opcoes de lazer, turismo e economia criativa.',
      coverImage:
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      placement: 'main_cover',
      publishedAt: '2026-06-08T09:00:00-04:00',
      updatedAt: '2026-06-08T11:30:00-04:00',
      categories: ['cat-cidades', 'cat-economia'],
      body:
        '<p>A proposta inclui novo calcamento, iluminacao publica, paisagismo e areas de convivencia. A prefeitura informou que o projeto sera executado em etapas.</p><p>Com a obra, a expectativa e fortalecer o turismo local e criar oportunidades para pequenos empreendedores.</p>',
      authorId: 'usr-admin',
      status: 'published'
    },
    {
      id: 'art-vacinacao',
      title: 'Campanha de vacinacao amplia pontos de atendimento',
      subtitle:
        'Unidades de saude e equipes volantes atendem bairros com maior procura nesta semana.',
      coverImage:
        'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
      placement: 'latest',
      publishedAt: '2026-06-07T15:00:00-04:00',
      updatedAt: '2026-06-07T15:00:00-04:00',
      categories: ['cat-saude', 'cat-cidades'],
      body:
        '<p>A secretaria reforcou que a populacao deve levar documento com foto e carteira de vacinacao. O calendario completo sera divulgado pelos canais oficiais.</p>',
      authorId: 'usr-admin',
      status: 'review'
    },
    {
      id: 'art-agro-exportacao',
      title: 'Produtores comemoram alta na exportacao de cafe',
      subtitle:
        'Cooperativas registram aumento de demanda e planejam investir em qualidade do grao.',
      coverImage:
        'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80',
      placement: 'highlights',
      publishedAt: '2026-06-06T08:20:00-04:00',
      updatedAt: '2026-06-06T10:45:00-04:00',
      categories: ['cat-agro', 'cat-economia'],
      body:
        '<p>O resultado foi puxado por contratos internacionais e pelo trabalho de classificacao dos graos. Entidades do setor avaliam novas rodadas de capacitacao.</p>',
      authorId: 'usr-admin',
      status: 'published'
    }
  ]
}

let currentSeed: SeedData = structuredClone(seedData)

export function runSeed() {
  currentSeed = structuredClone(seedData)
  return currentSeed
}

export function getSeedData() {
  return currentSeed
}
