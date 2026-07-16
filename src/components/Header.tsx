import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Menu, X, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Custom SVG Brand Icons since Lucide v0.400+ removed them
const GithubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Início', href: '/#inicio' },
    { name: 'Sobre', href: '/#sobre' },
    { name: 'Produtos', href: '/#produtos' },
    { name: 'Portfólio', href: '/#portfolio' },
    { name: 'Contato', href: '/#contato' }
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-gray/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo (Left) */}
        <Link to="/" className="flex items-center gap-2 group">
          <Terminal className="text-brand-neon w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-space font-bold tracking-widest text-lg text-white">
            AUTOMATION <span className="text-brand-neon">TEST</span>
          </span>
        </Link>

        {/* Desktop Nav Links (Center) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 relative group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-neon transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button (Right) */}
        <div className="hidden md:flex items-center">
          <motion.a
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 0 15px rgba(204, 255, 0, 0.4)" 
            }}
            whileTap={{ scale: 0.98 }}
            href="/#contato"
            className="px-5 py-2.5 bg-transparent border border-brand-neon text-brand-neon font-medium rounded text-sm flex items-center gap-2 transition-shadow duration-300"
          >
            Solicitar Orçamento
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-400 hover:text-white focus:outline-none p-2"
          aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden w-full bg-brand-dark/95 border-b border-brand-gray/60 backdrop-blur-lg overflow-hidden absolute top-20 left-0"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium text-gray-400 hover:text-white transition-colors py-2 border-b border-brand-gray/30"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
              <div className="pt-4 flex flex-col gap-6">
                <a
                  href="/#contato"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 bg-brand-neon text-black font-semibold rounded text-sm hover:shadow-[0_0_15px_rgba(204,255,0,0.5)] transition-shadow duration-300"
                >
                  Solicitar Orçamento
                </a>
                
                {/* Mobile Socials */}
                <div className="flex justify-center gap-6 text-gray-400">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon transition-colors">
                    <GithubIcon />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon transition-colors">
                    <LinkedinIcon />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon transition-colors">
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
