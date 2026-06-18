'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

type PublicationDatePickerProps = {
  defaultValue?: string
  name: string
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <rect
        fill="none"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        width="18"
        x="3"
        y="4"
      />
      <path
        d="M8 2v4M16 2v4M3 10h18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function parseDefaultValue(value: string) {
  const [datePart, timePart] = value.split('T')

  if (!datePart) {
    return {
      date: undefined,
      time: '09:00'
    }
  }

  return {
    date: new Date(`${datePart}T00:00:00`),
    time: timePart?.slice(0, 5) || '09:00'
  }
}

function formatFormValue(date: Date | undefined, time: string) {
  if (!date) {
    return ''
  }

  return `${format(date, 'yyyy-MM-dd')}T${time}`
}

export default function PublicationDatePicker({
  defaultValue = '',
  name
}: PublicationDatePickerProps) {
  const initialValue = useMemo(() => parseDefaultValue(defaultValue), [defaultValue])
  const [date, setDate] = useState<Date | undefined>(initialValue.date)
  const [time, setTime] = useState(initialValue.time)
  const value = formatFormValue(date, time)
  const [hour, minute] = time.split(':')

  return (
    <div className="grid gap-3">
      <input name={name} type="hidden" value={value} />
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="inline-flex min-h-12 w-full items-center justify-start gap-3 rounded-md border border-[#f00018]/45 bg-[#050505] px-3.5 py-3 text-left text-base text-white outline-none transition hover:border-[#ffcc00]/70 focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/20"
            type="button"
          >
            <CalendarIcon />
            <span className={date ? 'font-semibold' : 'text-zinc-500'}>
              {date
                ? `${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} as ${time}`
                : 'Selecionar data e hora'}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <Calendar
            mode="single"
            onSelect={setDate}
            selected={date}
            timeZone="America/Manaus"
          />

          <div className="grid gap-3 border-t border-[#f00018]/35 p-4">
            <span className="text-xs font-black uppercase text-zinc-400">
              Hora de publicacao
            </span>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <label className="grid gap-1 text-xs font-bold uppercase text-zinc-500">
                Hora
                <select
                  className="h-11 rounded-md border border-[#f00018]/35 bg-[#050505] px-3 text-sm font-black text-white outline-none transition focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/20"
                  onChange={(event) => setTime(`${event.target.value}:${minute}`)}
                  value={hour}
                >
                  {Array.from({ length: 24 }, (_, index) => {
                    const option = String(index).padStart(2, '0')

                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    )
                  })}
                </select>
              </label>
              <span className="pt-5 text-lg font-black text-zinc-500">:</span>
              <label className="grid gap-1 text-xs font-bold uppercase text-zinc-500">
                Minuto
                <select
                  className="h-11 rounded-md border border-[#f00018]/35 bg-[#050505] px-3 text-sm font-black text-white outline-none transition focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/20"
                  onChange={(event) => setTime(`${hour}:${event.target.value}`)}
                  value={minute}
                >
                  {Array.from({ length: 12 }, (_, index) => {
                    const option = String(index * 5).padStart(2, '0')

                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    )
                  })}
                </select>
              </label>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {value && (
        <p className="text-xs font-semibold text-zinc-500">
          Publicacao:{' '}
          {format(
            new Date(`${format(date as Date, 'yyyy-MM-dd')}T${time}`),
            'dd/MM/yyyy HH:mm'
          )}
        </p>
      )}
    </div>
  )
}
