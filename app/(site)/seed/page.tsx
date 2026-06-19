'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type SeedResponse = {
  message?: string
  adminsFound?: number
  adminsCreated?: number
  credentialAccountsCreated?: number
}

export default function SeedPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<SeedResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  async function runSeed() {
    setIsSubmitting(true)
    setResponse(null)
    setErrorMessage('')

    try {
      const result = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        }
      })
      const data = (await result.json()) as SeedResponse

      if (!result.ok) {
        setErrorMessage(data.message ?? 'Nao foi possivel executar o seed.')
        return
      }

      setResponse(data)
    } catch {
      setErrorMessage('Nao foi possivel conectar com a API de seed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-[920px] gap-6 px-6 py-10 text-white">
      <section className="grid gap-6 rounded-lg border border-[#f00018]/45 bg-[#0c0c0f] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.08em] text-[#ffcc00]">
            Banco de dados
          </span>
          <h1 className="text-3xl font-black italic leading-tight">
            Executar seed inicial
          </h1>
          <p className="max-w-[680px] text-sm font-medium leading-6 text-zinc-300">
            Cria os administradores iniciais e garante as credenciais usadas no login do painel.
          </p>
        </div>

        <Button className="w-full sm:w-fit" disabled={isSubmitting} onClick={runSeed} type="button">
          {isSubmitting ? 'Executando...' : 'Executar seed'}
        </Button>

        {errorMessage ? (
          <p className="rounded-md border border-[#f00018]/45 bg-[#f00018]/10 px-4 py-3 text-sm font-bold text-red-100">
            {errorMessage}
          </p>
        ) : null}

        {response ? (
          <div className="grid gap-3 rounded-md border border-[#ffcc00]/35 bg-[#ffcc00]/10 p-4 text-sm font-bold text-zinc-100">
            <p>{response.message ?? 'Seed executado com sucesso.'}</p>
            <dl className="grid gap-2 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase text-zinc-400">Admins encontrados</dt>
                <dd className="text-xl text-[#ffcc00]">{response.adminsFound ?? 0}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-400">Admins criados</dt>
                <dd className="text-xl text-[#ffcc00]">{response.adminsCreated ?? 0}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-400">Credenciais criadas</dt>
                <dd className="text-xl text-[#ffcc00]">
                  {response.credentialAccountsCreated ?? 0}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>
    </main>
  )
}
