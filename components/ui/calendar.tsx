'use client'

import * as React from 'react'
import {
  DayPicker,
  getDefaultClassNames,
  type DayPickerProps
} from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import { cn } from '@/lib/utils'

export function Calendar({
  className,
  classNames,
  locale = ptBR,
  styles,
  ...props
}: DayPickerProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      className={cn('p-3', className)}
      classNames={{
        root: cn(defaultClassNames.root, 'text-zinc-200'),
        months: cn(defaultClassNames.months, 'flex flex-col gap-4'),
        month: cn(defaultClassNames.month, 'space-y-4'),
        month_caption: cn(
          defaultClassNames.month_caption,
          'flex h-10 items-center justify-center'
        ),
        caption_label: cn(
          defaultClassNames.caption_label,
          'text-sm font-black uppercase text-white'
        ),
        nav: cn(defaultClassNames.nav, 'absolute inset-x-3 top-3 flex justify-between'),
        button_previous: cn(
          defaultClassNames.button_previous,
          'inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#f00018]/45 text-white transition hover:bg-[#171717] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 [&_svg]:text-white'
        ),
        button_next: cn(
          defaultClassNames.button_next,
          'inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#f00018]/45 text-white transition hover:bg-[#171717] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 [&_svg]:text-white'
        ),
        chevron: cn(defaultClassNames.chevron, 'fill-white text-white'),
        month_grid: cn(defaultClassNames.month_grid, 'w-full border-collapse'),
        weekdays: cn(defaultClassNames.weekdays, 'flex'),
        weekday: cn(
          defaultClassNames.weekday,
          'w-9 rounded-md text-center text-[0.72rem] font-black uppercase text-zinc-500'
        ),
        week: cn(defaultClassNames.week, 'mt-2 flex w-full'),
        day: cn(defaultClassNames.day, 'relative h-9 w-9 p-0 text-center text-sm'),
        day_button: cn(
          defaultClassNames.day_button,
          'h-9 w-9 rounded-md font-bold text-zinc-200 transition hover:bg-[#171717] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcc00]/30'
        ),
        selected: cn(
          defaultClassNames.selected,
          '[&>button]:bg-[#ffcc00] [&>button]:text-[#111114] [&>button]:hover:bg-[#ffcc00]'
        ),
        today: cn(defaultClassNames.today, '[&>button]:border [&>button]:border-[#f00018]'),
        outside: cn(defaultClassNames.outside, '[&>button]:text-zinc-700'),
        disabled: cn(
          defaultClassNames.disabled,
          '[&>button]:cursor-not-allowed [&>button]:opacity-40'
        ),
        hidden: cn(defaultClassNames.hidden, 'invisible'),
        ...classNames
      }}
      styles={{
        ...styles,
        chevron: {
          ...styles?.chevron,
          fill: '#ffffff',
          color: '#ffffff'
        }
      }}
      locale={locale}
      {...props}
    />
  )
}
