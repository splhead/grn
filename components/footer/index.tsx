export default function Footer() {
  return (
    <footer className="mt-9 border-t border-[#f00018]/50 bg-[#08080a] text-white">
      <div className="mx-auto grid max-w-[1250px] gap-8 px-6 py-9 md:grid-cols-[1.2fr_1fr_1fr_1.3fr] lg:gap-11">
        <div>
          <div className="text-[34px] font-black italic">
            GIRO <span className="text-[#f00018]">RADAR</span>
          </div>
          <p className="mt-2 text-zinc-300">
            Informação com responsabilidade e compromisso com a verdade.
          </p>
        </div>
        <div>
          <h3 className="font-black uppercase text-[#ffcc00]">Institucional</h3>
          <a className="my-2.5 block">Quem somos</a>
          <a className="my-2.5 block">Política de Privacidade</a>
          <a className="my-2.5 block">Termos de Uso</a>
          <a className="my-2.5 block">Editoriais</a>
        </div>
        <div>
          <h3 className="font-black uppercase text-[#ffcc00]">Serviços</h3>
          <a className="my-2.5 block">Fale Conosco</a>
          <a className="my-2.5 block">Envie sua Notícia</a>
          <a className="my-2.5 block">Anuncie</a>
          <a className="my-2.5 block">Expediente</a>
        </div>
        <div>
          <h3 className="font-black uppercase text-[#ffcc00]">Contato</h3>
          <p>📍 Porto Velho - RO, Brasil</p>
          <p>📞 (69) 9 9300-0000</p>
          <p>✉ contato@giroradarnoticias.com.br</p>
        </div>
      </div>
      <div className="bg-[#f00018] px-6 py-[18px] font-bold text-white lg:px-[60px]">
        © 2025 Giro Radar Notícias. Todos os direitos reservados.
      </div>
    </footer>
  )
}
