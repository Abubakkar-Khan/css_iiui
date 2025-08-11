export default function Footer(){
  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="section py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white/80">© {new Date().getFullYear()} The Computer Science Society</div>
        <div className="flex gap-4 text-xl">
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="Instagram">📷</a>
          <a href="#" aria-label="LinkedIn">💼</a>
          <a href="#" aria-label="Discord">🕹️</a>
        </div>
        <a className="btn" href="/about#join">Join Us</a>
      </div>
    </footer>
  )
}