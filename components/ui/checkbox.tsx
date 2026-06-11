import * as React from 'react'
import { cn } from '@/lib/utils'

export function Checkbox({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-5 w-5 rounded border-[#f00018]/45 accent-[#ffcc00]',
        className
      )}
      type="checkbox"
      {...props}
    />
  )
}
