import Image from 'next/image';
import logoImg from '@/assets/css.png';
import { FaInstagram, FaLinkedinIn } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface relative z-10">
      <div className="section py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* CSS Logo replacing standard text */}
        <div className="flex items-center select-none">
          <Image
            src={logoImg}
            alt="CS Society Logo"
            width={140}
            height={45}
            priority
            className="object-contain invert opacity-75 hover:opacity-100 transition-all duration-300"
          />
        </div>

        {/* Dynamic Social Icons (Keeping Instagram and LinkedIn, removing FB & Discord) */}
        <nav className="flex gap-10 text-lg text-muted">
          {[
            { Icon: FaInstagram, href: 'https://www.instagram.com/css.iiui?igsh=cHp5aTk3Z2E0YXhj' },
            { Icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/computer-science-society-css/' }
          ].map(({ Icon, href }, i) => (
            <a 
              key={i} 
              href={href} 
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:text-white hover:-translate-y-1" 
              aria-label="Social"
            >
              <Icon />
            </a>
          ))}
        </nav>

        <a 
          className="btn text-[9px] px-10" 
          href="/contact"
        >
          Contact Us
        </a>
      </div>
    </footer>
  );
}
