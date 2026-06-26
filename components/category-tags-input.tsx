'use client'

import { useMemo, useState } from 'react'

export type CategoryTagOption = {
  id: string
  name: string
  slug: string
}

type CategoryTagsInputProps = {
  categories: CategoryTagOption[]
  defaultSelectedIds?: string[]
  name?: string
}

export default function CategoryTagsInput({
  categories,
  defaultSelectedIds = [],
  name = 'categoryIds'
}: CategoryTagsInputProps) {
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState(defaultSelectedIds)

  const selectedCategories = useMemo(
    () =>
      selectedIds
        .map(categoryId =>
          categories.find(category => category.id === categoryId)
        )
        .filter((category): category is CategoryTagOption =>
          Boolean(category)
        ),
    [categories, selectedIds]
  )

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return categories
      .filter(category => !selectedIds.includes(category.id))
      .filter(category => {
        if (!normalizedQuery) {
          return true
        }

        return (
          category.name.toLowerCase().includes(normalizedQuery) ||
          category.slug.toLowerCase().includes(normalizedQuery)
        )
      })
      .slice(0, 8)
  }, [categories, query, selectedIds])

  function addCategory(categoryId: string) {
    setSelectedIds(currentIds =>
      currentIds.includes(categoryId) ? currentIds : [...currentIds, categoryId]
    )
    setQuery('')
  }

  function removeCategory(categoryId: string) {
    setSelectedIds(currentIds =>
      currentIds.filter(currentId => currentId !== categoryId)
    )
  }

  return (
    <div className="grid gap-3">
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-md border border-[#f00018]/45 bg-[#050505] p-2.5 focus-within:border-[#ffcc00] focus-within:ring-2 focus-within:ring-[#ffcc00]/20">
        {selectedCategories.map(category => (
          <span
            className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#ffcc00] px-3 text-sm font-black text-[#111114]"
            key={category.id}
          >
            {category.name}
            <button
              aria-label={`Remover categoria ${category.name}`}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111114] text-sm leading-none text-white"
              onClick={() => removeCategory(category.id)}
              type="button"
            >
              ×
            </button>
          </span>
        ))}
        <input
          aria-label="Buscar categorias"
          className="min-h-9 min-w-[180px] flex-1 bg-transparent px-1 text-base font-bold text-white outline-none placeholder:text-zinc-500"
          onChange={event => setQuery(event.target.value)}
          placeholder={
            selectedCategories.length > 0
              ? 'Adicionar outra categoria'
              : 'Buscar categorias'
          }
          value={query}
        />
      </div>

      {selectedIds.map(categoryId => (
        <input key={categoryId} name={name} type="hidden" value={categoryId} />
      ))}

      <div className="grid gap-2 rounded-md border border-[#f00018]/35 bg-[#050505] p-2">
        {suggestions.length > 0 ? (
          suggestions.map(category => (
            <button
              className="flex min-h-11 items-center justify-between rounded-md px-3 text-left font-bold text-white transition hover:bg-[#171717] hover:text-[#ffcc00]"
              key={category.id}
              onClick={() => addCategory(category.id)}
              type="button"
            >
              <span>{category.name}</span>
              <small className="text-zinc-500">{category.slug}</small>
            </button>
          ))
        ) : (
          <span className="px-3 py-2 text-sm font-bold text-zinc-500">
            Nenhuma categoria encontrada.
          </span>
        )}
      </div>
    </div>
  )
}
