'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type MainNewsCarouselItem = {
  href: string
  image: string
  title: string
  summary: string
  category: string
  meta: string
}

type MainNewsCarouselProps = {
  items: MainNewsCarouselItem[]
}

const AUTOPLAY_DELAY = 7000
const WHEEL_COOLDOWN = 650
const WHEEL_THRESHOLD = 20

export function MainNewsCarousel({ items }: MainNewsCarouselProps) {
  const slides = useMemo(() => items.slice(0, 7), [items])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const lastWheelAtRef = useRef(0)

  const showNextSlide = useCallback(() => {
    setActiveIndex(currentIndex => (currentIndex + 1) % slides.length)
  }, [slides.length])

  const showPreviousSlide = useCallback(() => {
    setActiveIndex(
      currentIndex => (currentIndex - 1 + slides.length) % slides.length
    )
  }, [slides.length])

  useEffect(() => {
    if (isPaused || slides.length <= 1) {
      return
    }

    const interval = window.setInterval(showNextSlide, AUTOPLAY_DELAY)

    return () => window.clearInterval(interval)
  }, [isPaused, showNextSlide, slides.length])

  useEffect(() => {
    const carousel = carouselRef.current

    if (!carousel || slides.length <= 1) {
      return
    }

    function handleWheel(event: WheelEvent) {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) {
        return
      }

      event.preventDefault()

      const now = Date.now()

      if (now - lastWheelAtRef.current < WHEEL_COOLDOWN) {
        return
      }

      lastWheelAtRef.current = now

      if (event.deltaY > 0) {
        showNextSlide()
        return
      }

      showPreviousSlide()
    }

    carousel.addEventListener('wheel', handleWheel, { passive: false })

    return () => carousel.removeEventListener('wheel', handleWheel)
  }, [showNextSlide, showPreviousSlide, slides.length])

  if (slides.length === 0) {
    return null
  }

  return (
    <div
      className="relative h-[460px] overflow-hidden rounded border border-[#f00018]/45 bg-black text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)] lg:h-[545px]"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={carouselRef}
    >
      {slides.map((item, index) => {
        const isActive = index === activeIndex

        return (
          <Link
            aria-hidden={!isActive}
            className={`absolute inset-0 block transition-opacity duration-700 ${
              isActive
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
            href={item.href}
            key={item.href}
            tabIndex={isActive ? 0 : -1}
          >
            <Image
              alt=""
              fill
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
              sizes="(min-width: 1024px) 825px, calc(100vw - 40px)"
              className="absolute inset-0 h-full w-full object-cover"
              src={item.image}
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.78),rgba(20,0,3,0.58),rgba(0,0,0,0.92))]" />
            <span className="absolute left-5 top-6 rounded bg-[#f00018] px-[18px] py-2 font-black uppercase sm:left-8 sm:top-9">
              {item.category}
            </span>
            <div className="absolute bottom-16 left-5 right-5 sm:bottom-14 sm:left-6 sm:right-8">
              <h1 className="mb-3 max-w-[680px] text-[30px] font-black italic leading-[1.05] text-[#ffcc00] sm:text-[32px] lg:text-[42px]">
                {item.title}
              </h1>
              <p className="mb-5 max-w-[720px] text-lg font-bold sm:text-xl lg:text-[22px]">
                {item.summary}
              </p>
              <div>{item.meta}</div>
            </div>
          </Link>
        )
      })}

      {slides.length > 1 ? (
        <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center gap-2 sm:left-6">
          {slides.map((item, index) => (
            <button
              aria-label={`Ir para noticia principal ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? 'w-9 bg-[#ffcc00]'
                  : 'w-2.5 bg-white/55 hover:bg-white'
              }`}
              key={item.href}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
