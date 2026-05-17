import { FaFacebookF, FaInstagram, FaLinkedinIn, FaDiscord } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-black relative z-10">
      <div className="section py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col items-center md:items-start">
          <div className="font-mono text-[10px] text-white font-black tracking-[0.3em] uppercase">CS SOCIETY // IIUI</div>
          <div className="font-mono text-[8px] text-muted mt-2 tracking-widest">
            © {new Date().getFullYear()} — OPERATIONAL_INTELLIGENCE_UNIT.ARC
          </div>
        </div>

        <nav className="flex gap-10 text-lg text-muted">
          {[
            { Icon: FaFacebookF, href: '#' },
            { Icon: FaInstagram, href: '#' },
            { Icon: FaLinkedinIn, href: '#' },
            { Icon: FaDiscord, href: '#' }
          ].map(({ Icon, href }, i) => (
            <a key={i} href={href} className="transition-all hover:text-white hover:-translate-y-1" aria-label="Social">
              <Icon />
            </a>
          ))}
        </nav>

        <a className="btn text-[9px] px-10 border-white/20" href="/about#join">Initialize Membership</a>
      </div>
    </footer>
  );
}
