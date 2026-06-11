import * as React from 'react'
import { cn } from '@/lib/utils'

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'min-h-12 min-w-0 rounded-md border border-[#f00018]/45 bg-[#050505] px-3.5 py-3 text-base text-white outline-none transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/20 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
