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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')
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
              <span className="flex min-h-12 overflow-hidden rounded-md border border-[#f00018]/45 bg-[#050505] transition focus-within:border-[#ffcc00] focus-within:ring-2 focus-within:ring-[#ffcc00]/20">
                <input
                  autoComplete="current-password"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3.5 py-3 text-base text-white outline-none placeholder:text-zinc-500"
                  minLength={6}
                  name="password"
                  placeholder="Digite sua senha"
                  required
                  type={isPasswordVisible ? 'text' : 'password'}
                />
                <button
                  aria-label={
                    isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
                  }
                  aria-pressed={isPasswordVisible}
                  className="flex w-12 flex-none items-center justify-center border-l border-[#f00018]/35 text-zinc-300 transition hover:bg-[#171717] hover:text-[#ffcc00]"
                  onClick={() =>
                    setIsPasswordVisible(currentValue => !currentValue)
                  }
                  type="button"
                >
                  {isPasswordVisible ? (
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3.3 2.3 21.7 20.7l-1.4 1.4-3.1-3.1A12.3 12.3 0 0 1 12 20C5.8 20 2.4 14.7 2.2 14.4a4.4 4.4 0 0 1 0-4.8 16 16 0 0 1 3-3.2L1.9 3.7l1.4-1.4Zm6.1 8.5a3 3 0 0 0 3.8 3.8l-3.8-3.8Zm2.6 7.2a10.6 10.6 0 0 0 3.6-.6l-1.8-1.8a5 5 0 0 1-6.4-6.4L6.7 7.9a13 13 0 0 0-2.8 2.8 2.4 2.4 0 0 0 0 2.6C4.4 14 7.1 18 12 18Zm9.8-7.6a4.4 4.4 0 0 1 0 4.1 13.3 13.3 0 0 1-1.7 2.1l-1.4-1.4a11 11 0 0 0 1.4-1.8 2.4 2.4 0 0 0 0-2.6C19.6 10 16.9 6 12 6a10.2 10.2 0 0 0-2.6.3L7.8 4.7A12.2 12.2 0 0 1 12 4c6.2 0 9.6 5.3 9.8 5.6v.8Zm-9.1-1.3a3 3 0 0 1 2.2 2.2l-2.2-2.2Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 4c6.2 0 9.6 5.3 9.8 5.6a4.4 4.4 0 0 1 0 4.8C21.6 14.7 18.2 20 12 20S2.4 14.7 2.2 14.4a4.4 4.4 0 0 1 0-4.8C2.4 9.3 5.8 4 12 4Zm0 2c-5 0-7.6 4-8.1 4.7a2.4 2.4 0 0 0 0 2.6C4.4 14 7 18 12 18s7.6-4 8.1-4.7a2.4 2.4 0 0 0 0-2.6C19.6 10 17 6 12 6Zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </button>
              </span>
            </Label>

            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 font-bold text-zinc-300">
                <Checkbox
                  checked={rememberMe}
                  name="remember"
                  onChange={event => setRememberMe(event.target.checked)}
                />
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
