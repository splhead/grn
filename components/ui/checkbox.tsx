import * as React from 'react'
import { cn } from '@/lib/utils'

export function Checkbox({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-5 w-5 rounded border-[#dfe5ee] accent-[#08285c]',
        className
      )}
      type="checkbox"
      {...props}
    />
  )
}
