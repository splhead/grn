import * as React from 'react'
import { cn } from '@/lib/utils'

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'min-h-12 min-w-0 rounded-md border border-[#dfe5ee] bg-slate-50 px-3.5 py-3 text-base text-[#061b3d] outline-none transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:border-[#08285c] focus:ring-2 focus:ring-[#08285c]/15 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
