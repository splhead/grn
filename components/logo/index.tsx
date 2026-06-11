export default function Logo() {
  return (
    <div className="flex items-center gap-3.5">
      <div className="text-[42px] font-black italic leading-[0.76] tracking-[2px] text-white drop-shadow-[0_2px_12px_rgba(227,24,55,0.45)] sm:text-[52px]">
        GIRO
        <br />
        <span className="text-[#f00018]">RADAR</span>
        <small className="mt-2.5 block border-t border-[#f00018] pt-2 text-[14px] tracking-[9px] text-white sm:text-[17px] sm:tracking-[11px]">
          NOTÍCIAS
        </small>
      </div>
      <div className="relative h-16 w-16 rounded-full border-[6px] border-white bg-[#111] shadow-[0_0_24px_rgba(240,0,24,0.38)] sm:h-[76px] sm:w-[76px]">
        <span className="absolute inset-3 rounded-full border-[6px] border-white" />
        <span className="absolute inset-[22px] rounded-full bg-[#f00018]" />
        <span className="absolute left-[-16px] top-1/2 h-0.5 w-[88px] -translate-y-1/2 bg-white sm:w-[98px]" />
        <span className="absolute left-1/2 top-[-16px] h-[88px] w-0.5 -translate-x-1/2 bg-white sm:h-[98px]" />
        <span className="absolute right-[-10px] top-2 h-4 w-8 -rotate-45 bg-[#f00018]" />
      </div>
    </div>
  )
}
