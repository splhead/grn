'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')
    const rememberMe = formData.get('remember') === 'on'

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe
    })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage('E-mail ou senha inválidos.')
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  return (
    <main className="mx-auto grid w-full max-w-[1280px] px-6 py-7">
      <section className="grid min-h-[620px] overflow-hidden rounded-lg border border-[#f00018]/45 bg-[#0c0c0f] text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)] lg:grid-cols-[minmax(0,1fr)_460px]">
        <div className="relative hidden min-h-full overflow-hidden bg-[#050505] lg:block">
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1100&q=80"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.94),rgba(90,0,8,0.58))]" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.08em] text-[#ffcc00]">
              Giro Radar Notícias
            </span>
            <h1 className="max-w-[620px] text-[44px] font-black italic leading-none">
              Área administrativa
            </h1>
            <p className="mt-4 max-w-[560px] text-lg leading-normal text-zinc-200">
              Ambiente restrito para edição, revisão e publicação das matérias.
            </p>
          </div>
        </div>

        <div className="grid content-center gap-7 p-5 sm:p-8 lg:p-10">
          <div>
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#ffcc00]">
              Acesso restrito
            </span>
            <h2 className="text-3xl font-black italic leading-tight text-white">
              Entrar no painel
            </h2>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <Label>
              E-mail
              <Input
                autoComplete="email"
                name="email"
                placeholder="editor@giroradarnoticias.com.br"
                required
                type="email"
              />
            </Label>

            <Label>
              Senha
              <Input
                autoComplete="current-password"
                minLength={6}
                name="password"
                placeholder="Digite sua senha"
                required
                type="password"
              />
            </Label>

            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 font-bold text-zinc-300">
                <Checkbox defaultChecked name="remember" />
                Manter conectado
              </label>
              <Link className="font-black text-[#ffcc00]" href="/login">
                Esqueci minha senha
              </Link>
            </div>

            {errorMessage ? (
              <p className="rounded-md border border-[#f00018]/45 bg-[#f00018]/10 px-4 py-3 text-sm font-bold text-red-100">
                {errorMessage}
              </p>
            ) : null}

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
