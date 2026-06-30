'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type GoogleAdsenseAdProps = {
  className?: string
  slot?: string
}

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
const defaultSlot = process.env.NEXT_PUBLIC_ADSENSE_NEWS_SLOT

export function GoogleAdsenseAd({
  className = '',
  slot = defaultSlot
}: GoogleAdsenseAdProps) {
  const canRenderAd = Boolean(adsenseClient && slot)

  useEffect(() => {
    if (!canRenderAd) {
      return
    }

    try {
      window.adsbygoogle = window.adsbygoogle ?? []
      window.adsbygoogle.push({})
    } catch {
      // AdSense can throw when the browser blocks ads or the slot is not ready.
    }
  }, [canRenderAd])

  if (!canRenderAd) {
    return null
  }

  return (
    <aside
      aria-label="Publicidade"
      className={`overflow-hidden rounded border border-[#f00018]/35 bg-[#0c0c0f] ${className}`}
    >
      <ins
        className="adsbygoogle block min-h-[120px] w-full"
        data-ad-client={adsenseClient}
        data-ad-format="auto"
        data-ad-slot={slot}
        data-full-width-responsive="true"
        style={{ display: 'block' }}
      />
    </aside>
  )
}
