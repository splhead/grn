import { seedData, type Category, type NewsArticle, type Role } from '@/lib/news-seed'

export const roleLabels: Record<Role, string> = {
  editor: 'Editor',
  reviewer: 'Revisor',
  admin: 'Administrador'
}

export const rolePermissions: Record<Role, string[]> = {
  editor: ['Redigir noticias', 'Vincular uma ou varias categorias'],
  reviewer: [
    'Redigir noticias',
    'Vincular categorias',
    'Gerir categorias editoriais'
  ],
  admin: ['Gerir usuarios', 'Gerir permissoes', 'Acessar todas as areas']
}

export const editorialUsers = [
  ...seedData.users,
  {
    id: 'usr-editor',
    name: 'Marina Costa',
    email: 'editor@giroradarnoticias.com.br',
    role: 'editor' as Role,
    active: true
  },
  {
    id: 'usr-reviewer',
    name: 'Rafael Nunes',
    email: 'revisor@giroradarnoticias.com.br',
    role: 'reviewer' as Role,
    active: true
  }
]

export const panelClass = 'rounded-lg border border-[#dfe5ee] bg-white p-4 sm:p-6'
export const compactPanelClass = 'rounded-lg border border-[#dfe5ee] bg-white p-5'
export const eyebrowClass =
  'mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#e31837]'
export const fieldClass = 'grid gap-2 text-sm font-extrabold text-slate-700'
export const inputClass =
  'min-h-12 min-w-0 rounded-md border border-[#dfe5ee] bg-slate-50 px-3.5 py-3 text-base text-[#061b3d] outline-none focus:border-[#08285c] focus:ring-2 focus:ring-[#08285c]/15'
export const statusClass =
  'inline-flex flex-none rounded-full px-2.5 py-1.5 text-xs font-black uppercase'

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function categoryNames(article: NewsArticle, categories: Category[]) {
  return article.categories
    .map(
      (categoryId) =>
        categories.find((category) => category.id === categoryId)?.name
    )
    .filter(Boolean)
    .join(', ')
}
