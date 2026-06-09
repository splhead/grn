import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'success'
  size?: 'default' | 'sm'
}

const variants = {
  default: 'bg-[#08285c] text-white hover:bg-[#061b3d]',
  secondary: 'bg-[#e31837] text-white hover:bg-[#c7142f]',
  outline:
    'border border-[#dfe5ee] bg-white text-[#061b3d] hover:bg-[#f5f7fb]',
  success: 'bg-[#138a3d] text-white hover:bg-[#0f7031]'
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
