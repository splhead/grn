import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'success'
  size?: 'default' | 'sm'
}

const variants = {
  default: 'bg-[#f00018] text-white hover:bg-[#c90015]',
  secondary: 'bg-[#ffcc00] text-[#111114] hover:bg-[#e5b800]',
  outline:
    'border border-[#f00018]/55 bg-[#0c0c0f] text-white hover:bg-[#f00018]',
  success: 'bg-[#ffcc00] text-[#111114] hover:bg-[#e5b800]'
}

const sizes = {
  default: 'min-h-12 px-5',
  sm: 'min-h-[42px] px-4'
}

export function Button({
  className,
  size = 'default',
  variant = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-black uppercase transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
