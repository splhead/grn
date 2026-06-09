export default function Logo() {
  return (
    <div className="flex items-center gap-3.5">
      <div className="text-[42px] font-black italic leading-[0.76] tracking-[2px] text-white sm:text-[52px]">
        GIRO
        <br />
        <span className="text-[#e31837]">RADAR</span>
        <small className="mt-2.5 block text-[14px] tracking-[9px] text-white sm:text-[17px] sm:tracking-[11px]">
          NOTÍCIAS
        </small>
      </div>
      <div className="relative h-16 w-16 rounded-full border-[6px] border-[#e31837] sm:h-[76px] sm:w-[76px]">
        <span className="absolute left-[-16px] top-1/2 h-0.5 w-[88px] -translate-y-1/2 bg-white sm:w-[98px]" />
        <span className="absolute left-1/2 top-[-16px] h-[88px] w-0.5 -translate-x-1/2 bg-white sm:h-[98px]" />
      </div>
    </div>
  )
}
